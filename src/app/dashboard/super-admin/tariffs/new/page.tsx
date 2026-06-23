import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("tariffs.create");
  return <DashboardPlaceholder sectionKey="tariffs" variant="new" />;
}
