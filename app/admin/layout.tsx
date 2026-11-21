import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <DashboardShell area="admin" user={{ name: user.full_name, email: user.email }}>
      {children}
    </DashboardShell>
  );
}
