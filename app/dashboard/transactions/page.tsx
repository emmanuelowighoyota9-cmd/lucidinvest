import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatMoney, getTransactions } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardTransactionsPage() {
  const user = await requireUser();
  const entries = await getTransactions(user.id, 100);

  return (
    <>
      <PageHeader
        eyebrow="Transactions"
        title="Account activity"
        lead="Ledger entries posted against your accounts. Amounts are shown exactly as recorded."
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

      <p className={styles.notice}>
        Entries are read-only. If you believe something is missing or incorrect, contact support and quote the
        reference shown beside the entry.
      </p>
    </>
  );
}
