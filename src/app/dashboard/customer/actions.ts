"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { normalizePhone } from "@/lib/phone";

const BASE = "/dashboard/customer";

function str(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v.length > 0 ? v : null;
}

/** Customer creates a new link order (захиалга). */
export async function createLinkOrder(formData: FormData): Promise<void> {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const productUrl = str(formData, "productUrl");
  if (!productUrl) redirect(`${BASE}/link-orders/new?error=url`);

  const qtyRaw = Number.parseInt(String(formData.get("quantity") ?? "1"), 10);
  const quantity = Number.isFinite(qtyRaw) && qtyRaw > 0 ? qtyRaw : 1;

  await db.linkOrder.create({
    data: {
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      customerPhoneNormalized: user.phone ? normalizePhone(user.phone) : null,
      productUrl,
      quantity,
      storeName: str(formData, "storeName"),
      color: str(formData, "color"),
      size: str(formData, "size"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`${BASE}/link-orders`);
  redirect(`${BASE}/link-orders`);
}

/** Customer requests home delivery for one of their ready parcels. */
export async function requestDelivery(formData: FormData): Promise<void> {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const parcelId = str(formData, "parcelId");
  const addressDetail = str(formData, "addressDetail");
  if (!parcelId || !addressDetail) redirect(`${BASE}/delivery?error=required`);

  // Ownership check — only the customer's own parcel.
  const parcel = await db.parcel.findFirst({
    where: { id: parcelId, customerId: user.id, deletedAt: null },
    select: { id: true },
  });
  if (!parcel) redirect(`${BASE}/delivery?error=parcel`);

  await db.deliveryRequest.create({
    data: {
      parcelId: parcel.id,
      customerId: user.id,
      recipientName: str(formData, "recipientName") ?? user.name,
      recipientPhone: str(formData, "recipientPhone") ?? user.phone,
      recipientPhoneNormalized: (() => {
        const p = str(formData, "recipientPhone") ?? user.phone;
        return p ? normalizePhone(p) : null;
      })(),
      city: str(formData, "city"),
      district: str(formData, "district"),
      addressDetail,
      preferredTime: str(formData, "preferredTime"),
      notes: str(formData, "notes"),
    },
  });

  await db.parcel.update({
    where: { id: parcel.id },
    data: { status: "DELIVERY_REQUESTED" },
  });

  revalidatePath(`${BASE}/delivery`);
  redirect(`${BASE}/delivery?ok=1`);
}

/** Customer updates their own basic profile (name / phone). */
export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const name = str(formData, "name");
  const phone = str(formData, "phone");

  await db.user.update({
    where: { id: user.id },
    data: {
      name,
      phone,
      phoneNormalized: phone ? normalizePhone(phone) : null,
    },
  });

  revalidatePath(`${BASE}/profile`);
  redirect(`${BASE}/profile?ok=1`);
}
