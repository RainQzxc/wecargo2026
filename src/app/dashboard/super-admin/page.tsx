import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requireRole(ROLES.SUPER_ADMIN);
  return <DashboardPlaceholder sectionKey="overview" variant="list" />;
}
