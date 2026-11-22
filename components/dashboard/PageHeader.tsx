import styles from "./dashboard.module.css";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
};

export default function PageHeader({ eyebrow, title, lead, action }: Props) {
  return (
    <header className={styles.pageHead}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.pageTitle}>{title}</h1>
        {lead && <p className={styles.pageLead}>{lead}</p>}
      </div>
      {action}
    </header>
  );
}

const BADGE_TONES: Record<string, string> = {
  active: styles.badgeActive,
  matured: styles.badgeActive,
  pending: styles.badgePending,
  reviewing: styles.badgePending,
  suspended: styles.badgeBad,
  closed: styles.badgeBad,
  frozen: styles.badgeBad,
  failed: styles.badgeBad,
  rejected: styles.badgeBad,
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`${styles.badge} ${BADGE_TONES[status] ?? ""}`}>{status.replace(/_/g, " ")}</span>;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>{title}</p>
      <p className={styles.emptyText}>{text}</p>
      {action}
    </div>
  );
}
