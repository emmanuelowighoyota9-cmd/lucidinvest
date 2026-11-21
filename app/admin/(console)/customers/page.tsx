import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatDateTime } from "@/lib/dashboard";
import { getAdminCustomers } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getAdminCustomers();

  return (
    <>
      <PageHeader
        eyebrow="Customers"
        title="Customer records"
        lead="Every account registered on the platform, with its role, status and linked accounts."
      />

      <section className={styles.panel} aria-labelledby="customer-list">
        <div className={styles.panelHead}>
          <h2 id="customer-list" className={styles.panelTitle}>
            {customers.length} record{customers.length === 1 ? "" : "s"}
          </h2>
        </div>

        {customers.length === 0 ? (
          <EmptyState title="No customer records" text="Registered customers will appear here as they sign up." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col" className={styles.num}>Accounts</th>
                  <th scope="col">Last seen</th>
                  <th scope="col">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div>{customer.full_name}</div>
                      <div className={styles.muted}>{customer.email}</div>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{customer.role}</td>
                    <td><StatusBadge status={customer.status} /></td>
                    <td className={styles.num}>{customer.account_count}</td>
                    <td>{customer.last_seen_at ? formatDateTime(customer.last_seen_at) : "—"}</td>
                    <td>{formatDate(customer.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className={styles.notice}>
        Roles and statuses are shown as stored. Account status changes are handled outside this console so that every
        change is recorded through the reviewed database process.
      </p>
    </>
  );
}
