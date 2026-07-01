"use server";

import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

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
      return { error: "Сонгосон хэрэглэгч курьер эрхтэй биш байна." };
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

    revalidatePath("/dashboard/super-admin/deliveries");
    revalidatePath(`/dashboard/super-admin/deliveries/${deliveryId}`);

    return {};
  } catch (err) {
    logger.captureException("assignCourier", err, { deliveryId, courierId });
    return { error: "Курьер томилоход алдаа гарлаа. Дахин оролдоно уу." };
  }
}

export async function updateDeliveryStatus(
  deliveryId: string,
  status: string,
  note?: string
): Promise<void> {
  const user = await requirePermission("deliveries.updateStatus");

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

  revalidatePath("/dashboard/super-admin/deliveries");
  revalidatePath(`/dashboard/super-admin/deliveries/${deliveryId}`);
}
