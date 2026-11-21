import "server-only";
import { getSql } from "@/lib/db";

type AdminSummary = {
  customers: number;
  staff: number;
  accounts: number;
  activeAccounts: number;
  openInvestments: number;
  ledgerEntries: number;
  newEnquiries: number;
};

type AdminCustomerRow = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string | Date;
  account_count: number;
  last_seen_at: string | Date | null;
};

type AdminAccountRow = {
  id: string;
  account_number: string | null;
  account_type: string;
  currency: string;
  status: string;
  created_at: string | Date;
  full_name: string;
  email: string;
};

type AdminEnquiryRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string | Date;
};

type AdminAuditRow = {
  action: string;
  entity_type: string;
  created_at: string | Date;
  actor_email: string | null;
};

function rows<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as T[]) : [];
}

const LIMIT = 200;

export async function getAdminSummary(): Promise<AdminSummary> {
  const sql = getSql();
  const result = rows<{
    customers: number;
    staff: number;
    accounts: number;
    active_accounts: number;
    open_investments: number;
    ledger_entries: number;
    new_enquiries: number;
  }>(await sql`
    SELECT
      (SELECT count(*)::int FROM app_users WHERE role = 'customer') AS customers,
      (SELECT count(*)::int FROM app_users WHERE role IN ('admin', 'compliance')) AS staff,
      (SELECT count(*)::int FROM customer_accounts) AS accounts,
      (SELECT count(*)::int FROM customer_accounts WHERE status = 'active') AS active_accounts,
      (SELECT count(*)::int FROM investments WHERE status IN ('pending', 'active')) AS open_investments,
      (SELECT count(*)::int FROM ledger_entries) AS ledger_entries,
      (SELECT count(*)::int FROM contact_enquiries WHERE status = 'new') AS new_enquiries
  `);
  const row = result[0];
  return {
    customers: Number(row?.customers ?? 0),
    staff: Number(row?.staff ?? 0),
    accounts: Number(row?.accounts ?? 0),
    activeAccounts: Number(row?.active_accounts ?? 0),
    openInvestments: Number(row?.open_investments ?? 0),
    ledgerEntries: Number(row?.ledger_entries ?? 0),
    newEnquiries: Number(row?.new_enquiries ?? 0),
  };
}

export async function getAdminCustomers(limit = LIMIT) {
  const sql = getSql();
  return rows<AdminCustomerRow>(await sql`
    SELECT u.id, u.full_name, u.email, u.role, u.status, u.created_at,
           count(DISTINCT a.id)::int AS account_count,
           max(s.last_seen_at) AS last_seen_at
    FROM app_users u
    LEFT JOIN customer_accounts a ON a.user_id = u.id
    LEFT JOIN auth_sessions s ON s.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT ${limit}
  `);
}

export async function getAdminAccounts() {
  const sql = getSql();
  return rows<AdminAccountRow>(await sql`
    SELECT a.id, a.account_number, a.account_type, a.currency, a.status, a.created_at,
           u.full_name, u.email
    FROM customer_accounts a
    JOIN app_users u ON u.id = a.user_id
    ORDER BY a.created_at DESC
    LIMIT ${LIMIT}
  `);
}

export async function getAdminEnquiries() {
  const sql = getSql();
  return rows<AdminEnquiryRow>(await sql`
    SELECT id, name, email, subject, message, status, created_at
    FROM contact_enquiries
    ORDER BY created_at DESC
    LIMIT ${LIMIT}
  `);
}

/** Number of accounts that can use the admin console. */
export async function getAdminCount() {
  const sql = getSql();
  const result = rows<{ total: number }>(await sql`
    SELECT count(*)::int AS total
    FROM app_users
    WHERE role = 'admin'
  `);
  return Number(result[0]?.total ?? 0);
}

/** The first-run setup key, or null when the deployment has not configured one. */
export function getAdminSetupKey() {
  const key = process.env.ADMIN_SETUP_KEY;
  return key && key.trim().length >= 16 ? key.trim() : null;
}

export async function getAdminAuditEvents() {
  const sql = getSql();
  return rows<AdminAuditRow>(await sql`
    SELECT e.action, e.entity_type, e.created_at, u.email AS actor_email
    FROM audit_events e
    LEFT JOIN app_users u ON u.id = e.actor_user_id
    ORDER BY e.created_at DESC
    LIMIT 8
  `);
}
