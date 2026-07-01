"use server";

import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";
import type { ParcelStatus } from "@prisma/client";

const VALID_PARCEL_STATUSES: ParcelStatus[] = [
  "REGISTERED",
  "RECEIVED_AT_EREEN",
  "MEASURED",
  "PRICED",
  "UNIDENTIFIED",
  "READY_FOR_LOADING",
  "LOADED",
  "DEPARTED_EREEN",
  "IN_TRANSIT",
  "ARRIVED_ULAANBAATAR",
  "SORTING",
  "READY_FOR_PICKUP",
  "DELIVERY_REQUESTED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "STORAGE_REQUESTED",
  "ISSUE",
  "CANCELLED",
];

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-]/g, "");
}

export async function createParcel(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const user = await requirePermission("parcels.create");

    const trackCode = formData.get("trackCode") as string | null;
    const customerName = formData.get("customerName") as string | null;
    const customerPhone = formData.get("customerPhone") as string | null;
    const cargoType = formData.get("cargoType") as string | null;
    const notes = formData.get("notes") as string | null;
    const warehouseId = formData.get("warehouseId") as string | null;

    const customerPhoneNormalized = customerPhone
      ? normalizePhone(customerPhone)
      : null;

    const parcel = await db.parcel.create({
      data: {
        trackCodeOriginal: trackCode ?? null,
        trackCodeNormalized: trackCode ? trackCode.trim().toUpperCase() : null,
        customerName: customerName ?? null,
        customerPhone: customerPhone ?? null,
        customerPhoneNormalized,
        cargoType: cargoType ?? null,
        notes: notes ?? null,
        originWarehouseId: warehouseId ?? null,
        currentWarehouseId: warehouseId ?? null,
        status: "REGISTERED",
        ownerStatus: customerPhone ? "IDENTIFIED" : "UNIDENTIFIED",
        createdById: user.id,
      },
    });

    await db.parcelEvent.create({
      data: {
        parcelId: parcel.id,
        status: "REGISTERED",
        messageMn: "Бүртгэгдлээ",
        createdById: user.id,
      },
    });

    revalidatePath("/dashboard/super-admin/parcels");
    redirect(`/dashboard/super-admin/parcels/${parcel.id}`);
  } catch (err) {
    // redirect throws — rethrow it so Next.js can handle navigation
    if (
      err instanceof Error &&
      (err.message === "NEXT_REDIRECT" ||
        (err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT"))
    ) {
      throw err;
    }
    logger.captureException("createParcel", err);
    return { error: "Бараа бүртгэхэд алдаа гарлаа. Мэдээллээ шалгаад дахин оролдоно уу." };
  }
}

export async function updateParcelStatus(
  parcelId: string,
  status: string
): Promise<void> {
  const user = await requirePermission("parcels.updateStatus");

  if (!VALID_PARCEL_STATUSES.includes(status as ParcelStatus)) {
    throw new Error(
      `Invalid parcel status. Must be one of: ${VALID_PARCEL_STATUSES.join(", ")}`
    );
  }

  const validStatus = status as ParcelStatus;

  await db.parcel.update({
    where: { id: parcelId },
    data: { status: validStatus, updatedById: user.id },
  });

  await db.parcelEvent.create({
    data: {
      parcelId,
      status: validStatus,
      createdById: user.id,
    },
  });

  revalidatePath(`/dashboard/super-admin/parcels/${parcelId}`);
  revalidatePath("/dashboard/super-admin/parcels");
}

export async function linkParcelToCustomer(
  parcelId: string,
  customerId: string
): Promise<void> {
  const user = await requirePermission("parcels.linkCustomer");

  const customer = await db.user.findUnique({
    where: { id: customerId },
    select: { id: true, name: true, phone: true, phoneNormalized: true },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  await db.parcel.update({
    where: { id: parcelId },
    data: {
      customerId: customer.id,
      customerName: customer.name ?? null,
      customerPhone: customer.phone ?? null,
      customerPhoneNormalized: customer.phoneNormalized ?? null,
      ownerStatus: "IDENTIFIED",
      updatedById: user.id,
    },
  });

  revalidatePath(`/dashboard/super-admin/parcels/${parcelId}`);
  revalidatePath("/dashboard/super-admin/parcels");
}
