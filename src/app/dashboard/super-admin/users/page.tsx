import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("users.read");
  return <DashboardPlaceholder sectionKey="users" variant="list" />;
}
