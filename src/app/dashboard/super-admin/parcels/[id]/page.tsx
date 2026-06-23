import { requirePermission } from "@/features/auth";
import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("parcels.read");
  const { id } = await params;
  return <DashboardPlaceholder sectionKey="parcels" variant="detail" detailId={id} />;
}
