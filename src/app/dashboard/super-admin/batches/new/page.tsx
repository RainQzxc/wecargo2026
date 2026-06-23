import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("batches.create");
  return <DashboardPlaceholder sectionKey="batches" variant="new" />;
}
