import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("settings.read");
  return <DashboardPlaceholder sectionKey="settings" variant="list" />;
}
