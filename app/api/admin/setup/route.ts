import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { getAdminSetupKey } from "@/lib/admin";
import { getCurrentUser, verifyPassword } from "@/lib/auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** Compares secrets in constant time without leaking their lengths. */
function secretsMatch(provided: string, expected: string) {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  try {
    const setupKey = getAdminSetupKey();
    if (!setupKey) {
      return NextResponse.json(
        { error: "Admin setup is not configured on this deployment." },
        { status: 503, headers: noStore },
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401, headers: noStore },
      );
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: noStore });
    }
    const data = body as Record<string, unknown>;
    const providedKey = typeof data.setupKey === "string" ? data.setupKey.trim() : "";
    const password = typeof data.password === "string" ? data.password : "";
    if (!providedKey || !password) {
      return NextResponse.json({ error: "Enter the setup key and your password." }, { status: 400, headers: noStore });
    }

    if (!secretsMatch(providedKey, setupKey)) {
      return NextResponse.json({ error: "The setup key is not correct." }, { status: 401, headers: noStore });
    }

    const sql = getSql();
    const stored = await sql`SELECT password_hash FROM app_users WHERE id = ${user.id} LIMIT 1`;
    const hash = Array.isArray(stored) ? (stored[0] as { password_hash?: string | null } | undefined)?.password_hash : null;
    if (!hash || !(await verifyPassword(password, hash))) {
      return NextResponse.json({ error: "That password is not correct." }, { status: 401, headers: noStore });
    }

    // The "no admin yet" condition is part of the update so two simultaneous
    // claims cannot both succeed.
    const promoted = await sql`
      UPDATE app_users
      SET role = 'admin', updated_at = now()
      WHERE id = ${user.id}
        AND NOT EXISTS (SELECT 1 FROM app_users WHERE role = 'admin')
      RETURNING id
    `;
    if (!Array.isArray(promoted) || promoted.length === 0) {
      return NextResponse.json(
        { error: "An administrator already exists. Ask them to promote your account." },
        { status: 409, headers: noStore },
      );
    }

    try {
      await sql`
        INSERT INTO audit_events (actor_user_id, action, entity_type, entity_id)
        VALUES (${user.id}, 'admin.bootstrap', 'app_user', ${user.id})
      `;
    } catch (error) {
      console.error("Admin setup audit write failed", error instanceof Error ? error.message : "unknown error");
    }

    return NextResponse.json(
      { user: { id: user.id, email: user.email, role: "admin" } },
      { headers: noStore },
    );
  } catch (error) {
    console.error("Admin setup failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to complete admin setup right now." }, { status: 500, headers: noStore });
  }
}
