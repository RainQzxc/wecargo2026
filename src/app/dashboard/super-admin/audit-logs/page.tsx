import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page() {
  await requirePermission("auditLogs.read");
  return <DashboardPlaceholder sectionKey="audit-logs" variant="list" />;
}
