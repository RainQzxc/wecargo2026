import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("content.read");
  return <DashboardPlaceholder sectionKey="banners" variant="list" />;
}
