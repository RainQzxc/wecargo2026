import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { WAREHOUSE_NAV } from "@/features/dashboard/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function WarehouseLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.WAREHOUSE_STAFF, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  return (
    <DashboardShell user={user} nav={WAREHOUSE_NAV} areaLabel="Агуулах">
      {children}
    </DashboardShell>
  );
}
