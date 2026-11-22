import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import StatusActions from "@/components/admin/StatusActions";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatMoney } from "@/lib/dashboard";
import { getAdminInvestments } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminInvestmentsPage() {
  await requireAdmin();
  const investments = await getAdminInvestments();
  const pending = investments.filter((investment) => investment.status === "pending").length;

  return (
    <>
      <PageHeader
        eyebrow="Investments"
        title="Investment requests"
        lead="Review the requests customers have submitted. Approving one marks the position active and books its subscription entry; rejecting one closes the request without posting anything."
      />

      <section className={styles.panel} aria-labelledby="investment-list">
        <div className={styles.panelHead}>
          <h2 id="investment-list" className={styles.panelTitle}>
            {investments.length} request{investments.length === 1 ? "" : "s"}
          </h2>
          <span className={styles.muted}>{pending} awaiting review</span>
        </div>

        {investments.length === 0 ? (
          <EmptyState
            title="No investment requests"
            text="Requests submitted by customers will appear here for approval or rejection."
          />
        ) : (
          <div className={`${styles.tableWrap} ${styles.tableStacked}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Account</th>
                  <th scope="col" className={styles.num}>Principal</th>
                  <th scope="col">Status</th>
                  <th scope="col">Submitted</th>
                  <th scope="col">Review</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td data-label="Product">
                      <div>{investment.product_name}</div>
                      {investment.terms_version ? (
                        <div className={styles.muted}>Terms {investment.terms_version}</div>
                      ) : null}
                    </td>
                    <td data-label="Customer">
                      <div>{investment.full_name}</div>
                      <div className={styles.muted}>{investment.email}</div>
                    </td>
                    <td data-label="Account" className={styles.mono}>{investment.account_number ?? "—"}</td>
                    <td data-label="Principal" className={styles.num}>
                      {formatMoney(investment.principal, investment.currency)}
                    </td>
                    <td data-label="Status"><StatusBadge status={investment.status} /></td>
                    <td data-label="Submitted">{formatDate(investment.created_at)}</td>
                    <td data-label="Review">
                      {investment.status === "pending" ? (
                        <StatusActions
                          endpoint={`/api/admin/investments/${investment.id}`}
                          record={`${investment.product_name} for ${investment.email}`}
                          options={[
                            { value: "active", label: "Approve" },
                            { value: "rejected", label: "Reject" },
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
        Approving a request posts one ledger transaction and its subscription entry for the requested principal in the
        same statement that changes the status. This console cannot take payments, set balances or reverse a posted
        entry; those remain controlled database operations.
      </p>
    </>
  );
}
