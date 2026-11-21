import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function PATCH(request: NextRequest) {
  try {
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
    const fullName = typeof data.fullName === "string" ? data.fullName.trim().replace(/\s+/g, " ") : "";
    if (fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json({ error: "Enter your full name (2–100 characters)." }, { status: 400, headers: noStore });
    }

    await getSql()`
      UPDATE app_users
      SET full_name = ${fullName}, updated_at = now()
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ user: { id: user.id, email: user.email, name: fullName, role: user.role } }, { headers: noStore });
  } catch (error) {
    console.error("Profile update failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to save your details right now." }, { status: 500, headers: noStore });
  }
}
