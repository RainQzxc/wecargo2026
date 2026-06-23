import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("linkOrders.read");
  return <DashboardPlaceholder sectionKey="link-orders" variant="list" />;
}
