import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("content.create");
  return <DashboardPlaceholder sectionKey="banners" variant="new" />;
}
