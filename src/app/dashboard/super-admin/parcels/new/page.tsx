import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("parcels.create");
  return <DashboardPlaceholder sectionKey="parcels" variant="new" />;
}
