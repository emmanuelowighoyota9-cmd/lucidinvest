import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/same-origin";
import { requestWithdrawal } from "@/lib/wallet";

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
        { error: "Wallet services are not configured on this deployment." },
        { status: 503, headers: noStore },
      );
    }
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "This action must be started from your dashboard." }, { status: 403, headers: noStore });
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: noStore });
    }

    const result = await requestWithdrawal(user.id, body as Record<string, unknown>);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status, headers: noStore });
    }

    return NextResponse.json({ request: result.value }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Withdrawal request failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to record that request right now." }, { status: 500, headers: noStore });
  }
}
