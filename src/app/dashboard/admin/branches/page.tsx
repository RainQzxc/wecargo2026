import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { BranchList } from "@/features/branches/BranchList";

const BASE = "/dashboard/admin/branches";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; page?: string }>;
}) {
  await requirePermission(PERMISSIONS.BRANCHES_READ);
  const sp = await searchParams;

  return (
    <section>
      <h1>Branches</h1>
      <p style={{ fontSize: 12, color: "#666" }}>Read-only. Branches are managed by Super Admin.</p>
      <BranchList basePath={BASE} searchParams={sp} manageable={false} />
    </section>
  );
}
