"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { CONTENT_CACHE_TAGS } from "@/features/content/dal";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

const BASE = "/dashboard/super-admin/faq";

function readForm(formData: FormData) {
  const s = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v.length > 0 ? v : null;
  };
  const sort = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10);
  return {
    questionMn: s("questionMn") ?? "",
    answerMn: s("answerMn") ?? "",
    questionEn: s("questionEn"),
    answerEn: s("answerEn"),
    category: s("category"),
    sortOrder: Number.isFinite(sort) ? sort : 0,
    isActive: formData.get("isActive") === "on",
  };
}

export async function createFaq(formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.FAQ_CREATE);
  const data = readForm(formData);
  if (!data.questionMn || !data.answerMn) redirect(`${BASE}/new?error=required`);

  const created = await db.faq.create({ data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.FAQ_CREATED,
    entityType: "Faq",
    entityId: created.id,
    after: created,
  });

  revalidatePath(BASE);
  revalidateTag(CONTENT_CACHE_TAGS.faqs, "max"); // refresh the public pricing FAQ
  redirect(BASE);
}

export async function updateFaq(id: string, formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.FAQ_UPDATE);
  const data = readForm(formData);
  if (!data.questionMn || !data.answerMn) redirect(`${BASE}/${id}?error=required`);

  const before = await db.faq.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  const updated = await db.faq.update({ where: { id }, data });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.FAQ_UPDATED,
    entityType: "Faq",
    entityId: id,
    before,
    after: updated,
  });

  revalidatePath(BASE);
  revalidateTag(CONTENT_CACHE_TAGS.faqs, "max"); // refresh the public pricing FAQ
  redirect(BASE);
}

export async function deleteFaq(id: string): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.FAQ_DELETE);
  const before = await db.faq.findUnique({ where: { id } });
  if (!before) redirect(BASE);

  await db.faq.delete({ where: { id } });
  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.FAQ_DELETED,
    entityType: "Faq",
    entityId: id,
    before,
  });

  revalidatePath(BASE);
  revalidateTag(CONTENT_CACHE_TAGS.faqs, "max"); // refresh the public pricing FAQ
  redirect(BASE);
}
