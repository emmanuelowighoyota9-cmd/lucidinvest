import styles from "@/components/dashboard/dashboard.module.css";
import wallet from "@/components/dashboard/wallet/wallet.module.css";

export default function WalletLoading() {
  return (
    <div aria-busy="true" aria-live="polite" style={{ display: "grid", gap: 22 }}>
      <div>
        <p className={styles.eyebrow}>Wallet</p>
        <h1 className={styles.pageTitle}>Wallet &amp; trading accounts</h1>
        <p className={styles.pageLead}>Loading your wallet balance and accounts…</p>
      </div>

      <div className={`${wallet.skeleton} ${wallet.skeletonSummary}`} />
      <div className={wallet.skeletonGrid}>
        <div className={`${wallet.skeleton} ${wallet.skeletonCard}`} />
        <div className={`${wallet.skeleton} ${wallet.skeletonCard}`} />
        <div className={`${wallet.skeleton} ${wallet.skeletonCard}`} />
      </div>
      <div className={`${wallet.skeleton} ${wallet.skeletonRow}`} />
      <div className={`${wallet.skeleton} ${wallet.skeletonRow}`} />
      <div className={`${wallet.skeleton} ${wallet.skeletonRow}`} />
    </div>
  );
}
