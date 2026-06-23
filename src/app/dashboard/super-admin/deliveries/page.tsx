import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("deliveries.read");
  return <DashboardPlaceholder sectionKey="deliveries" variant="list" />;
}
