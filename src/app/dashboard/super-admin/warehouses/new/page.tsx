import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { firstParam } from "@/lib/pagination";
import { WarehouseForm } from "@/features/warehouses/WarehouseForm";
import { createWarehouse } from "@/features/warehouses/actions";

const BASE = "/dashboard/super-admin/warehouses";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.WAREHOUSES_CREATE);
  const error = firstParam((await searchParams).error);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to warehouses
      </Link>
      <h1>New warehouse</h1>
      <WarehouseForm action={createWarehouse} error={error} />
    </section>
  );
}
