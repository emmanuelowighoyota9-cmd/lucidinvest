import Link from "next/link";
import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDate, formatMoney, getInvestments, getProducts } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardInvestmentsPage() {
  const user = await requireUser();
  const [investments, products] = await Promise.all([getInvestments(user.id), getProducts()]);

  return (
    <>
      <PageHeader
        eyebrow="Investments"
        title="Your investments"
        lead="Positions held on your accounts, plus the products currently published by Lucid Global Invest."
      />

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
            text="Once an investment is recorded against one of your accounts it will appear here with its principal, product and status."
            action={<Link href="/contact" className={styles.cta}>Speak to our team</Link>}
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
                  <th scope="col" className={styles.num}>Minimum</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td className={styles.muted}>{product.description || "—"}</td>
                    <td className={styles.num}>{formatMoney(product.minimum_amount, product.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className={styles.notice}>
        Opening or changing an investment is handled by our team. Nothing on this page places an order or moves money.
      </p>
    </>
  );
}
