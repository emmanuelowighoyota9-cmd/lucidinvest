import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWalletTransactions } from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
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

    const params = request.nextUrl.searchParams;
    const page = Number(params.get("page") ?? "1");
    const pageSize = Number(params.get("pageSize") ?? "20");

    const history = await getWalletTransactions(user.id, {
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 20,
      kind: params.get("kind"),
      status: params.get("status"),
    });

    return NextResponse.json(history, { headers: noStore });
  } catch (error) {
    console.error("Wallet transactions failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to load your history right now." }, { status: 500, headers: noStore });
  }
}
