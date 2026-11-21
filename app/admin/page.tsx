import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatDateTime } from "@/lib/dashboard";
import { getAdminAuditEvents, getAdminCustomers, getAdminSummary } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [summary, newest, auditEvents] = await Promise.all([
    getAdminSummary(),
    getAdminCustomers(5),
    getAdminAuditEvents(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Admin overview"
        lead="A read-only view of customer records, accounts and enquiries. Nothing on this console moves money."
      />

      <section className={styles.stats} aria-label="Platform summary">
        <div className={styles.stat}>
          <p className={styles.statLabel}>Customers</p>
          <p className={styles.statValue}>{summary.customers}</p>
          <p className={styles.statHint}>{summary.staff} staff account{summary.staff === 1 ? "" : "s"}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Accounts</p>
          <p className={styles.statValue}>{summary.accounts}</p>
          <p className={styles.statHint}>{summary.activeAccounts} active</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Open investments</p>
          <p className={styles.statValue}>{summary.openInvestments}</p>
          <p className={styles.statHint}>{summary.ledgerEntries} ledger entries</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>New enquiries</p>
          <p className={styles.statValue}>{summary.newEnquiries}</p>
          <p className={styles.statHint}>
            <Link href="/admin/enquiries" className={styles.panelLink}>Open enquiries</Link>
          </p>
        </div>
      </section>

      <div className={styles.split}>
        <section className={styles.panel} aria-labelledby="newest-customers">
          <div className={styles.panelHead}>
            <h2 id="newest-customers" className={styles.panelTitle}>Newest customers</h2>
            <Link href="/admin/customers" className={styles.panelLink}>All customers</Link>
          </div>
          {newest.length === 0 ? (
            <EmptyState title="No customer records" text="Registered customers will appear here as they sign up." />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Customer</th>
                    <th scope="col">Status</th>
                    <th scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {newest.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div>{customer.full_name}</div>
                        <div className={styles.muted}>{customer.email}</div>
                      </td>
                      <td><StatusBadge status={customer.status} /></td>
                      <td>{formatDate(customer.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="recent-audit">
          <div className={styles.panelHead}>
            <h2 id="recent-audit" className={styles.panelTitle}>Audit log</h2>
          </div>
          {auditEvents.length === 0 ? (
            <EmptyState
              title="No audit events"
              text="Actions recorded in the audit log will be listed here with their actor and timestamp."
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Action</th>
                    <th scope="col">Actor</th>
                    <th scope="col">When</th>
                  </tr>
                </thead>
                <tbody>
                  {auditEvents.map((event, index) => (
                    <tr key={`${event.created_at}-${index}`}>
                      <td>
                        <div>{event.action}</div>
                        <div className={styles.muted}>{event.entity_type}</div>
                      </td>
                      <td className={styles.muted}>{event.actor_email ?? "system"}</td>
                      <td>{formatDateTime(event.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <p className={styles.notice}>
        This console is read-only. Deposits, withdrawals, trading and balance edits are intentionally unavailable, and
        staff actions here are limited to viewing records.
      </p>
    </>
  );
}
