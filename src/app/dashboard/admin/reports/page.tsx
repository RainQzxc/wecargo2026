import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("reports.basic");
  return <DashboardPlaceholder sectionKey="reports" variant="list" />;
}
