import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return <DashboardShell user={{ name: user.full_name, email: user.email }}>{children}</DashboardShell>;
}
