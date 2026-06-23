import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { SUPER_ADMIN_NAV } from "@/features/dashboard/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.SUPER_ADMIN);
  return (
    <DashboardShell user={user} nav={SUPER_ADMIN_NAV} areaLabel="Super Admin">
      {children}
    </DashboardShell>
  );
}
