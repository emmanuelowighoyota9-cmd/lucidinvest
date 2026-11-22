import { NextRequest, NextResponse } from "next/server";
import { getCurrentSessionDigest, getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { getSql } from "@/lib/db";
import { isSameOriginRequest } from "@/lib/same-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

function rows<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as T[]) : [];
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "This action must be started from your security page." }, { status: 403, headers: noStore });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401, headers: noStore });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Account services are not configured on this deployment." }, { status: 503, headers: noStore });
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: noStore });
    }
    const data = body as Record<string, unknown>;
    const currentPassword = typeof data.currentPassword === "string" ? data.currentPassword : "";
    const newPassword = typeof data.newPassword === "string" ? data.newPassword : "";

    if (!currentPassword) {
      return NextResponse.json({ error: "Enter your current password." }, { status: 400, headers: noStore });
    }
    if (newPassword.length < 12 || newPassword.length > 128) {
      return NextResponse.json({ error: "Choose a password of 12–128 characters." }, { status: 400, headers: noStore });
    }
    if (newPassword === currentPassword) {
      return NextResponse.json({ error: "Choose a password you have not used here before." }, { status: 400, headers: noStore });
    }

    const sql = getSql();
    const stored = rows<{ password_hash: string | null }>(await sql`
      SELECT password_hash FROM app_users WHERE id = ${user.id} LIMIT 1
    `);
    const hash = stored[0]?.password_hash;
    if (!hash || !(await verifyPassword(currentPassword, hash))) {
      return NextResponse.json({ error: "That current password is not correct." }, { status: 401, headers: noStore });
    }

    const newHash = await hashPassword(newPassword);
    const digest = await getCurrentSessionDigest();

    // The password change, the revocation of every other session and the audit
    // row all happen in one statement.
    const result = rows<{ updated: number; revoked: number }>(await sql`
      WITH updated AS (
        UPDATE app_users
        SET password_hash = ${newHash}, updated_at = now()
        WHERE id = ${user.id}
        RETURNING id
      ), revoked AS (
        DELETE FROM auth_sessions
        WHERE user_id = ${user.id} AND token_hash <> ${digest ?? ""}
        RETURNING id
      ), audited AS (
        INSERT INTO audit_events (actor_user_id, action, entity_type, entity_id)
        SELECT id, 'auth.password_changed', 'app_user', id::text FROM updated
        RETURNING id
      )
      SELECT (SELECT count(*)::int FROM updated) AS updated,
             (SELECT count(*)::int FROM revoked) AS revoked
    `);

    return NextResponse.json(
      { ok: true, revokedSessions: Number(result[0]?.revoked ?? 0) },
      { headers: noStore },
    );
  } catch (error) {
    console.error("Password change failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to change the password right now." }, { status: 500, headers: noStore });
  }
}
