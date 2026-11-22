import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import InvestmentRequestForm from "@/components/dashboard/InvestmentRequestForm";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDate, formatMoney, getAccounts, getInvestments, getProducts } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardInvestmentsPage() {
  const user = await requireUser();
  const [investments, products, accounts] = await Promise.all([
    getInvestments(user.id),
    getProducts(),
    getAccounts(user.id),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Investments"
        title="Your investments"
        lead="Submit a new investment request, follow the positions held on your accounts, and see the products currently published by Lucid Global Invest."
      />

      <section className={styles.panel} aria-labelledby="start-investment">
        <div className={styles.panelHead}>
          <h2 id="start-investment" className={styles.panelTitle}>
            Start an investment
          </h2>
          <span className={styles.muted}>Reviewed before it is opened</span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products published"
            text="Investment products are added by our team. Check back later or contact us for the current offering."
            action={<Link href="/contact" className={styles.cta}>Contact us</Link>}
          />
        ) : (
          <InvestmentRequestForm
            products={products.map((product) => ({
              id: product.id,
              name: product.name,
              currency: product.currency,
              minimum: String(product.minimum_amount),
            }))}
            accounts={accounts.map((account) => ({
              id: account.id,
              accountNumber: account.account_number,
              accountType: account.account_type,
              currency: account.currency,
              status: account.status,
            }))}
          />
        )}
      </section>

      <section className={styles.panel} aria-labelledby="investment-list">
        <div className={styles.panelHead}>
          <h2 id="investment-list" className={styles.panelTitle}>
            {investments.length} position{investments.length === 1 ? "" : "s"}
          </h2>
          <Link href="/contact" className={styles.panelLink}>Talk to an advisor</Link>
        </div>

        {investments.length === 0 ? (
          <EmptyState
            title="No investments yet"
            text="A request you submit above appears here straight away as pending, then moves on once our team has reviewed and funded it."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Account</th>
                  <th scope="col" className={styles.num}>Principal</th>
                  <th scope="col">Status</th>
                  <th scope="col">Opened</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td>
                      <div>{investment.product_name}</div>
                      {investment.terms_version && (
                        <div className={styles.muted}>Terms {investment.terms_version}</div>
                      )}
                    </td>
                    <td className={styles.mono}>{investment.account_number ?? "—"}</td>
                    <td className={styles.num}>{formatMoney(investment.principal, investment.currency)}</td>
                    <td><StatusBadge status={investment.status} /></td>
                    <td>{formatDate(investment.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.panel} aria-labelledby="products">
        <div className={styles.panelHead}>
          <h2 id="products" className={styles.panelTitle}>Published products</h2>
          <span className={styles.muted}>{products.length} product{products.length === 1 ? "" : "s"}</span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products published"
            text="Investment products are added by our team. Check back later or contact us for the current offering."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Description</th>
                  <th scope="col">Currency</th>
                  <th scope="col" className={styles.num}>Minimum</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td className={styles.muted}>{product.description || "—"}</td>
                    <td>{product.currency}</td>
                    <td className={styles.num}>{formatMoney(product.minimum_amount, product.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className={styles.notice}>
        Submitting a request records your instruction for review. It does not place an order, take a payment or move
        money, and the request only becomes a position once our team confirms funding through the agreed channel.
      </p>
    </>
  );
}
