import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge, DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";
import { revalidatePath } from "next/cache";
import type { ParcelStatus } from "@prisma/client";

const ALL_STATUSES = [
  "REGISTERED","RECEIVED_AT_EREEN","MEASURED","PRICED","UNIDENTIFIED",
  "READY_FOR_LOADING","LOADED","DEPARTED_EREEN","IN_TRANSIT",
  "ARRIVED_ULAANBAATAR","SORTING","READY_FOR_PICKUP","DELIVERY_REQUESTED",
  "OUT_FOR_DELIVERY","DELIVERED","STORAGE_REQUESTED","ISSUE","CANCELLED",
] as const;

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  NOT_REQUIRED:"Шаардлагагүй", UNPAID:"Төлөөгүй", PARTIAL:"Хагас төлсөн",
  PAID:"Төлсөн", REFUNDED:"Буцаасан",
};
const PAYMENT_STATUS_CLASSES: Record<string, string> = {
  NOT_REQUIRED:"bg-neutral-100 text-ink-3", UNPAID:"bg-red-50 text-red-700",
  PARTIAL:"bg-amber-50 text-amber-700", PAID:"bg-green-50 text-green-700",
  REFUNDED:"bg-purple-50 text-purple-700",
};
const OWNER_STATUS_LABELS: Record<string, string> = {
  IDENTIFIED:"Тодорхой", UNIDENTIFIED:"Тодорхойгүй", CLAIM_PENDING:"Нэхэмжлэл хүлээж байна",
};
const OWNER_STATUS_CLASSES: Record<string, string> = {
  IDENTIFIED:"bg-green-50 text-green-700", UNIDENTIFIED:"bg-red-50 text-red-700",
  CLAIM_PENDING:"bg-amber-50 text-amber-700",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-3 border-b border-neutral-100 last:border-0">
      <dt className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest sm:w-44 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-ink font-medium break-all">{value ?? "—"}</dd>
    </div>
  );
}

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-neutral-200 overflow-hidden ${className ?? ""}`}>
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("parcels.read");
  const { id } = await params;

  const parcel = await db.parcel.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt:"desc" }, take: 20 },
      customer: { select: { id:true, name:true, phone:true } },
      currentWarehouse: true,
      createdBy: { select: { name:true } },
    },
  });

  if (!parcel) notFound();

  const [deliveryRequests, storageRequests] = await Promise.all([
    db.deliveryRequest.findMany({ where: { parcelId: id }, orderBy: { createdAt:"desc" }, take: 5 }),
    db.storageRequest.findMany({ where: { parcelId: id }, orderBy: { createdAt:"desc" }, take: 5 }),
  ]);

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    await requirePermission("parcels.updateStatus");
    const status = formData.get("status") as string;
    if (!status) return;
    await db.parcel.update({ where: { id }, data: { status: status as ParcelStatus } });
    revalidatePath(`/dashboard/admin/parcels/${id}`);
    revalidatePath("/dashboard/admin/parcels");
  }

  const dimensionParts = [
    parcel.lengthCm != null ? `${parcel.lengthCm}cm` : null,
    parcel.widthCm  != null ? `${parcel.widthCm}cm`  : null,
    parcel.heightCm != null ? `${parcel.heightCm}cm` : null,
  ].filter(Boolean);
  const dimensionStr = dimensionParts.length > 0 ? dimensionParts.join(" x ") : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard/admin/parcels" className="text-[13px] text-ink-3 hover:text-brand transition-colors">Илгээмжүүд</Link>
            <span className="text-ink-3 text-[13px]">/</span>
            <span className="text-[13px] text-ink font-mono truncate">{parcel.publicCode}</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-black text-ink">Бараа #{parcel.publicCode}</h1>
            <StatusBadge status={parcel.status} />
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${OWNER_STATUS_CLASSES[parcel.ownerStatus] ?? "bg-neutral-100 text-ink-3"}`}>
              {OWNER_STATUS_LABELS[parcel.ownerStatus] ?? parcel.ownerStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Хэрэглэгч">
          <dl>
            <InfoRow label="Нэр" value={
              parcel.customerId
                ? <Link href={`/dashboard/admin/customers/${parcel.customerId}`} className="text-brand hover:underline">{parcel.customerName ?? parcel.customer?.name ?? "—"}</Link>
                : parcel.customerName ?? "—"
            } />
            <InfoRow label="Утас" value={parcel.customerPhone ?? parcel.customer?.phone ?? null} />
            {!parcel.customerId && <InfoRow label="Холбоо" value={<span className="text-amber-600 text-xs">Системийн хэрэглэгчтэй холбогдоогүй</span>} />}
          </dl>
        </SectionCard>

        <SectionCard title="Трак код">
          <dl>
            <InfoRow label="Трак код" value={parcel.trackCodeOriginal ? <span className="font-mono text-xs">{parcel.trackCodeOriginal}</span> : null} />
            <InfoRow label="Нийтийн код" value={<span className="font-mono text-brand font-semibold">{parcel.publicCode}</span>} />
            {parcel.cargoType && <InfoRow label="Ачаа төрөл" value={parcel.cargoType} />}
          </dl>
        </SectionCard>

        <SectionCard title="Жин / Хэмжээ">
          <dl>
            <InfoRow label="Жин" value={parcel.weightKg != null ? `${parcel.weightKg} кг` : null} />
            <InfoRow label="Хэмжээс" value={dimensionStr} />
            <InfoRow label="Эзлэхүүн" value={parcel.volumeM3 != null ? `${parcel.volumeM3} м³` : null} />
            {parcel.quantity != null && <InfoRow label="Тоо ширхэг" value={parcel.quantity} />}
          </dl>
        </SectionCard>

        <SectionCard title="Үнэ / Төлбөр">
          <dl>
            <InfoRow label="Үнэ" value={parcel.priceAmount != null ? `${Number(parcel.priceAmount).toLocaleString("mn-MN")} ${parcel.currency ?? ""}` : null} />
            <InfoRow label="Төлбөрийн статус" value={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${PAYMENT_STATUS_CLASSES[parcel.paymentStatus] ?? "bg-neutral-100 text-ink-3"}`}>
                {PAYMENT_STATUS_LABELS[parcel.paymentStatus] ?? parcel.paymentStatus}
              </span>
            } />
          </dl>
        </SectionCard>

        <SectionCard title="Агуулах / Байршил">
          <dl>
            <InfoRow label="Агуулах" value={parcel.currentWarehouse?.name ?? null} />
            <InfoRow label="Бүртгэсэн" value={parcel.createdBy?.name ?? null} />
            <InfoRow label="Огноо" value={new Date(parcel.createdAt).toLocaleString("mn-MN")} />
          </dl>
        </SectionCard>

        <SectionCard title="Тэмдэглэл">
          <dl>
            <InfoRow label="Тайлбар" value={parcel.description ?? null} />
            <InfoRow label="Тэмдэглэл" value={parcel.notes ?? null} />
          </dl>
        </SectionCard>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-[13px] font-semibold text-ink">Статус өөрчлөх</h2>
        </div>
        <div className="p-5">
          <form action={handleUpdateStatus} className="flex items-center gap-3 flex-wrap">
            <select name="status" defaultValue={parcel.status} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{PARCEL_STATUS_LABELS_MN[s] ?? s}</option>)}
            </select>
            <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хадгалах</button>
            <span className="text-xs text-ink-3">Одоогийн: <StatusBadge status={parcel.status} /></span>
          </form>
        </div>
      </div>

      <SectionCard title={`Үйл явдлын түүх (${parcel.events.length})`}>
        {parcel.events.length === 0 ? (
          <p className="text-sm text-ink-3 py-4">Үйл явдал байхгүй.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {parcel.events.map((event: { id:string; status:string; messageMn?:string|null; locationText?:string|null; createdAt:Date }) => (
              <li key={event.id} className="py-3 flex items-start gap-3">
                <div className="mt-0.5 shrink-0"><StatusBadge status={event.status} /></div>
                <div className="flex-1 min-w-0">
                  {event.messageMn && <p className="text-sm text-ink">{event.messageMn}</p>}
                  {event.locationText && <p className="text-xs text-ink-3 mt-0.5">{event.locationText}</p>}
                </div>
                <time className="text-xs text-ink-3 whitespace-nowrap shrink-0">{new Date(event.createdAt).toLocaleString("mn-MN")}</time>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {deliveryRequests.length > 0 && (
        <SectionCard title={`Хүргэлтийн хүсэлтүүд (${deliveryRequests.length})`}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-neutral-100">
                {["Хүлээн авагч","Утас","Статус","Огноо"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {deliveryRequests.map((dr: { id:string; recipientName?:string|null; recipientPhone?:string|null; status:string; createdAt:Date }) => (
                  <tr key={dr.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3 text-ink font-medium">{dr.recipientName ?? "—"}</td>
                    <td className="px-5 py-3 text-ink-3 font-mono text-xs">{dr.recipientPhone ?? "—"}</td>
                    <td className="px-5 py-3"><DeliveryStatusBadge status={dr.status} /></td>
                    <td className="px-5 py-3 text-xs text-ink-3 whitespace-nowrap">{new Date(dr.createdAt).toLocaleString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
