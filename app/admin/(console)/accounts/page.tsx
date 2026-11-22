import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import StatusActions from "@/components/admin/StatusActions";
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
          <div className={`${styles.tableWrap} ${styles.tableStacked}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Account number</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Type</th>
                  <th scope="col">Currency</th>
                  <th scope="col">Status</th>
                  <th scope="col">Opened</th>
                  <th scope="col">Review</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td data-label="Account number" className={styles.mono}>{account.account_number ?? "Pending"}</td>
                    <td data-label="Customer">
                      <div>{account.full_name}</div>
                      <div className={styles.muted}>{account.email}</div>
                    </td>
                    <td data-label="Type" style={{ textTransform: "capitalize" }}>{account.account_type}</td>
                    <td data-label="Currency">{account.currency}</td>
                    <td data-label="Status"><StatusBadge status={account.status} /></td>
                    <td data-label="Opened">{formatDate(account.created_at)}</td>
                    <td data-label="Review">
                      {account.status === "pending" ? (
                        <StatusActions
                          endpoint={`/api/admin/accounts/${account.id}`}
                          record={`${account.account_number ?? "pending account"} (${account.email})`}
                          options={[
                            { value: "active", label: "Approve" },
                            { value: "closed", label: "Reject" },
                          ]}
                        />
                      ) : (
                        <span className={styles.muted}>Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className={styles.notice}>
        Approving or rejecting an account only changes its review status and records an audit event. This console cannot
        post entries, change balances or move money.
      </p>
    </>
  );
}
