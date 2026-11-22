import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSql } from "@/lib/db";
import { isSameOriginRequest } from "@/lib/same-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function rows<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as T[]) : [];
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401, headers: noStore });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Investment services are not configured on this deployment." }, { status: 503, headers: noStore });
    }
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "This action must be started from your dashboard." }, { status: 403, headers: noStore });
    }

    const { id } = await context.params;
    if (!UUID.test(id)) {
      return NextResponse.json({ error: "Unknown investment." }, { status: 400, headers: noStore });
    }

    const sql = getSql();
    // Ownership and the pending guard are part of the update, so a request that
    // has already been reviewed cannot be cancelled by racing it.
    const cancelled = rows<{ id: string }>(await sql`
      WITH target AS (
        UPDATE investments
        SET status = 'cancelled', updated_at = now()
        WHERE id = ${id} AND user_id = ${user.id} AND status = 'pending'
        RETURNING id, principal, currency
      ), audited AS (
        INSERT INTO audit_events (actor_user_id, action, entity_type, entity_id, details)
        SELECT ${user.id}, 'investment.cancelled', 'investment', target.id::text,
               jsonb_build_object('principal', target.principal::text, 'currency', trim(target.currency))
        FROM target
        RETURNING id
      )
      SELECT id::text AS id FROM target
    `);

    if (cancelled.length === 0) {
      return NextResponse.json(
        { error: "That request is no longer awaiting review, so it cannot be cancelled." },
        { status: 409, headers: noStore },
      );
    }

    return NextResponse.json({ ok: true, status: "cancelled" }, { headers: noStore });
  } catch (error) {
    console.error("Investment cancellation failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Unable to cancel that request right now." }, { status: 500, headers: noStore });
  }
}
