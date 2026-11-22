"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./dashboard.module.css";

type ShellUser = { name: string; email: string };
type Area = "customer" | "admin";

type NavItem = { href: string; label: string; exact?: boolean; icon: React.ReactNode };

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

const CUSTOMER_NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    exact: true,
    icon: (
      <Icon>
        <rect x="3" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/accounts",
    label: "Accounts",
    icon: (
      <Icon>
        <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 15.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/investments",
    label: "Investments",
    icon: (
      <Icon>
        <path d="M4 17.5 9 11l3.5 3.2L20 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 6H20v4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: (
      <Icon>
        <path d="M4 8h13l-3-3M20 16H7l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: (
      <Icon>
        <circle cx="12" cy="8.5" r="3.7" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4.5 20c1.4-3.4 4.2-5.1 7.5-5.1s6.1 1.7 7.5 5.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/security",
    label: "Security",
    icon: (
      <Icon>
        <path d="M12 3.5 19 6v5.4c0 4.2-2.9 7.6-7 9.1-4.1-1.5-7-4.9-7-9.1V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </Icon>
    ),
  },
];

const ADMIN_NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    exact: true,
    icon: (
      <Icon>
        <path d="M12 3.5 19 6v5.4c0 4.2-2.9 7.6-7 9.1-4.1-1.5-7-4.9-7-9.1V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </Icon>
    ),
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: (
      <Icon>
        <circle cx="9" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M2.5 20c1.2-3.2 3.6-4.9 6.5-4.9s5.3 1.7 6.5 4.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M16.5 5.4a3.2 3.2 0 0 1 0 6.2M18 15.4c2 .5 3.2 2 3.8 4.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    href: "/admin/accounts",
    label: "Accounts",
    icon: (
      <Icon>
        <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 15.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    href: "/admin/investments",
    label: "Investments",
    icon: (
      <Icon>
        <path d="M4 17.5 9 11l3.5 3.2L20 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 6H20v4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </Icon>
    ),
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: (
      <Icon>
        <path d="M3.5 6.5h17v11h-17z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m3.5 7.5 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </Icon>
    ),
  },
];

const AREA: Record<Area, { nav: NavItem[]; label: string }> = {
  customer: { nav: CUSTOMER_NAV, label: "Customer area" },
  admin: { nav: ADMIN_NAV, label: "Operations" },
};

export default function DashboardShell({
  user,
  area = "customer",
  showAdminLink = false,
  children,
}: {
  user: ShellUser;
  area?: Area;
  showAdminLink?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { nav, label } = AREA[area];
  const crossLink: NavItem | null =
    area === "admin"
      ? {
          href: "/dashboard",
          label: "Customer view",
          icon: (
            <Icon>
              <path d="M14 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M20 4v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </Icon>
          ),
        }
      : showAdminLink
        ? {
            href: "/admin",
            label: "Admin console",
            icon: (
              <Icon>
                <path d="M12 3.5 19 6v5.4c0 4.2-2.9 7.6-7 9.1-4.1-1.5-7-4.9-7-9.1V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              </Icon>
            ),
          }
        : null;
  const items = crossLink ? [...nav, crossLink] : nav;

  function isActive(item: NavItem) {
    return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      router.replace("/login");
      router.refresh();
      setBusy(false);
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand} aria-label="Lucid Global Invest home">
          <Image
            src="/assets/images/resources/lucid-global-invest-logo.png"
            alt="Lucid Global Invest"
            width={142}
            height={71}
            className={styles.brandImage}
            priority
          />
        </Link>

        <p className={styles.navLabel}>{label}</p>
        <nav className={styles.nav} aria-label={area === "admin" ? "Admin" : "Dashboard"}>
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userBlock}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          <button type="button" className={styles.signOut} onClick={signOut} disabled={busy}>
            {busy ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
