import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { CUSTOMER_NAV } from "@/features/dashboard/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  return (
    <DashboardShell user={user} nav={CUSTOMER_NAV} areaLabel="Хэрэглэгч">
      {children}
    </DashboardShell>
  );
}
