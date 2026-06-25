import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { DeliveryStatusControls } from "@/features/courier/DeliveryStatusControls";
import { ROUTES } from "@/constants/routes";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-neutral-100 last:border-0">
      <dt className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest sm:w-36 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-ink font-medium break-words">{value ?? "—"}</dd>
    </div>
  );
}

export default async function CourierDeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole(ROLES.COURIER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const { id } = await params;
  const base = `${ROUTES.dashboard.courier}/deliveries`;

  const delivery = await db.deliveryRequest.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      courierId: true,
      recipientName: true,
      recipientPhone: true,
      city: true,
      district: true,
      addressDetail: true,
      preferredTime: true,
      notes: true,
      failedReason: true,
      deliveredAt: true,
      createdAt: true,
      parcel: { select: { publicCode: true, cargoType: true, description: true } },
      events: { orderBy: { createdAt: "desc" }, select: { id: true, status: true, note: true, createdAt: true } },
    },
  });

  if (!delivery) notFound();
  // Couriers may only open their own assignments.
  if (user.role === ROLES.COURIER && delivery.courierId !== user.id) notFound();

  const address = [delivery.district, delivery.city, delivery.addressDetail].filter(Boolean).join(", ");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href={base} className="text-[13px] text-ink-3 hover:text-brand transition-colors">Хүргэлт</Link>
          <span className="text-ink-3 text-[13px]">/</span>
          <span className="text-[13px] text-ink font-mono">{delivery.parcel.publicCode.slice(-8).toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-black text-ink">{delivery.recipientName ?? "Хүргэлт"}</h1>
          <DeliveryStatusBadge status={delivery.status} />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <dl>
          <Row label="Хүлээн авагч" value={delivery.recipientName} />
          <Row label="Утас" value={delivery.recipientPhone ? <a href={`tel:${delivery.recipientPhone}`} className="text-brand">{delivery.recipientPhone}</a> : null} />
          <Row label="Хаяг" value={address || null} />
          <Row label="Тохиромжтой цаг" value={delivery.preferredTime} />
          <Row label="Бараа" value={delivery.parcel.publicCode.slice(-8).toUpperCase()} />
          <Row label="Төрөл" value={delivery.parcel.cargoType ?? delivery.parcel.description} />
          <Row label="Тэмдэглэл" value={delivery.notes} />
          {delivery.failedReason && <Row label="Амжилтгүй шалтгаан" value={<span className="text-red-700">{delivery.failedReason}</span>} />}
          {delivery.deliveredAt && <Row label="Хүргэсэн" value={new Date(delivery.deliveredAt).toLocaleString("mn-MN")} />}
        </dl>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-ink mb-4">Төлөв шинэчлэх</h2>
        <DeliveryStatusControls deliveryId={delivery.id} status={delivery.status} />
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-[13px] font-semibold text-ink">Түүх</h2>
        </div>
        <div className="px-5">
          {delivery.events.length === 0 ? (
            <p className="text-sm text-ink-3 py-4">Түүх алга.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {delivery.events.map((e) => (
                <li key={e.id} className="py-3 flex items-start gap-3">
                  <div className="mt-0.5 shrink-0"><DeliveryStatusBadge status={e.status} /></div>
                  <div className="flex-1 min-w-0">{e.note && <p className="text-sm text-ink">{e.note}</p>}</div>
                  <time className="text-xs text-ink-3 whitespace-nowrap shrink-0">{new Date(e.createdAt).toLocaleString("mn-MN")}</time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
