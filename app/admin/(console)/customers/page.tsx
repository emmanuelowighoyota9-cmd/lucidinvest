import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import StatusActions from "@/components/admin/StatusActions";
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
          <div className={`${styles.tableWrap} ${styles.tableStacked}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col" className={styles.num}>Accounts</th>
                  <th scope="col">Last seen</th>
                  <th scope="col">Joined</th>
                  <th scope="col">Review</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td data-label="Customer">
                      <div>{customer.full_name}</div>
                      <div className={styles.muted}>{customer.email}</div>
                    </td>
                    <td data-label="Role" style={{ textTransform: "capitalize" }}>{customer.role}</td>
                    <td data-label="Status"><StatusBadge status={customer.status} /></td>
                    <td data-label="Accounts" className={styles.num}>{customer.account_count}</td>
                    <td data-label="Last seen">{customer.last_seen_at ? formatDateTime(customer.last_seen_at) : "—"}</td>
                    <td data-label="Joined">{formatDate(customer.created_at)}</td>
                    <td data-label="Review">
                      {customer.role === "customer" ? (
                        <StatusActions
                          endpoint={`/api/admin/customers/${customer.id}`}
                          record={customer.email}
                          options={[
                            { value: "active", label: "Activate" },
                            { value: "suspended", label: "Suspend" },
                            { value: "closed", label: "Close" },
                          ]}
                        />
                      ) : (
                        <span className={styles.muted}>Staff account</span>
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
        Status changes are applied immediately and recorded in the audit log with your account as the actor. Staff
        accounts cannot be changed here, and roles are never edited from the console.
      </p>
    </>
  );
}
