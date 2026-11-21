import PageHeader from "@/components/dashboard/PageHeader";
import RevokeSessions from "@/components/dashboard/RevokeSessions";
import styles from "@/components/dashboard/dashboard.module.css";
import { requireUser } from "@/lib/auth";
import { formatDateTime, getSessions } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardSecurityPage() {
  const user = await requireUser();
  const sessions = await getSessions(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="Sign-in sessions"
        lead="Each device that signs in creates a session. Ending a session signs that device out immediately."
      />

      <section className={styles.panel} aria-labelledby="sessions">
        <div className={styles.panelHead}>
          <h2 id="sessions" className={styles.panelTitle}>
            {sessions.length} active session{sessions.length === 1 ? "" : "s"}
          </h2>
          <RevokeSessions otherSessions={Math.max(sessions.length - 1, 0)} />
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Started</th>
                <th scope="col">Last seen</th>
                <th scope="col">Expires</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{formatDateTime(session.created_at)}</td>
                  <td>{formatDateTime(session.last_seen_at)}</td>
                  <td>{formatDateTime(session.expires_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="security-notes">
        <h2 id="security-notes" className={styles.panelTitle}>How your account is protected</h2>
        <dl className={styles.detailList}>
          <div className={styles.detailRow}>
            <dt className={styles.detailKey}>Password storage</dt>
            <dd className={styles.detailValue}>scrypt hash with a per-account salt</dd>
          </div>
          <div className={styles.detailRow}>
            <dt className={styles.detailKey}>Session cookies</dt>
            <dd className={styles.detailValue}>Signed, HttpOnly, SameSite=Lax, 7-day expiry</dd>
          </div>
          <div className={styles.detailRow}>
            <dt className={styles.detailKey}>Session records</dt>
            <dd className={styles.detailValue}>Stored as SHA-256 digests, never as raw tokens</dd>
          </div>
        </dl>
      </section>

      <p className={styles.notice}>
        If you see a session you do not recognise, sign out the other devices and change your password with support.
      </p>
    </>
  );
}
