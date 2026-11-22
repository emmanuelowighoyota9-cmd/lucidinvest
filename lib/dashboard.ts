import "server-only";
import { getSql } from "@/lib/db";

export type AccountRow = {
  id: string;
  account_number: string | null;
  account_type: string;
  currency: string;
  status: string;
  created_at: string | Date;
};

export type InvestmentRow = {
  id: string;
  principal: string | number;
  currency: string;
  status: string;
  created_at: string | Date;
  product_name: string;
  terms_version: string | null;
  account_number: string | null;
};

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  currency: string;
  minimum_amount: string | number;
};

export type TransactionRow = {
  id: string;
  amount: string | number;
  currency: string;
  created_at: string | Date;
  description: string;
  reference: string | null;
  transaction_status: string;
  posted_at: string | Date | null;
  account_number: string | null;
};

export type SessionRow = {
  id: string;
  created_at: string | Date;
  expires_at: string | Date;
  last_seen_at: string | Date;
};

export type ProfileRow = {
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string | Date;
};

function rows<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as T[]) : [];
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

function toDate(value: string | Date | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date | null | undefined) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "—";
}

export function formatDateTime(value: string | Date | null | undefined) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : "—";
}

export function formatMoney(value: string | number | null | undefined, currency: string) {
  const amount = typeof value === "string" ? Number(value) : value;
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  }
}

export async function getAccounts(userId: string) {
  const sql = getSql();
  return rows<AccountRow>(await sql`
    SELECT id, account_number, account_type, currency, status, created_at
    FROM customer_accounts
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `);
}

export async function getInvestments(userId: string) {
  const sql = getSql();
  return rows<InvestmentRow>(await sql`
    SELECT i.id, i.principal, i.currency, i.status, i.created_at,
           p.name AS product_name, p.terms_version, a.account_number
    FROM investments i
    JOIN investment_products p ON p.id = i.product_id
    JOIN customer_accounts a ON a.id = i.account_id
    WHERE i.user_id = ${userId}
    ORDER BY i.created_at DESC
  `);
}

export async function getProducts() {
  const sql = getSql();
  return rows<ProductRow>(await sql`
    SELECT id, name, description, currency, minimum_amount
    FROM investment_products
    WHERE status = 'active'
    ORDER BY name ASC
  `);
}

export async function getTransactions(userId: string, limit = 50) {
  const sql = getSql();
  return rows<TransactionRow>(await sql`
    SELECT e.id, e.amount, e.currency, e.created_at,
           t.description, t.reference, t.status AS transaction_status, t.posted_at,
           a.account_number
    FROM ledger_entries e
    JOIN ledger_transactions t ON t.id = e.transaction_id
    JOIN customer_accounts a ON a.id = e.account_id
    WHERE a.user_id = ${userId}
    ORDER BY e.created_at DESC
    LIMIT ${limit}
  `);
}

export async function getSessions(userId: string) {
  const sql = getSql();
  return rows<SessionRow>(await sql`
    SELECT id, created_at, expires_at, last_seen_at
    FROM auth_sessions
    WHERE user_id = ${userId} AND expires_at > now()
    ORDER BY created_at DESC
  `);
}

export async function getProfile(userId: string) {
  const sql = getSql();
  const result = rows<ProfileRow>(await sql`
    SELECT full_name, email, role, status, created_at
    FROM app_users
    WHERE id = ${userId}
    LIMIT 1
  `);
  return result[0] ?? null;
}

export type Summary = {
  accountCount: number;
  activeAccounts: number;
  investmentCount: number;
  pendingInvestmentCount: number;
  openSessions: number;
  totalsByCurrency: { currency: string; total: string }[];
};

export async function getSummary(userId: string): Promise<Summary> {
  const sql = getSql();

  const [accountStats, investmentStats, totals, sessionStats] = await Promise.all([
    rows<{ total: number; active: number }>(await sql`
      SELECT count(*)::int AS total, count(*) FILTER (WHERE status = 'active')::int AS active
      FROM customer_accounts
      WHERE user_id = ${userId}
    `),
    rows<{ active: number; pending: number }>(await sql`
      SELECT count(*) FILTER (WHERE status = 'active')::int AS active,
             count(*) FILTER (WHERE status = 'pending')::int AS pending
      FROM investments
      WHERE user_id = ${userId}
    `),
    // Only funded, live positions are portfolio principal; pending requests are not.
    rows<{ currency: string; total: string }>(await sql`
      SELECT currency, sum(principal)::text AS total
      FROM investments
      WHERE user_id = ${userId} AND status = 'active'
      GROUP BY currency
      ORDER BY currency
    `),
    rows<{ total: number }>(await sql`
      SELECT count(*)::int AS total
      FROM auth_sessions
      WHERE user_id = ${userId} AND expires_at > now()
    `),
  ]);

  return {
    accountCount: Number(accountStats[0]?.total ?? 0),
    activeAccounts: Number(accountStats[0]?.active ?? 0),
    investmentCount: Number(investmentStats[0]?.active ?? 0),
    pendingInvestmentCount: Number(investmentStats[0]?.pending ?? 0),
    openSessions: Number(sessionStats[0]?.total ?? 0),
    totalsByCurrency: totals,
  };
}
