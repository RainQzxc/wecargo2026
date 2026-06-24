import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { can } from "@/features/auth/dal";
import { db } from "@/server/db";
import { firstParam } from "@/lib/pagination";
import { WarehouseForm } from "@/features/warehouses/WarehouseForm";
import { updateWarehouse, deleteWarehouse } from "@/features/warehouses/actions";

const BASE = "/dashboard/super-admin/warehouses";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.WAREHOUSES_READ);
  const { id } = await params;
  const error = firstParam((await searchParams).error);

  const warehouse = await db.warehouse.findUnique({ where: { id } });
  if (!warehouse) notFound();

  const canUpdate = await can(PERMISSIONS.WAREHOUSES_UPDATE);
  const canDelete = await can(PERMISSIONS.WAREHOUSES_DELETE);
  const update = updateWarehouse.bind(null, id);
  const remove = deleteWarehouse.bind(null, id);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to warehouses
      </Link>
      <h1>Edit warehouse</h1>

      {canUpdate ? (
        <WarehouseForm action={update} defaults={warehouse} error={error} />
      ) : (
        <p style={{ color: "#999" }}>You do not have permission to edit this warehouse.</p>
      )}

      {canDelete && warehouse.isActive ? (
        <form action={remove} style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 16 }}>
          <button type="submit" style={{ color: "#c5221f" }}>
            Deactivate warehouse
          </button>
          <p style={{ fontSize: 12, color: "#999" }}>
            Deactivates (soft delete) — keeps linked parcels and batches intact.
          </p>
        </form>
      ) : null}
    </section>
  );
}
