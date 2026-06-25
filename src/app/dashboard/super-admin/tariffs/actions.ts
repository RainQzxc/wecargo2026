"use server";

import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTariff(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requirePermission("tariffs.create");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const routeCode = formData.get("routeCode") as string | null;
    const cargoType = formData.get("cargoType") as string | null;
    const unit = formData.get("unit") as string;
    const priceAmountRaw = formData.get("priceAmount") as string;
    const currency = (formData.get("currency") as string) || "CNY";
    const minFeeAmountRaw = formData.get("minFeeAmount") as string | null;
    const isActiveRaw = formData.get("isActive");

    const priceAmount = parseFloat(priceAmountRaw);
    const minFeeAmount =
      minFeeAmountRaw && minFeeAmountRaw.trim() !== ""
        ? parseFloat(minFeeAmountRaw)
        : null;
    const isActive = isActiveRaw === "true" || isActiveRaw === "on" || isActiveRaw === "1";

    await db.tariffRule.create({
      data: {
        name,
        description: description || null,
        routeCode: routeCode || null,
        cargoType: cargoType || null,
        unit,
        priceAmount,
        currency,
        minFeeAmount,
        isActive,
      },
    });

    revalidatePath("/dashboard/super-admin/tariffs");
    redirect("/dashboard/super-admin/tariffs");
  } catch (err) {
    // redirect() throws internally — rethrow it so Next.js handles the redirect
    if (
      err instanceof Error &&
      err.message === "NEXT_REDIRECT"
    ) {
      throw err;
    }
    const message =
      err instanceof Error ? err.message : "Failed to create tariff.";
    return { error: message };
  }
}

export async function toggleTariff(
  tariffId: string,
  isActive: boolean
): Promise<void> {
  await requirePermission("tariffs.activate");
  await db.tariffRule.update({
    where: { id: tariffId },
    data: { isActive },
  });
  revalidatePath("/dashboard/super-admin/tariffs");
}

export async function deleteTariff(tariffId: string): Promise<void> {
  await requirePermission("tariffs.delete");
  await db.tariffRule.delete({ where: { id: tariffId } });
  revalidatePath("/dashboard/super-admin/tariffs");
}
