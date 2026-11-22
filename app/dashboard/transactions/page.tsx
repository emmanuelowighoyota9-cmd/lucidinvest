import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDate, formatDateTime, formatMoney, getTransactions } from "@/lib/dashboard";
import { getPendingRequests } from "@/lib/requests";

export const dynamic = "force-dynamic";

export default async function DashboardTransactionsPage() {
  const user = await requireUser();
  const [entries, pending] = await Promise.all([
    getTransactions(user.id, 100),
    getPendingRequests(user.id),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Transactions"
        title="Account activity"
        lead="Ledger entries posted against your accounts, plus the requests you have submitted that are still awaiting review."
      />

      <section className={styles.panel} aria-labelledby="ledger">
        <div className={styles.panelHead}>
          <h2 id="ledger" className={styles.panelTitle}>
            {entries.length} entr{entries.length === 1 ? "y" : "ies"}
          </h2>
          <Link href="/contact" className={styles.panelLink}>Question about a transaction?</Link>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            title="No activity to show"
            text="When a transaction is posted to one of your accounts, the entry, its reference and amount will be listed here."
            action={<Link href="/contact" className={styles.cta}>Contact support</Link>}
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Posted</th>
                  <th scope="col">Description</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Account</th>
                  <th scope="col">Status</th>
                  <th scope="col" className={styles.num}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatDateTime(entry.created_at)}</td>
                    <td>{entry.description}</td>
                    <td className={styles.mono}>{entry.reference ?? "—"}</td>
                    <td className={styles.mono}>{entry.account_number ?? "—"}</td>
                    <td><StatusBadge status={entry.transaction_status} /></td>
                    <td className={styles.num}>{formatMoney(entry.amount, entry.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.panel} aria-labelledby="pending-requests">
        <div className={styles.panelHead}>
          <h2 id="pending-requests" className={styles.panelTitle}>
            Requests in review
          </h2>
          <span className={styles.muted}>
            {pending.length} request{pending.length === 1 ? "" : "s"}
          </span>
        </div>

        {pending.length === 0 ? (
          <EmptyState
            title="Nothing awaiting review"
            text="Accounts you open and investment requests you submit appear here until our team has processed them."
            action={<Link href="/dashboard/investments" className={styles.cta}>Start an investment</Link>}
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Submitted</th>
                  <th scope="col">Request</th>
                  <th scope="col">Details</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((request) => (
                  <tr key={`${request.kind}-${request.id}`}>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>{request.title}</td>
                    <td className={styles.muted}>{request.detail}</td>
                    <td className={styles.mono}>{request.reference}</td>
                    <td><StatusBadge status={request.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className={styles.notice}>
        Ledger entries are posted by our team and cannot be edited here. Requests in review are your own submissions
        awaiting processing and do not represent money received or a completed investment.
      </p>
    </>
  );
}
