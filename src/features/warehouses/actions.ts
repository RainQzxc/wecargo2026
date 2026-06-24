"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WarehouseType } from "@prisma/client";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

const BASE = "/dashboard/super-admin/warehouses";

function parseType(raw: unknown): WarehouseType {
  return raw === "EREEN" || raw === "ULAANBAATAR" || raw === "OTHER"
    ? (raw as WarehouseType)
    : WarehouseType.OTHER;
}

/** Read warehouse fields from FormData, trimming and coercing empties to null. */
function readForm(formData: FormData) {
  const s = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v.length > 0 ? v : null;
  };
  return {
    name: s("name") ?? "",
    type: parseType(formData.get("type")),
    phone: s("phone"),
    addressMn: s("addressMn"),
    addressCn: s("addressCn"),
    isActive: formData.get("isActive") === "on",
  };
}

export async function createWarehouse(formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.WAREHOUSES_CREATE);
  const data = readForm(formData);
  if (!data.name) redirect(`${BASE}/new?error=name`);

  const created = await db.warehouse.create({ data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.WAREHOUSE_CREATED,
    entityType: "Warehouse",
    entityId: created.id,
    after: created,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateWarehouse(id: string, formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.WAREHOUSES_UPDATE);
  const data = readForm(formData);
  if (!data.name) redirect(`${BASE}/${id}?error=name`);

  const before = await db.warehouse.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  const updated = await db.warehouse.update({ where: { id }, data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.WAREHOUSE_UPDATED,
    entityType: "Warehouse",
    entityId: id,
    before,
    after: updated,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteWarehouse(id: string): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.WAREHOUSES_DELETE);
  const before = await db.warehouse.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  // Warehouses are referenced by parcels/batches/staff. A hard delete would
  // break those FKs, so deactivate instead — keeps history intact.
  const updated = await db.warehouse.update({ where: { id }, data: { isActive: false } });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.WAREHOUSE_DELETED,
    entityType: "Warehouse",
    entityId: id,
    before,
    after: updated,
  });

  revalidatePath(BASE);
  redirect(BASE);
}
