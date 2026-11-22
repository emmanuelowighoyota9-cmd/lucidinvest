import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import OpenAccountForm from "@/components/dashboard/OpenAccountForm";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDate, getAccounts } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardAccountsPage() {
  const user = await requireUser();
  const accounts = await getAccounts(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Accounts"
        title="Your investment accounts"
        lead="Open a new account and see every account linked to your customer profile, with its type, currency and current status."
      />

      <section className={styles.panel} aria-labelledby="open-account">
        <div className={styles.panelHead}>
          <h2 id="open-account" className={styles.panelTitle}>
            Open an account
          </h2>
          <span className={styles.muted}>No initial deposit required</span>
        </div>
        <OpenAccountForm />
      </section>

      <section className={styles.panel} aria-labelledby="accounts-list">
        <div className={styles.panelHead}>
          <h2 id="accounts-list" className={styles.panelTitle}>
            {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </h2>
        </div>

        {accounts.length === 0 ? (
          <EmptyState
            title="No accounts open yet"
            text="Use the form above to open your first account. It is issued with an account number straight away and stays pending until our team completes its review."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Account number</th>
                  <th scope="col">Type</th>
                  <th scope="col">Currency</th>
                  <th scope="col">Status</th>
                  <th scope="col">Opened</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className={styles.mono}>{account.account_number ?? "Pending"}</td>
                    <td style={{ textTransform: "capitalize" }}>{account.account_type}</td>
                    <td>{account.currency}</td>
                    <td><StatusBadge status={account.status} /></td>
                    <td>{formatDate(account.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className={styles.notice}>
        Opening an account records a review request; it does not create a balance or move money. Deposits, withdrawals,
        transfers and trading are not available from this dashboard — contact support if you need to change something
        about an account.
      </p>
    </>
  );
}
