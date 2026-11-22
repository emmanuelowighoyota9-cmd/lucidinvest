import "server-only";
import { randomInt } from "node:crypto";
import { getSql } from "@/lib/db";

/**
 * Customer-initiated account and investment requests.
 *
 * These functions only ever create records that are pending review. They do not
 * post ledger entries, set balances, or move money in any direction.
 */

export const ACCOUNT_TYPES = [
  { value: "investment", label: "Investment account" },
  { value: "cash", label: "Cash account" },
  { value: "demo", label: "Demo account" },
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number]["value"];

export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP"] as const;

const MAX_OPEN_ACCOUNTS = 10;
const MAX_PENDING_INVESTMENTS = 10;
const MAX_PRINCIPAL = 100_000_000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type RequestOutcome<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

type DbRow = Record<string, unknown>;

function rows<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as T[]) : [];
}

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Sequential-looking but non-sequential numbers, so one customer cannot infer another's. */
function newAccountNumber() {
  return `LG-${String(randomInt(0, 100_000_000)).padStart(8, "0")}`;
}

function parseAmount(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/,/g, "");
  if (!/^\d{1,12}(\.\d{1,2})?$/.test(cleaned)) return null;
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
}

export type OpenedAccount = {
  id: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  status: string;
};

export async function openAccount(
  userId: string,
  input: Record<string, unknown>,
): Promise<RequestOutcome<OpenedAccount>> {
  const sql = getSql();

  const accountType = typeof input.accountType === "string" ? input.accountType : "";
  const currency = typeof input.currency === "string" ? input.currency.toUpperCase() : "";
  const type = ACCOUNT_TYPES.find((entry) => entry.value === accountType);

  if (!type) return { ok: false, status: 400, error: "Choose an account type." };
  if (!SUPPORTED_CURRENCIES.includes(currency as (typeof SUPPORTED_CURRENCIES)[number])) {
    return { ok: false, status: 400, error: "Choose a supported currency." };
  }

  const counts = rows<{ open_count: number; duplicate_count: number }>(await sql`
    SELECT count(*) FILTER (WHERE status <> 'closed')::int AS open_count,
           count(*) FILTER (
             WHERE status <> 'closed' AND account_type = ${accountType} AND currency = ${currency}
           )::int AS duplicate_count
    FROM customer_accounts
    WHERE user_id = ${userId}
  `);
  const openCount = Number(counts[0]?.open_count ?? 0);
  const duplicateCount = Number(counts[0]?.duplicate_count ?? 0);

  if (duplicateCount > 0) {
    return {
      ok: false,
      status: 409,
      error: `You already hold an open ${type.label.toLowerCase()} in ${currency}.`,
    };
  }
  if (openCount >= MAX_OPEN_ACCOUNTS) {
    return {
      ok: false,
      status: 409,
      error: `You already hold ${MAX_OPEN_ACCOUNTS} open accounts. Contact us if you need another one.`,
    };
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const accountNumber = newAccountNumber();
    const inserted = rows<OpenedAccount>(await sql`
      INSERT INTO customer_accounts (user_id, account_number, account_type, currency, status)
      VALUES (${userId}, ${accountNumber}, ${accountType}, ${currency}, 'pending')
      ON CONFLICT (account_number) DO NOTHING
      RETURNING id, account_number AS "accountNumber", account_type AS "accountType", currency, status
    `);
    const account = inserted[0];
    if (!account) continue;

    await recordAudit(userId, "account.opened", "customer_account", account.id, {
      accountType,
      currency,
    });
    return { ok: true, value: account };
  }

  return { ok: false, status: 503, error: "We could not issue an account number. Please try again." };
}

export type InvestmentRequest = {
  id: string;
  principal: string;
  currency: string;
  status: string;
  productName: string;
};

export async function requestInvestment(
  userId: string,
  input: Record<string, unknown>,
): Promise<RequestOutcome<InvestmentRequest>> {
  const sql = getSql();

  const productId = typeof input.productId === "string" ? input.productId : "";
  const accountId = typeof input.accountId === "string" ? input.accountId : "";
  const amount = parseAmount(input.amount);

  if (!UUID.test(productId)) return { ok: false, status: 400, error: "Choose a published product." };
  if (!UUID.test(accountId)) return { ok: false, status: 400, error: "Choose one of your accounts." };
  if (amount === null || amount <= 0) {
    return { ok: false, status: 400, error: "Enter an amount greater than zero, with at most two decimal places." };
  }
  if (amount > MAX_PRINCIPAL) {
    return { ok: false, status: 400, error: "Enter an amount below 100,000,000 or contact our team." };
  }

  const products = rows<{ id: string; name: string; currency: string; minimum_amount: string | number }>(await sql`
    SELECT id, name, currency, minimum_amount
    FROM investment_products
    WHERE id = ${productId} AND status = 'active'
    LIMIT 1
  `);
  const product = products[0];
  if (!product) return { ok: false, status: 400, error: "That product is no longer available." };

  const accounts = rows<{ id: string; currency: string; status: string; account_number: string | null }>(await sql`
    SELECT id, currency, status, account_number
    FROM customer_accounts
    WHERE id = ${accountId} AND user_id = ${userId}
    LIMIT 1
  `);
  const account = accounts[0];
  if (!account) return { ok: false, status: 400, error: "Choose one of your own accounts." };
  if (account.status !== "pending" && account.status !== "active") {
    return { ok: false, status: 409, error: "That account cannot take a new request while it is not open." };
  }
  if (account.currency.trim() !== product.currency.trim()) {
    return {
      ok: false,
      status: 400,
      error: `${product.name} is denominated in ${product.currency.trim()}. Choose an account in that currency.`,
    };
  }

  const minimum = Number(product.minimum_amount);
  if (Number.isFinite(minimum) && amount < minimum) {
    return {
      ok: false,
      status: 400,
      error: `The minimum for ${product.name} is ${money(minimum, product.currency.trim())}.`,
    };
  }

  const pending = rows<{ total: number }>(await sql`
    SELECT count(*)::int AS total
    FROM investments
    WHERE user_id = ${userId} AND status = 'pending'
  `);
  if (Number(pending[0]?.total ?? 0) >= MAX_PENDING_INVESTMENTS) {
    return {
      ok: false,
      status: 409,
      error: `You already have ${MAX_PENDING_INVESTMENTS} requests awaiting review. Contact us to progress them.`,
    };
  }

  const inserted = rows<{ id: string; principal: string; currency: string; status: string }>(await sql`
    INSERT INTO investments (user_id, account_id, product_id, principal, currency, status)
    VALUES (${userId}, ${accountId}, ${productId}, ${amount.toFixed(2)}, ${product.currency.trim()}, 'pending')
    RETURNING id, principal, currency, status
  `);
  const investment = inserted[0];
  if (!investment) return { ok: false, status: 503, error: "We could not record that request. Please try again." };

  await recordAudit(userId, "investment.requested", "investment", investment.id, {
    productId,
    principal: investment.principal,
    currency: investment.currency,
    accountNumber: account.account_number,
  });

  return { ok: true, value: { ...investment, productName: product.name } };
}

export type PendingRequest = {
  id: string;
  kind: "account" | "investment";
  title: string;
  detail: string;
  reference: string;
  status: string;
  createdAt: string | Date;
};

/** Account applications and investment requests that are still awaiting review. */
export async function getPendingRequests(userId: string): Promise<PendingRequest[]> {
  const sql = getSql();

  const [accounts, investments] = await Promise.all([
    sql`
      SELECT id, account_number, account_type, currency, status, created_at
      FROM customer_accounts
      WHERE user_id = ${userId} AND status = 'pending'
    `,
    sql`
      SELECT i.id, i.principal, i.currency, i.status, i.created_at, p.name AS product_name
      FROM investments i
      JOIN investment_products p ON p.id = i.product_id
      WHERE i.user_id = ${userId} AND i.status = 'pending'
    `,
  ]);

  const accountRequests = rows<{
    id: string;
    account_number: string | null;
    account_type: string;
    currency: string;
    status: string;
    created_at: string | Date;
  }>(accounts).map<PendingRequest>((row) => ({
    id: row.id,
    kind: "account",
    title: "Account opening",
    detail: `${ACCOUNT_TYPES.find((entry) => entry.value === row.account_type)?.label ?? row.account_type} · ${row.currency.trim()}`,
    reference: row.account_number ?? "—",
    status: row.status,
    createdAt: row.created_at,
  }));

  const investmentRequests = rows<{
    id: string;
    principal: string | number;
    currency: string;
    status: string;
    created_at: string | Date;
    product_name: string;
  }>(investments).map<PendingRequest>((row) => ({
    id: row.id,
    kind: "investment",
    title: "Investment request",
    detail: `${row.product_name} · ${money(Number(row.principal), row.currency.trim())}`,
    reference: row.id.slice(0, 8).toUpperCase(),
    status: row.status,
    createdAt: row.created_at,
  }));

  return [...accountRequests, ...investmentRequests]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 50);
}

async function recordAudit(
  actorUserId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: DbRow,
) {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO audit_events (actor_user_id, action, entity_type, entity_id, details)
      VALUES (${actorUserId}, ${action}, ${entityType}, ${entityId}, ${JSON.stringify(details)}::jsonb)
    `;
  } catch (error) {
    // The record exists; a missing audit row must not turn a successful request into an error.
    console.error("Audit write failed", error instanceof Error ? error.message : "unknown error");
  }
}
