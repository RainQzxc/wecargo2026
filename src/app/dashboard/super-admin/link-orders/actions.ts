"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";

const VALID_STATUSES = [
  "REQUESTED",
  "REVIEWING",
  "PAYMENT_PENDING",
  "ORDERED",
  "SELLER_SHIPPED",
  "TRACK_CODE_ADDED",
  "RECEIVED_AT_EREEN",
  "LINKED_TO_PARCEL",
  "CANCELLED",
  "ISSUE",
] as const;

type LinkOrderStatus = (typeof VALID_STATUSES)[number];

export async function updateLinkOrderStatus(
  orderId: string,
  status: string,
): Promise<void> {
  await requirePermission("linkOrders.updateStatus");

  if (!VALID_STATUSES.includes(status as LinkOrderStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  await db.linkOrder.update({
    where: { id: orderId },
    data: { status: status as LinkOrderStatus },
  });

  revalidatePath("/dashboard/super-admin/link-orders");
  revalidatePath(`/dashboard/super-admin/link-orders/${orderId}`);
}

export async function updateLinkOrderTrackCode(
  orderId: string,
  trackCode: string,
): Promise<void> {
  await requirePermission("linkOrders.update");

  await db.linkOrder.update({
    where: { id: orderId },
    data: {
      sellerTrackCodeOriginal: trackCode,
      sellerTrackCodeNormalized: trackCode.trim().toUpperCase(),
    },
  });

  revalidatePath("/dashboard/super-admin/link-orders");
  revalidatePath(`/dashboard/super-admin/link-orders/${orderId}`);
}
