import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import StatusActions from "@/components/admin/StatusActions";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/dashboard";
import { formatDecimal } from "@/lib/money";
import { getAdminWalletRequests } from "@/lib/wallet";

export const dynamic = "force-dynamic";

export default async function AdminWalletRequestsPage() {
  await requireAdmin();
  const requests = await getAdminWalletRequests(150);
  const pending = requests.filter((request) => request.status === "pending").length;

  return (
    <>
      <PageHeader
        eyebrow="Wallet"
        title="Deposit & withdrawal requests"
        lead="Confirm the money instructions customers have recorded. Approving a deposit credits the wallet; approving a withdrawal debits it after re-checking the balance. Each approval posts its ledger transaction and audit event in the same statement."
      />

      <section className={styles.panel} aria-labelledby="wallet-request-list">
        <div className={styles.panelHead}>
          <h2 id="wallet-request-list" className={styles.panelTitle}>
            {requests.length} request{requests.length === 1 ? "" : "s"}
          </h2>
          <span className={styles.muted}>{pending} awaiting review</span>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            title="No wallet requests"
            text="Deposit and withdrawal instructions recorded by customers will appear here for review."
          />
        ) : (
          <div className={`${styles.tableWrap} ${styles.tableStacked}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Requested</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Wallet</th>
                  <th scope="col">Type</th>
                  <th scope="col">Reference</th>
                  <th scope="col" className={styles.num}>Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Review</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td data-label="Requested">{formatDateTime(request.createdAt)}</td>
                    <td data-label="Customer">
                      <div>{request.customerName}</div>
                      <div className={styles.muted}>{request.customerEmail}</div>
                    </td>
                    <td data-label="Wallet">
                      <div className={styles.mono}>{request.walletNumber}</div>
                      <div className={styles.muted}>Balance {formatDecimal(request.walletBalance, request.currency)}</div>
                    </td>
                    <td data-label="Type" style={{ textTransform: "capitalize" }}>{request.kind}</td>
                    <td data-label="Reference">
                      <div className={styles.mono}>{request.reference}</div>
                      <div className={styles.muted}>{request.note ?? "—"}</div>
                    </td>
                    <td data-label="Amount" className={styles.num}>
                      {formatDecimal(request.amount, request.currency)}
                    </td>
                    <td data-label="Status"><StatusBadge status={request.status} /></td>
                    <td data-label="Review">
                      {request.status === "pending" ? (
                        <StatusActions
                          endpoint={`/api/admin/wallet-requests/${request.id}`}
                          record={`${request.kind} of ${formatDecimal(request.amount, request.currency)} for ${request.customerEmail}`}
                          options={[
                            { value: "posted", label: "Approve" },
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
        Confirm the payment has actually been received before approving a deposit, and that the payout destination is
        verified before approving a withdrawal. Approvals post one ledger transaction to the wallet in the same
        statement that changes the request status; a withdrawal whose balance no longer covers it is refused.
      </p>
    </>
  );
}
