"use server";

import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { writeAuditLog } from "@/lib/audit";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";
import { revalidatePath } from "next/cache";

export async function assignCourier(
  deliveryId: string,
  courierId: string
): Promise<{ error?: string }> {
  try {
    const user = await requirePermission("deliveries.assign");

    const courier = await db.user.findUnique({
      where: { id: courierId },
      select: { id: true, role: true },
    });

    if (!courier || courier.role !== "COURIER") {
      return { error: "The selected user is not a courier." };
    }

    await db.deliveryRequest.update({
      where: { id: deliveryId },
      data: {
        courierId,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    });

    await db.deliveryEvent.create({
      data: {
        deliveryId,
        status: "ASSIGNED",
        createdById: user.id,
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: AUDIT_ACTIONS.DELIVERY_ASSIGNED,
      entityType: "DeliveryRequest",
      entityId: deliveryId,
      after: { courierId, status: "ASSIGNED" },
    });

    revalidatePath("/dashboard/super-admin/deliveries");
    revalidatePath(`/dashboard/super-admin/deliveries/${deliveryId}`);

    return {};
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to assign courier.";
    return { error: message };
  }
}

export async function updateDeliveryStatus(
  deliveryId: string,
  status: string,
  note?: string
): Promise<void> {
  const user = await requirePermission("deliveries.updateStatus");

  const before = await db.deliveryRequest.findUnique({
    where: { id: deliveryId },
    select: { status: true },
  });

  const data: Record<string, unknown> = { status };

  if (status === "DELIVERED") {
    data.deliveredAt = new Date();
  }

  await db.deliveryRequest.update({
    where: { id: deliveryId },
    data,
  });

  await db.deliveryEvent.create({
    data: {
      deliveryId,
      status: status as never,
      note: note ?? null,
      createdById: user.id,
    },
  });

  await writeAuditLog({
    actorId: user.id,
    action: AUDIT_ACTIONS.DELIVERY_STATUS_CHANGED,
    entityType: "DeliveryRequest",
    entityId: deliveryId,
    before: before ? { status: before.status } : undefined,
    after: { status },
    metadata: note ? { note } : undefined,
  });

  revalidatePath("/dashboard/super-admin/deliveries");
  revalidatePath(`/dashboard/super-admin/deliveries/${deliveryId}`);
}
