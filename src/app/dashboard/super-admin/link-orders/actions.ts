"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { writeAuditLog } from "@/lib/audit";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

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
  const user = await requirePermission("linkOrders.updateStatus");

  if (!VALID_STATUSES.includes(status as LinkOrderStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const before = await db.linkOrder.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  await db.linkOrder.update({
    where: { id: orderId },
    data: { status: status as LinkOrderStatus },
  });

  await writeAuditLog({
    actorId: user.id,
    action: AUDIT_ACTIONS.LINK_ORDER_STATUS_CHANGED,
    entityType: "LinkOrder",
    entityId: orderId,
    before: before ? { status: before.status } : undefined,
    after: { status },
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
