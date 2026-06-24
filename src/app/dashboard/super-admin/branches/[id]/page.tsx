import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { can } from "@/features/auth/dal";
import { db } from "@/server/db";
import { firstParam } from "@/lib/pagination";
import { BranchForm } from "@/features/branches/BranchForm";
import { updateBranch, deleteBranch } from "@/features/branches/actions";

const BASE = "/dashboard/super-admin/branches";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.BRANCHES_READ);
  const { id } = await params;
  const error = firstParam((await searchParams).error);

  const branch = await db.branch.findUnique({ where: { id } });
  if (!branch) notFound();

  const canUpdate = await can(PERMISSIONS.BRANCHES_UPDATE);
  const canDelete = await can(PERMISSIONS.BRANCHES_DELETE);
  const update = updateBranch.bind(null, id);
  const remove = deleteBranch.bind(null, id);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to branches
      </Link>
      <h1>Edit branch</h1>

      {canUpdate ? (
        <BranchForm action={update} defaults={branch} error={error} />
      ) : (
        <p style={{ color: "#999" }}>You do not have permission to edit this branch.</p>
      )}

      {canDelete && branch.isActive ? (
        <form action={remove} style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 16 }}>
          <button type="submit" style={{ color: "#c5221f" }}>
            Deactivate branch
          </button>
          <p style={{ fontSize: 12, color: "#999" }}>
            Deactivates (soft delete) — keeps linked parcels and customers intact.
          </p>
        </form>
      ) : null}
    </section>
  );
}
