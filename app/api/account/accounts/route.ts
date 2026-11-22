import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { openAccount } from "@/lib/requests";
import { isSameOriginRequest } from "@/lib/same-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401, headers: noStore });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Account services are not configured on this deployment." },
        { status: 503, headers: noStore },
      );
    }

    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { error: "This action must be started from your dashboard." },
        { status: 403, headers: noStore },
      );
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: noStore });
    }

    const result = await openAccount(user.id, body as Record<string, unknown>);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status, headers: noStore });
    }

    return NextResponse.json({ account: result.value }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Account opening failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to open an account right now." }, { status: 500, headers: noStore });
  }
}
