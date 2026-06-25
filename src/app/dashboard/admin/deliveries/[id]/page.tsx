import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { DeliveryStatusBadge, StatusBadge } from "@/components/dashboard/StatusBadge";
import { revalidatePath } from "next/cache";
import type { DeliveryStatus } from "@prisma/client";

const DELIVERY_STATUSES: DeliveryStatus[] = ["REQUESTED","ASSIGNED","OUT_FOR_DELIVERY","DELIVERED","FAILED","RETURNED","CANCELLED"];

const STATUS_LABELS: Record<string, string> = {
  REQUESTED:"Хүсэлт", ASSIGNED:"Томилсон", OUT_FOR_DELIVERY:"Явж байна",
  DELIVERED:"Хүргэсэн", FAILED:"Амжилтгүй", RETURNED:"Буцаасан", CANCELLED:"Цуцлагдсан",
};

async function assignCourier(formData: FormData): Promise<void> {
  "use server";
  await requirePermission("deliveries.assign");
  const id = formData.get("id") as string;
  const courierId = formData.get("courierId") as string;
  if (!courierId) return;
  const courier = await db.user.findUnique({ where: { id: courierId } });
  if (!courier || courier.role !== "COURIER") return;
  await db.deliveryRequest.update({ where: { id }, data: { courierId, status: "ASSIGNED", assignedAt: new Date() } });
  revalidatePath(`/dashboard/admin/deliveries/${id}`);
}

async function updateStatus(formData: FormData): Promise<void> {
  "use server";
  await requirePermission("deliveries.updateStatus");
  const id = formData.get("id") as string;
  const status = formData.get("status") as DeliveryStatus;
  if (!DELIVERY_STATUSES.includes(status)) return;
  const data: Record<string, unknown> = { status };
  if (status === "DELIVERED") data.deliveredAt = new Date();
  await db.deliveryRequest.update({ where: { id }, data });
  revalidatePath(`/dashboard/admin/deliveries/${id}`);
  revalidatePath("/dashboard/admin/deliveries");
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("deliveries.read");
  const { id } = await params;

  const [delivery, couriers] = await Promise.all([
    db.deliveryRequest.findUnique({
      where: { id },
      include: {
        parcel:   { select: { id:true, trackCodeOriginal:true, publicCode:true, customerName:true, status:true } },
        courier:  { select: { id:true, name:true, email:true } },
        customer: { select: { name:true, email:true } },
      },
    }),
    db.user.findMany({ where: { role:"COURIER", status:"ACTIVE" }, select: { id:true, name:true }, orderBy: { name:"asc" } }),
  ]);

  if (!delivery) notFound();

  const addressFull = [delivery.city, delivery.district, delivery.addressDetail].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/deliveries" className="text-sm text-brand hover:underline">← Буцах</Link>
        <h1 className="text-2xl font-bold text-ink">Хүргэлт #{id.slice(-8)}</h1>
        <DeliveryStatusBadge status={delivery.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-3">
            <h2 className="font-semibold text-ink">Хүргэлтийн мэдээлэл</h2>
            {[
              { label:"Хаяг",       value: addressFull || "—" },
              { label:"Хүлээн авагч", value: delivery.recipientName ?? "—" },
              { label:"Утас",       value: delivery.recipientPhone ?? "—" },
              { label:"Хэрэглэгч",  value: delivery.customer ? `${delivery.customer.name ?? "—"} (${delivery.customer.email ?? ""})` : "—" },
              { label:"Огноо",      value: delivery.createdAt.toLocaleDateString("mn-MN") },
              { label:"Хүргэгдсэн", value: delivery.deliveredAt ? delivery.deliveredAt.toLocaleDateString("mn-MN") : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-xs text-ink-3 font-medium w-24 shrink-0 pt-0.5">{label}</span>
                <span className="text-sm text-ink">{value}</span>
              </div>
            ))}
          </div>

          {delivery.parcel && (
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <h2 className="font-semibold text-ink mb-3">Ачааны мэдээлэл</h2>
              <div className="flex items-center gap-3">
                <Link href={`/dashboard/admin/parcels/${delivery.parcel.id}`} className="font-mono text-brand hover:underline font-semibold">
                  {delivery.parcel.trackCodeOriginal ?? delivery.parcel.publicCode}
                </Link>
                <StatusBadge status={delivery.parcel.status} />
              </div>
              {delivery.parcel.customerName && <p className="text-sm text-ink-3 mt-1">{delivery.parcel.customerName}</p>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h2 className="font-semibold text-ink mb-3">Курьер томилох</h2>
            <form action={assignCourier} className="space-y-3">
              <input type="hidden" name="id" value={delivery.id} />
              <select name="courierId" defaultValue={delivery.courierId ?? ""} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
                <option value="">Курьер сонгох…</option>
                {couriers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" className="w-full px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Томилох</button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h2 className="font-semibold text-ink mb-3">Статус өөрчлөх</h2>
            <form action={updateStatus} className="space-y-3">
              <input type="hidden" name="id" value={delivery.id} />
              <select name="status" defaultValue={delivery.status} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
                {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <button type="submit" className="w-full px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хадгалах</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
