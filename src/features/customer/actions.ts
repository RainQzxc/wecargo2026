"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { getCurrentUser } from "@/features/auth";
import { writeAuditLog } from "@/lib/audit";
import { normalizePhone } from "@/lib/phone";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";
import { ROUTES } from "@/constants/routes";

const CUSTOMER_BASE = ROUTES.dashboard.customer;

/** Parcel statuses a customer may request home delivery for. */
const DELIVERABLE = ["READY_FOR_PICKUP", "ARRIVED_ULAANBAATAR", "SORTING"];
/** Parcel statuses a customer may request storage for. */
const STORABLE = ["READY_FOR_PICKUP", "ARRIVED_ULAANBAATAR", "SORTING"];

async function requireCustomer() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.login);
  return user;
}

/** Assert the parcel exists and belongs to the current user. */
async function ownedParcel(parcelId: string, userId: string) {
  const parcel = await db.parcel.findFirst({
    where: { id: parcelId, customerId: userId, deletedAt: null },
    select: { id: true, status: true },
  });
  if (!parcel) throw new Error("Бараа олдсонгүй.");
  return parcel;
}

// ---------------------------------------------------------------------------
// Link order — customer self-service create
// ---------------------------------------------------------------------------

export interface LinkOrderState {
  error?: string;
}

export async function createLinkOrder(
  _state: LinkOrderState,
  formData: FormData,
): Promise<LinkOrderState> {
  const user = await requireCustomer();

  const productUrl = String(formData.get("productUrl") ?? "").trim();
  const quantityRaw = String(formData.get("quantity") ?? "1").trim();
  const color = String(formData.get("color") ?? "").trim() || null;
  const size = String(formData.get("size") ?? "").trim() || null;
  const storeName = String(formData.get("storeName") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const priority = formData.get("priority") === "URGENT" ? "URGENT" : "REGULAR";

  if (!productUrl) return { error: "Барааны линк (URL) шаардлагатай." };
  try {
    new URL(productUrl);
  } catch {
    return { error: "Линк (URL) буруу байна." };
  }

  const quantity = Math.max(1, Number.parseInt(quantityRaw, 10) || 1);

  let orderId: string;
  try {
    const order = await db.linkOrder.create({
      data: {
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        customerPhoneNormalized: user.phone ? normalizePhone(user.phone) : null,
        productUrl,
        quantity,
        color,
        size,
        storeName,
        notes,
        priority,
        status: "REQUESTED",
      },
      select: { id: true },
    });
    orderId = order.id;

    await writeAuditLog({
      actorId: user.id,
      action: AUDIT_ACTIONS.LINK_ORDER_CREATED,
      entityType: "LinkOrder",
      entityId: orderId,
    });
  } catch (err) {
    console.error("[createLinkOrder] error:", err);
    return { error: "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу." };
  }

  revalidatePath(`${CUSTOMER_BASE}/link-orders`);
  redirect(`${CUSTOMER_BASE}/link-orders`);
}

// ---------------------------------------------------------------------------
// Delivery request
// ---------------------------------------------------------------------------

export interface DeliveryState {
  error?: string;
}

export async function requestDelivery(
  _state: DeliveryState,
  formData: FormData,
): Promise<DeliveryState> {
  const user = await requireCustomer();

  const parcelId = String(formData.get("parcelId") ?? "").trim();
  const recipientName = String(formData.get("recipientName") ?? "").trim() || user.name;
  const recipientPhone = String(formData.get("recipientPhone") ?? "").trim() || user.phone;
  const city = String(formData.get("city") ?? "").trim() || null;
  const district = String(formData.get("district") ?? "").trim() || null;
  const addressDetail = String(formData.get("addressDetail") ?? "").trim();
  const preferredTime = String(formData.get("preferredTime") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!parcelId) return { error: "Бараа сонгоно уу." };
  if (!addressDetail) return { error: "Хүргэлтийн дэлгэрэнгүй хаяг шаардлагатай." };

  try {
    const parcel = await ownedParcel(parcelId, user.id);
    if (!DELIVERABLE.includes(parcel.status)) {
      return { error: "Энэ барааг одоогоор хүргэлтэд гаргах боломжгүй." };
    }

    await db.$transaction([
      db.deliveryRequest.create({
        data: {
          parcelId,
          customerId: user.id,
          status: "REQUESTED",
          recipientName,
          recipientPhone,
          recipientPhoneNormalized: recipientPhone ? normalizePhone(recipientPhone) : null,
          city,
          district,
          addressDetail,
          preferredTime,
          notes,
        },
      }),
      db.parcel.update({ where: { id: parcelId }, data: { status: "DELIVERY_REQUESTED" } }),
      db.parcelEvent.create({
        data: {
          parcelId,
          status: "DELIVERY_REQUESTED",
          messageMn: "Хэрэглэгч хүргэлт хүссэн",
          createdById: user.id,
        },
      }),
    ]);
  } catch (err) {
    console.error("[requestDelivery] error:", err);
    return { error: err instanceof Error ? err.message : "Алдаа гарлаа." };
  }

  revalidatePath(`${CUSTOMER_BASE}/delivery`);
  revalidatePath(`${CUSTOMER_BASE}/parcels`);
  redirect(`${CUSTOMER_BASE}/delivery`);
}

// ---------------------------------------------------------------------------
// Storage request
// ---------------------------------------------------------------------------

export interface StorageState {
  error?: string;
}

export async function requestStorage(
  _state: StorageState,
  formData: FormData,
): Promise<StorageState> {
  const user = await requireCustomer();

  const parcelId = String(formData.get("parcelId") ?? "").trim();
  const daysRaw = String(formData.get("days") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const days = daysRaw ? Math.max(1, Number.parseInt(daysRaw, 10) || 1) : null;

  if (!parcelId) return { error: "Бараа сонгоно уу." };

  try {
    const parcel = await ownedParcel(parcelId, user.id);
    if (!STORABLE.includes(parcel.status)) {
      return { error: "Энэ барааг одоогоор хадгалалтад өгөх боломжгүй." };
    }

    await db.$transaction([
      db.storageRequest.create({
        data: { parcelId, userId: user.id, status: "REQUESTED", days, notes },
      }),
      db.parcel.update({ where: { id: parcelId }, data: { status: "STORAGE_REQUESTED" } }),
      db.parcelEvent.create({
        data: {
          parcelId,
          status: "STORAGE_REQUESTED",
          messageMn: "Хэрэглэгч хадгалалт хүссэн",
          createdById: user.id,
        },
      }),
    ]);
  } catch (err) {
    console.error("[requestStorage] error:", err);
    return { error: err instanceof Error ? err.message : "Алдаа гарлаа." };
  }

  revalidatePath(`${CUSTOMER_BASE}/storage`);
  revalidatePath(`${CUSTOMER_BASE}/parcels`);
  redirect(`${CUSTOMER_BASE}/storage`);
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface ProfileState {
  error?: string;
  success?: boolean;
}

export async function updateProfile(
  _state: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await requireCustomer();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) return { error: "Нэр шаардлагатай." };

  try {
    // Guard phone uniqueness if changed.
    if (phone) {
      const phoneNormalized = normalizePhone(phone);
      const clash = await db.user.findFirst({
        where: { phoneNormalized, NOT: { id: user.id } },
        select: { id: true },
      });
      if (clash) return { error: "Энэ утасны дугаар өөр бүртгэлд ашиглагдсан байна." };
      await db.user.update({
        where: { id: user.id },
        data: { name, phone, phoneNormalized },
      });
    } else {
      await db.user.update({
        where: { id: user.id },
        data: { name, phone: null, phoneNormalized: null },
      });
    }

    await writeAuditLog({
      actorId: user.id,
      action: AUDIT_ACTIONS.CUSTOMER_UPDATED,
      entityType: "User",
      entityId: user.id,
    });
  } catch (err) {
    console.error("[updateProfile] error:", err);
    return { error: "Хадгалахад алдаа гарлаа." };
  }

  revalidatePath(`${CUSTOMER_BASE}/profile`);
  return { success: true };
}
