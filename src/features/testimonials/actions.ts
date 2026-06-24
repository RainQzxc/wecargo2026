"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

const BASE = "/dashboard/super-admin/testimonials";

function readForm(formData: FormData) {
  const s = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v.length > 0 ? v : null;
  };
  const sort = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10);
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const rating = ratingRaw ? Number.parseInt(ratingRaw, 10) : null;
  return {
    authorName: s("authorName") ?? "",
    authorRole: s("authorRole"),
    avatarUrl: s("avatarUrl"),
    quoteMn: s("quoteMn") ?? "",
    quoteEn: s("quoteEn"),
    rating: rating !== null && Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : null,
    sortOrder: Number.isFinite(sort) ? sort : 0,
    isActive: formData.get("isActive") === "on",
  };
}

export async function createTestimonial(formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.TESTIMONIALS_CREATE);
  const data = readForm(formData);
  if (!data.authorName || !data.quoteMn) redirect(`${BASE}/new?error=required`);

  const created = await db.testimonial.create({ data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.TESTIMONIAL_CREATED,
    entityType: "Testimonial",
    entityId: created.id,
    after: created,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateTestimonial(id: string, formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.TESTIMONIALS_UPDATE);
  const data = readForm(formData);
  if (!data.authorName || !data.quoteMn) redirect(`${BASE}/${id}?error=required`);

  const before = await db.testimonial.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  const updated = await db.testimonial.update({ where: { id }, data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.TESTIMONIAL_UPDATED,
    entityType: "Testimonial",
    entityId: id,
    before,
    after: updated,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.TESTIMONIALS_DELETE);
  const before = await db.testimonial.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  await db.testimonial.delete({ where: { id } });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.TESTIMONIAL_DELETED,
    entityType: "Testimonial",
    entityId: id,
    before,
  });

  revalidatePath(BASE);
  redirect(BASE);
}
