"use client";

import Link from "next/link";
import styles from "@/components/dashboard/dashboard.module.css";

export default function WalletError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className={styles.panel} role="alert" aria-labelledby="wallet-error">
      <div>
        <p className={styles.eyebrow}>Wallet</p>
        <h1 id="wallet-error" className={styles.pageTitle}>
          We could not load your wallet
        </h1>
        <p className={styles.pageLead}>
          Your balances are safe. This is a display problem with the wallet service, so nothing has been changed by the
          failed load. Try again, or contact support if it keeps happening.
        </p>
      </div>
      {error.digest && <p className={styles.muted}>Reference {error.digest}</p>}
      <div className={styles.formActions}>
        <button type="button" className={styles.cta} onClick={() => reset()}>
          Try again
        </button>
        <Link href="/dashboard" className={`${styles.cta} ${styles.ctaGhost}`}>
          Back to overview
        </Link>
        <Link href="/contact" className={styles.panelLink}>
          Contact support
        </Link>
      </div>
    </section>
  );
}
