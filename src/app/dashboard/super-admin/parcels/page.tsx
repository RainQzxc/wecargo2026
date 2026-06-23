import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("parcels.read");
  return <DashboardPlaceholder sectionKey="parcels" variant="list" />;
}
