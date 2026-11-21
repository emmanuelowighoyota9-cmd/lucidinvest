import { NextResponse } from "next/server";
import { getCurrentSessionDigest, getCurrentUser } from "@/lib/auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401, headers: noStore });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Account services are not configured on this deployment." }, { status: 503, headers: noStore });
    }

    const digest = await getCurrentSessionDigest();
    if (!digest) {
      return NextResponse.json({ error: "Unable to identify this session." }, { status: 400, headers: noStore });
    }

    const deleted = await getSql()`
      DELETE FROM auth_sessions
      WHERE user_id = ${user.id} AND token_hash <> ${digest}
      RETURNING id
    `;

    const revoked = Array.isArray(deleted) ? deleted.length : 0;
    return NextResponse.json({ revoked }, { headers: noStore });
  } catch (error) {
    console.error("Revoking sessions failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to end those sessions right now." }, { status: 500, headers: noStore });
  }
}
