import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { firstParam } from "@/lib/pagination";
import { BranchForm } from "@/features/branches/BranchForm";
import { createBranch } from "@/features/branches/actions";

const BASE = "/dashboard/super-admin/branches";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.BRANCHES_CREATE);
  const error = firstParam((await searchParams).error);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to branches
      </Link>
      <h1>New branch</h1>
      <BranchForm action={createBranch} error={error} />
    </section>
  );
}
