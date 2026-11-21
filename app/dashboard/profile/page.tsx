import { redirect } from "next/navigation";
import PageHeader, { StatusBadge } from "@/components/dashboard/PageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDate, getProfile } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (!profile) redirect("/login");

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Your details"
        lead="Keep your name up to date. Your sign-in email and account status are managed by our team."
      />

      <div className={styles.split}>
        <ProfileForm initialName={profile.full_name} />

        <section className={styles.panel} aria-labelledby="account-details">
          <h2 id="account-details" className={styles.panelTitle}>Account details</h2>
          <dl className={styles.detailList}>
            <div className={styles.detailRow}>
              <dt className={styles.detailKey}>Customer since</dt>
              <dd className={styles.detailValue}>{formatDate(profile.created_at)}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt className={styles.detailKey}>Role</dt>
              <dd className={styles.detailValue} style={{ textTransform: "capitalize" }}>{profile.role}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt className={styles.detailKey}>Account status</dt>
              <dd className={styles.detailValue}><StatusBadge status={profile.status} /></dd>
            </div>
            <div className={styles.detailRow}>
              <dt className={styles.detailKey}>Email</dt>
              <dd className={styles.detailValue}>{profile.email}</dd>
            </div>
          </dl>
        </section>
      </div>

      <p className={styles.notice}>
        Changes to your name are applied immediately and shown across your dashboard. Nothing else about your account
        can be edited from here.
      </p>
    </>
  );
}
