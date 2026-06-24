import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { can } from "@/features/auth/dal";
import { BranchList } from "@/features/branches/BranchList";

const BASE = "/dashboard/super-admin/branches";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; page?: string }>;
}) {
  await requirePermission(PERMISSIONS.BRANCHES_READ);
  const sp = await searchParams;
  const canCreate = await can(PERMISSIONS.BRANCHES_CREATE);

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Branches</h1>
        {canCreate ? <Link href={`${BASE}/new`}>+ New branch</Link> : null}
      </div>
      <BranchList basePath={BASE} searchParams={sp} manageable />
    </section>
  );
}
