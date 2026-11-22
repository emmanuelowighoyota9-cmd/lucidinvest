import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import WalletConsole from "@/components/dashboard/wallet/WalletConsole";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/dashboard";
import { decimalToMinor, formatDecimal, formatSignedMinor } from "@/lib/money";
import { getWalletOverview, getWalletTransactions } from "@/lib/wallet";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const user = await requireUser();
  const [overview, recent] = await Promise.all([
    getWalletOverview(user.id),
    getWalletTransactions(user.id, { pageSize: 6 }),
  ]);

  const { wallet, realAccounts, demoAccounts, pendingRequests } = overview;

  return (
    <>
      <PageHeader
        eyebrow="Wallet"
        title="Wallet & trading accounts"
        lead="Hold funds in your wallet, move them into your own accounts, and see every request and ledger entry behind the balance."
      />

      <WalletConsole
        wallet={wallet}
        realAccounts={realAccounts}
        demoAccounts={demoAccounts}
        pendingRequests={pendingRequests}
      />

      {pendingRequests.length > 0 && (
        <section className={styles.panel} aria-labelledby="wallet-requests">
          <div className={styles.panelHead}>
            <h2 id="wallet-requests" className={styles.panelTitle}>
              Requests awaiting review
            </h2>
            <span className={styles.muted}>{pendingRequests.length} pending</span>
          </div>
          <div className={`${styles.tableWrap} ${styles.tableStacked}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Requested</th>
                  <th scope="col">Type</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Details</th>
                  <th scope="col">Status</th>
                  <th scope="col" className={styles.num}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td data-label="Requested">{formatDate(request.createdAt)}</td>
                    <td data-label="Type" style={{ textTransform: "capitalize" }}>{request.kind}</td>
                    <td data-label="Reference" className={styles.mono}>{request.reference}</td>
                    <td data-label="Details" className={styles.muted}>{request.note ?? "—"}</td>
                    <td data-label="Status"><StatusBadge status={request.status} /></td>
                    <td data-label="Amount" className={styles.num}>
                      {formatDecimal(request.amount, request.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className={styles.panel} aria-labelledby="wallet-activity">
        <div className={styles.panelHead}>
          <h2 id="wallet-activity" className={styles.panelTitle}>
            Recent activity
          </h2>
          <Link href="/dashboard/wallet/history" className={styles.panelLink}>
            View full history
          </Link>
        </div>

        {recent.entries.length === 0 ? (
          <EmptyState
            title="No wallet activity yet"
            text="Transfers and confirmed deposits or withdrawals appear here once a ledger entry is posted."
          />
        ) : (
          <div className={`${styles.tableWrap} ${styles.tableStacked}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Source</th>
                  <th scope="col" className={styles.num}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.entries.map((entry) => {
                  const minor = decimalToMinor(entry.amount) ?? 0;
                  return (
                    <tr key={entry.id}>
                      <td data-label="Date">{formatDate(entry.createdAt)}</td>
                      <td data-label="Description">{entry.description}</td>
                      <td data-label="Reference" className={styles.mono}>{entry.reference ?? "—"}</td>
                      <td data-label="Source" className={styles.mono}>
                        {entry.walletNumber ?? entry.accountNumber ?? "—"}
                      </td>
                      <td data-label="Amount" className={styles.num}>
                        <span className={minor < 0 ? styles.amountNeg : styles.amountPos}>
                          {formatSignedMinor(minor, entry.currency)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className={styles.notice}>
        Your wallet has no external payment rail connected. Deposits and withdrawals are recorded as requests and only
        reach your balance when staff post them to the ledger; internal transfers post both sides immediately. Balances
        are held as exact decimals — the dashboard never does floating-point maths on money.
      </p>
    </>
  );
}
