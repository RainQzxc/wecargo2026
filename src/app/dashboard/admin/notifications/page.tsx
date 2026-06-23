import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("notifications.read");
  return <DashboardPlaceholder sectionKey="notifications" variant="list" />;
}
