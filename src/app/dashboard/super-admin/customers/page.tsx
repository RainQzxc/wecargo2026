import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("customers.read");
  return <DashboardPlaceholder sectionKey="customers" variant="list" />;
}
