import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/auth/AuthForm.module.css";
import AdminSetupForm from "@/components/admin/AdminSetupForm";
import { getAdminCount, getAdminSetupKey } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "First-time admin setup | Lucid Global Invest",
  description: "Create the first administrator account for the Lucid Global Invest operations console.",
  robots: { index: false, follow: false },
};

export default async function AdminSetupPage() {
  let adminCount: number | null = null;
  try {
    adminCount = await getAdminCount();
  } catch {
    adminCount = null;
  }
  const user = adminCount === null ? null : await getCurrentUser().catch(() => null);
  const setupKeyConfigured = Boolean(getAdminSetupKey());

  return (
    <main className={styles.shell}>
      <div className={styles.card}>
        <section className={styles.panel}>
          <span className={styles.logoChip}>
            <Image
              src="/assets/images/resources/lucid-global-invest-logo.png"
              alt="Lucid Global Invest"
              width={142}
              height={71}
              className={styles.logoImage}
              priority
            />
          </span>
          <h1 className={styles.panelTitle}>First-time admin setup</h1>
          <p className={styles.panelLead}>
            Make one reviewed account the administrator of the operations console. Setup closes as soon as an admin
            exists, so the console cannot be claimed later by anyone else.
          </p>
          <ul className={styles.features}>
            <li className={styles.feature}>
              <span className={styles.featureIcon} aria-hidden="true">1</span>
              <span>
                <span className={styles.featureTitle}>Sign in to your account</span>
                <span className={styles.featureText}>Register first if you have not created the account yet.</span>
              </span>
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon} aria-hidden="true">2</span>
              <span>
                <span className={styles.featureTitle}>Confirm the setup key</span>
                <span className={styles.featureText}>
                  <code>ADMIN_SETUP_KEY</code> is set by whoever deploys the site, so only they can run this step.
                </span>
              </span>
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon} aria-hidden="true">3</span>
              <span>
                <span className={styles.featureTitle}>Open the console</span>
                <span className={styles.featureText}>
                  The new admin can review customers, accounts, enquiries, investments and wallet requests, and every change is audited.
                </span>
              </span>
            </li>
          </ul>
          <p className={styles.panelFooter}>Lucid Global Invest · Operations</p>
        </section>

        <section className={styles.formSide}>
          <Link href="/" className={styles.back}>
            ← Back to the site
          </Link>

          {adminCount === null ? (
            <>
              <p className={styles.eyebrow}>Setup unavailable</p>
              <h2 className={styles.title}>The database is not reachable</h2>
              <p className={styles.lead}>
                Admin setup needs <code>DATABASE_URL</code> on this deployment. Add it in Vercel, redeploy, and reload
                this page.
              </p>
            </>
          ) : adminCount > 0 ? (
            <>
              <p className={styles.eyebrow}>Setup complete</p>
              <h2 className={styles.title}>An administrator already exists</h2>
              <p className={styles.lead}>
                First-time setup only runs while no admin exists. Ask an existing administrator to promote your
                account, then sign in to the console.
              </p>
              <p className={styles.switch}>
                <Link href="/login">Go to sign in</Link>
              </p>
            </>
          ) : !setupKeyConfigured ? (
            <>
              <p className={styles.eyebrow}>Setup locked</p>
              <h2 className={styles.title}>Add an ADMIN_SETUP_KEY to enable setup</h2>
              <p className={styles.lead}>
                Setup requires a key so the console cannot be claimed by whoever registers first. Without it, this page
                cannot promote anyone.
              </p>
              <p className={styles.footnote}>
                In Vercel, add <code>ADMIN_SETUP_KEY</code> (at least 16 characters) under Settings → Environment
                Variables, redeploy, then return to this page.
              </p>
            </>
          ) : !user ? (
            <>
              <p className={styles.eyebrow}>Step 1 of 2</p>
              <h2 className={styles.title}>Sign in to the account that should become admin</h2>
              <p className={styles.lead}>
                Sign in to your existing account, or create one, then come back to this page to claim the admin role.
              </p>
              <p className={styles.switch}>
                <Link href="/login">Sign in</Link> · <Link href="/register">Create an account</Link>
              </p>
              <p className={styles.footnote}>
                Setup is open only because no administrator exists yet. It closes permanently once one does.
              </p>
            </>
          ) : (
            <>
              <p className={styles.eyebrow}>Step 2 of 2</p>
              <h2 className={styles.title}>Claim the admin role</h2>
              <p className={styles.lead}>
                Confirm the setup key and your password to make your account the first administrator.
              </p>
              <AdminSetupForm email={user.email} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
