import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWalletOverview } from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
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

    const overview = await getWalletOverview(user.id);
    return NextResponse.json(overview, { headers: noStore });
  } catch (error) {
    console.error("Wallet overview failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to load your wallet right now." }, { status: 500, headers: noStore });
  }
}
