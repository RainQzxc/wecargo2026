import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("unidentified.read");
  return <DashboardPlaceholder sectionKey="unidentified" variant="list" />;
}
