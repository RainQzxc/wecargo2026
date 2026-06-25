"use server";

import { revalidatePath } from "next/cache";
import { forbidden } from "next/navigation";
import { db } from "@/server/db";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { writeAuditLog } from "@/lib/audit";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";
import { ROUTES } from "@/constants/routes";
import type { DeliveryStatus } from "@prisma/client";

const COURIER_BASE = ROUTES.dashboard.courier;

// Statuses a courier may move a delivery into.
const COURIER_NEXT: DeliveryStatus[] = ["OUT_FOR_DELIVERY", "DELIVERED", "FAILED"];

export interface DeliveryActionState {
  error?: string;
}

/**
 * Single entry point for a courier (or admin/super-admin) to advance a delivery
 * through its lifecycle. Courier role may only act on their OWN deliveries;
 * admins may act on any. Every change is audit-logged with the actor and a
 * before/after diff so the super-admin journal answers "who changed what".
 */
export async function setDeliveryStatus(
  _state: DeliveryActionState,
  formData: FormData,
): Promise<DeliveryActionState> {
  const user = await requireRole(ROLES.COURIER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const deliveryId = String(formData.get("deliveryId") ?? "").trim();
  const next = String(formData.get("status") ?? "").trim() as DeliveryStatus;
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (!deliveryId || !COURIER_NEXT.includes(next)) {
    return { error: "Буруу хүсэлт." };
  }

  const delivery = await db.deliveryRequest.findUnique({
    where: { id: deliveryId },
    select: { id: true, status: true, courierId: true, parcelId: true },
  });
  if (!delivery) return { error: "Хүргэлт олдсонгүй." };

  // Couriers are scoped to their own assignments.
  if (user.role === ROLES.COURIER && delivery.courierId !== user.id) {
    forbidden();
  }
  if (next === "FAILED" && !reason) {
    return { error: "Амжилтгүй болсон шалтгаан бичнэ үү." };
  }

  const prev = delivery.status;

  try {
    await db.$transaction(async (tx) => {
      await tx.deliveryRequest.update({
        where: { id: deliveryId },
        data: {
          status: next,
          ...(next === "DELIVERED" ? { deliveredAt: new Date() } : {}),
          ...(next === "FAILED" ? { failedReason: reason } : {}),
        },
      });

      await tx.deliveryEvent.create({
        data: { deliveryId, status: next, note: reason, createdById: user.id },
      });

      // Reflect a completed delivery on the parcel itself.
      if (next === "DELIVERED") {
        await tx.parcel.update({
          where: { id: delivery.parcelId },
          data: { status: "DELIVERED", updatedById: user.id },
        });
        await tx.parcelEvent.create({
          data: {
            parcelId: delivery.parcelId,
            status: "DELIVERED",
            messageMn: "Хүргэлт амжилттай дууссан",
            createdById: user.id,
          },
        });
      }
    });

    await writeAuditLog({
      actorId: user.id,
      action: AUDIT_ACTIONS.DELIVERY_STATUS_CHANGED,
      entityType: "DeliveryRequest",
      entityId: deliveryId,
      before: { status: prev },
      after: { status: next },
      metadata: reason ? { reason } : undefined,
    });
  } catch (err) {
    console.error("[setDeliveryStatus] error:", err);
    return { error: "Төлөв шинэчлэхэд алдаа гарлаа." };
  }

  revalidatePath(`${COURIER_BASE}/deliveries`);
  revalidatePath(`${COURIER_BASE}/deliveries/${deliveryId}`);
  revalidatePath(`${COURIER_BASE}/completed`);
  revalidatePath(COURIER_BASE);
  return {};
}
