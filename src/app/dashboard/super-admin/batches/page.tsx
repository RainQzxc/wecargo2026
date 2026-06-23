import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("batches.read");
  return <DashboardPlaceholder sectionKey="batches" variant="list" />;
}
