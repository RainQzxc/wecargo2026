import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { ADMIN_NAV } from "@/features/dashboard/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

// SUPER_ADMIN can access everything, including the ADMIN area.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN);
  return (
    <DashboardShell user={user} nav={ADMIN_NAV} areaLabel="Admin">
      {children}
    </DashboardShell>
  );
}
