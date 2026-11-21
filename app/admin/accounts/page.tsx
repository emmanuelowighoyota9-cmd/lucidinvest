import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/dashboard";
import { getAdminAccounts } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  await requireAdmin();
  const accounts = await getAdminAccounts();

  return (
    <>
      <PageHeader
        eyebrow="Accounts"
        title="Customer accounts"
        lead="All investment accounts across customers, newest first."
      />

      <section className={styles.panel} aria-labelledby="account-list">
        <div className={styles.panelHead}>
          <h2 id="account-list" className={styles.panelTitle}>
            {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </h2>
        </div>

        {accounts.length === 0 ? (
          <EmptyState
            title="No accounts yet"
            text="Accounts opened during onboarding will be listed here with their owner and status."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Account number</th>
                  <th scope="col">Customer</th>
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
                    <td>
                      <div>{account.full_name}</div>
                      <div className={styles.muted}>{account.email}</div>
                    </td>
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
        Account records are shown for support and review only. This console cannot post entries, change balances or
        freeze accounts.
      </p>
    </>
  );
}
