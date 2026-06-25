"use server";

import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBatch(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requirePermission("batches.create");

    const batchNoRaw = String(formData.get("batchNo") ?? "").trim();
    const batchNo = batchNoRaw || "BATCH-" + Date.now();
    const originWarehouseId = String(
      formData.get("originWarehouseId") ?? ""
    ).trim();
    const vehiclePlate = String(formData.get("vehiclePlate") ?? "").trim() || null;
    const driverName = String(formData.get("driverName") ?? "").trim() || null;
    const driverPhone = String(formData.get("driverPhone") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!originWarehouseId) {
      return { error: "Origin warehouse is required." };
    }

    const batch = await db.shipmentBatch.create({
      data: {
        batchNo,
        originWarehouseId,
        vehiclePlate,
        driverName,
        driverPhone,
        notes,
        status: "DRAFT",
      },
    });

    revalidatePath("/dashboard/super-admin/batches");
    redirect(`/dashboard/super-admin/batches/${batch.id}`);
  } catch (err) {
    // redirect() throws internally — rethrow it so Next.js handles it
    if (
      err instanceof Error &&
      err.message === "NEXT_REDIRECT"
    ) {
      throw err;
    }
    const message =
      err instanceof Error ? err.message : "Failed to create batch.";
    return { error: message };
  }
}

export async function updateBatchStatus(
  batchId: string,
  status: string
): Promise<void> {
  await requirePermission("batches.updateStatus");

  const now = new Date();
  const data: Record<string, unknown> = { status };

  if (status === "DEPARTED") {
    data.departedAt = now;
  } else if (status === "ARRIVED_ULAANBAATAR") {
    data.arrivedAt = now;
  } else if (status === "CLOSED") {
    data.closedAt = now;
  }

  await db.shipmentBatch.update({
    where: { id: batchId },
    data,
  });

  revalidatePath("/dashboard/super-admin/batches");
  revalidatePath(`/dashboard/super-admin/batches/${batchId}`);
}

export async function addParcelToBatch(
  batchId: string,
  parcelPublicCode: string
): Promise<{ error?: string }> {
  try {
    await requirePermission("batches.addItem");

    const parcel = await db.parcel.findUnique({
      where: { publicCode: parcelPublicCode },
      select: { id: true },
    });

    if (!parcel) {
      return { error: "Parcel not found." };
    }

    const existing = await db.shipmentBatchItem.findUnique({
      where: { batchId_parcelId: { batchId, parcelId: parcel.id } },
      select: { id: true },
    });

    if (existing) {
      return { error: "Parcel is already in this batch." };
    }

    await db.shipmentBatchItem.create({
      data: {
        batchId,
        parcelId: parcel.id,
      },
    });

    revalidatePath("/dashboard/super-admin/batches");
    revalidatePath(`/dashboard/super-admin/batches/${batchId}`);

    return {};
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to add parcel to batch.";
    return { error: message };
  }
}

export async function removeParcelFromBatch(
  batchId: string,
  parcelId: string
): Promise<void> {
  await requirePermission("batches.removeItem");

  await db.shipmentBatchItem.delete({
    where: { batchId_parcelId: { batchId, parcelId } },
  });

  revalidatePath("/dashboard/super-admin/batches");
  revalidatePath(`/dashboard/super-admin/batches/${batchId}`);
}
