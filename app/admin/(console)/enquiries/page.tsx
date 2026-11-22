import PageHeader, { EmptyState, StatusBadge } from "@/components/dashboard/PageHeader";
import StatusActions, { type StatusOption } from "@/components/admin/StatusActions";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/dashboard";
import { getAdminEnquiries } from "@/lib/admin";

export const dynamic = "force-dynamic";

/** Only the next steps in the review workflow are offered. */
const NEXT_STATUS: Record<string, StatusOption[]> = {
  new: [
    { value: "reviewing", label: "Start review" },
    { value: "spam", label: "Mark spam" },
  ],
  reviewing: [
    { value: "resolved", label: "Resolve" },
    { value: "spam", label: "Mark spam" },
  ],
  spam: [{ value: "reviewing", label: "Reopen" }],
  resolved: [],
};

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const enquiries = await getAdminEnquiries();

  return (
    <>
      <PageHeader
        eyebrow="Enquiries"
        title="Contact enquiries"
        lead="Messages submitted through the contact form, newest first, with their current review status."
      />

      <section className={styles.panel} aria-labelledby="enquiry-list">
        <div className={styles.panelHead}>
          <h2 id="enquiry-list" className={styles.panelTitle}>
            {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}
          </h2>
        </div>

        {enquiries.length === 0 ? (
          <EmptyState
            title="No enquiries"
            text="Messages submitted through the contact form will appear here."
          />
        ) : (
          <div className={`${styles.tableWrap} ${styles.tableStacked}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Received</th>
                  <th scope="col">From</th>
                  <th scope="col">Message</th>
                  <th scope="col">Status</th>
                  <th scope="col">Review</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td data-label="Received">{formatDateTime(enquiry.created_at)}</td>
                    <td data-label="From">
                      <div>{enquiry.name}</div>
                      <div className={styles.muted}>{enquiry.email}</div>
                    </td>
                    <td data-label="Message">
                      {enquiry.subject ? <div>{enquiry.subject}</div> : null}
                      <div className={styles.muted} style={{ whiteSpace: "pre-wrap" }}>{enquiry.message}</div>
                    </td>
                    <td data-label="Status"><StatusBadge status={enquiry.status} /></td>
                    <td data-label="Review">
                      {(NEXT_STATUS[enquiry.status] ?? []).length > 0 ? (
                        <StatusActions
                          endpoint={`/api/admin/enquiries/${enquiry.id}`}
                          record={`the enquiry from ${enquiry.email}`}
                          options={NEXT_STATUS[enquiry.status] ?? []}
                        />
                      ) : (
                        <span className={styles.muted}>Closed</span>
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
        Moving an enquiry through review records an audit event. Replies are still sent from the support mailbox so that
        customer conversations stay in one auditable place.
      </p>
    </>
  );
}
