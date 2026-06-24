"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

const BASE = "/dashboard/super-admin/branches";

/** Optional decimal (lat/lng) — empty string becomes null, invalid is dropped. */
function decOrNull(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  if (!v) return null;
  return Number.isFinite(Number(v)) ? v : null;
}

function readForm(formData: FormData) {
  const s = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v.length > 0 ? v : null;
  };
  return {
    name: s("name") ?? "",
    phone: s("phone"),
    address: s("address"),
    city: s("city"),
    district: s("district"),
    latitude: decOrNull(formData, "latitude"),
    longitude: decOrNull(formData, "longitude"),
    isActive: formData.get("isActive") === "on",
  };
}

export async function createBranch(formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.BRANCHES_CREATE);
  const data = readForm(formData);
  if (!data.name) redirect(`${BASE}/new?error=name`);

  const created = await db.branch.create({ data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.BRANCH_CREATED,
    entityType: "Branch",
    entityId: created.id,
    after: created,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateBranch(id: string, formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.BRANCHES_UPDATE);
  const data = readForm(formData);
  if (!data.name) redirect(`${BASE}/${id}?error=name`);

  const before = await db.branch.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  const updated = await db.branch.update({ where: { id }, data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.BRANCH_UPDATED,
    entityType: "Branch",
    entityId: id,
    before,
    after: updated,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteBranch(id: string): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.BRANCHES_DELETE);
  const before = await db.branch.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  // Soft delete — branches are referenced by parcels, staff and customers.
  const updated = await db.branch.update({ where: { id }, data: { isActive: false } });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.BRANCH_DELETED,
    entityType: "Branch",
    entityId: id,
    before,
    after: updated,
  });

  revalidatePath(BASE);
  redirect(BASE);
}
