"use server";

import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";
import type { BannerPlacement } from "@prisma/client";

export async function createBanner(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requirePermission("content.create");

    const placement = formData.get("placement") as BannerPlacement;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    const href = formData.get("href") as string | null;
    const ctaLabel = formData.get("ctaLabel") as string | null;
    const sortOrderRaw = formData.get("sortOrder") as string | null;
    const isActiveRaw = formData.get("isActive") as string | null;
    const startsAtRaw = formData.get("startsAt") as string | null;
    const endsAtRaw = formData.get("endsAt") as string | null;

    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;
    const isActive = isActiveRaw === "true" || isActiveRaw === "on" || isActiveRaw === "1";
    const startsAt = startsAtRaw ? new Date(startsAtRaw) : null;
    const endsAt = endsAtRaw ? new Date(endsAtRaw) : null;

    await db.banner.create({
      data: {
        placement,
        title,
        subtitle: subtitle || null,
        imageUrl: imageUrl || null,
        href: href || null,
        ctaLabel: ctaLabel || null,
        sortOrder,
        isActive,
        startsAt,
        endsAt,
      },
    });

    revalidatePath("/dashboard/super-admin/banners");
  } catch (err) {
    logger.captureException("createBanner", err);
    return { error: "Баннер үүсгэхэд алдаа гарлаа. Мэдээллээ шалгаад дахин оролдоно уу." };
  }

  redirect("/dashboard/super-admin/banners");
}

export async function toggleBanner(
  bannerId: string,
  isActive: boolean
): Promise<void> {
  await requirePermission("content.activate");
  await db.banner.update({ where: { id: bannerId }, data: { isActive } });
  revalidatePath("/dashboard/super-admin/banners");
}

export async function deleteBanner(bannerId: string): Promise<void> {
  await requirePermission("content.update");
  await db.banner.delete({ where: { id: bannerId } });
  revalidatePath("/dashboard/super-admin/banners");
}
