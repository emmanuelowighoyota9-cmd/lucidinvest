import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
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
        lead="Every account linked to your customer profile, with its type, currency and current status."
      />

      <section className={styles.panel} aria-labelledby="accounts-list">
        <div className={styles.panelHead}>
          <h2 id="accounts-list" className={styles.panelTitle}>
            {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </h2>
          <Link href="/contact" className={styles.panelLink}>Request a new account</Link>
        </div>

        {accounts.length === 0 ? (
          <EmptyState
            title="No accounts open yet"
            text="Accounts are created after onboarding review. Contact our team and we will let you know what is required."
            action={<Link href="/contact" className={styles.cta}>Contact us</Link>}
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
        Account details are provided for information only. Deposits, withdrawals and transfers are not available from
        this dashboard; contact support if you need to change something about an account.
      </p>
    </>
  );
}
