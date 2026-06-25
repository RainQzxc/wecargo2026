import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { COURIER_NAV } from "@/features/dashboard/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function CourierLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.COURIER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  return (
    <DashboardShell user={user} nav={COURIER_NAV} areaLabel="Хүргэлт">
      {children}
    </DashboardShell>
  );
}
