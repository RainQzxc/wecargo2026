"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { CONTENT_CACHE_TAGS } from "@/features/content/dal";
import { SITE_CONTENT_FIELDS } from "@/features/content/site-content";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

const BASE = "/dashboard/super-admin/content";

/**
 * Upsert every registered marketing-copy key from the editor form. Only known
 * keys are written (unknown form fields are ignored). An empty value is stored
 * as "" — `resolveSiteContent` treats that as "use the built-in default", so
 * clearing a field reverts it on the public site.
 */
export async function updateSiteContent(formData: FormData): Promise<void> {
  const actor = await requirePermission(PERMISSIONS.CONTENT_UPDATE);

  const updates = SITE_CONTENT_FIELDS.map((field) => ({
    key: field.key,
    valueMn: String(formData.get(field.key) ?? "").trim(),
  }));

  await Promise.all(
    updates.map(({ key, valueMn }) =>
      db.siteContent.upsert({
        where: { key },
        create: { key, valueMn, updatedById: actor.id },
        update: { valueMn, updatedById: actor.id },
      }),
    ),
  );

  await writeAuditLog({
    actorId: actor.id,
    action: AUDIT_ACTIONS.CONTENT_UPDATED,
    entityType: "SiteContent",
    metadata: { keys: updates.map((u) => u.key) },
  });

  revalidateTag(CONTENT_CACHE_TAGS.site, "max"); // refresh cached public copy
  revalidatePath("/");
  redirect(`${BASE}?saved=1`);
}
