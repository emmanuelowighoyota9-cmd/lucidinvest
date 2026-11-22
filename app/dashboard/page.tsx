import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDate, formatMoney, getAccounts, getSummary, getTransactions } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const user = await requireUser();

  const [summary, accounts, transactions] = await Promise.all([
    getSummary(user.id),
    getAccounts(user.id),
    getTransactions(user.id, 5),
  ]);

  const portfolioLabel = summary.totalsByCurrency.length
    ? summary.totalsByCurrency.map((row) => formatMoney(row.total, row.currency)).join(" · ")
    : "—";
  const firstName = user.full_name.split(" ")[0] ?? user.full_name;

  return (
    <>
      <PageHeader
        eyebrow="Customer overview"
        title={`Welcome, ${firstName}`}
        lead="Your accounts, investments and recent activity in one place."
      />

      <section className={styles.stats} aria-label="Summary">
        <div className={styles.stat}>
          <p className={styles.statLabel}>Accounts</p>
          <p className={styles.statValue}>{summary.accountCount}</p>
          <p className={styles.statHint}>{summary.activeAccounts} active</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Portfolio principal</p>
          <p className={styles.statValue}>{portfolioLabel}</p>
          <p className={styles.statHint}>
            {summary.investmentCount} active
            {summary.pendingInvestmentCount > 0
              ? ` · ${summary.pendingInvestmentCount} request${summary.pendingInvestmentCount === 1 ? "" : "s"} pending review`
              : ""}
          </p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Account status</p>
          <p className={styles.statValue} style={{ textTransform: "capitalize" }}>{user.status}</p>
          <p className={styles.statHint}>Role: {user.role}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Active sessions</p>
          <p className={styles.statValue}>{summary.openSessions}</p>
          <p className={styles.statHint}>
            <Link href="/dashboard/security" className={styles.panelLink}>Manage sessions</Link>
          </p>
        </div>
      </section>

      <div className={styles.split}>
        <section className={styles.panel} aria-labelledby="recent-activity">
          <div className={styles.panelHead}>
            <h2 id="recent-activity" className={styles.panelTitle}>Recent activity</h2>
            <Link href="/dashboard/transactions" className={styles.panelLink}>All transactions</Link>
          </div>
          {transactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              text="Posted ledger entries for your accounts will appear here once activity has been recorded."
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col" className={styles.num}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatDate(entry.created_at)}</td>
                      <td>
                        <div>{entry.description}</div>
                        <div className={styles.muted}>{entry.account_number ?? "Account"}</div>
                      </td>
                      <td className={styles.num}>{formatMoney(entry.amount, entry.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="your-accounts">
          <div className={styles.panelHead}>
            <h2 id="your-accounts" className={styles.panelTitle}>Your accounts</h2>
            <Link href="/dashboard/accounts" className={styles.panelLink}>Manage</Link>
          </div>
          {accounts.length === 0 ? (
            <EmptyState
              title="No accounts open"
              text="Investment accounts are opened after onboarding review. Talk to our team to get started."
              action={<Link href="/contact" className={styles.cta}>Contact us</Link>}
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Account</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.slice(0, 4).map((account) => (
                    <tr key={account.id}>
                      <td className={styles.mono}>{account.account_number ?? "Pending"}</td>
                      <td style={{ textTransform: "capitalize" }}>{account.account_type}</td>
                      <td><StatusBadge status={account.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <p className={styles.notice}>
        Deposits, withdrawals, trading and other money-movement features are not enabled on this dashboard. Balances,
        investments and history shown here are read-only records from your account.
      </p>
    </>
  );
}
