import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/same-origin";
import { processWalletRequest } from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401, headers: noStore });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Staff access is required." }, { status: 403, headers: noStore });
    }
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "This action must be started from the admin console." }, { status: 403, headers: noStore });
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: noStore });
    }

    const { id } = await context.params;
    const result = await processWalletRequest(user.id, id, (body as Record<string, unknown>).status);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status, headers: noStore });
    }

    return NextResponse.json({ ok: true, status: result.value.status, transactionId: result.value.transactionId }, { headers: noStore });
  } catch (error) {
    console.error("Wallet request review failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to update that request right now." }, { status: 500, headers: noStore });
  }
}
