import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-100 py-2.5 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-widest text-ink-3">{label}</span>
      <span className="text-sm font-medium text-ink text-right">{value}</span>
    </div>
  );
}

export default async function CustomerParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const { id } = await params;

  const parcel = await db.parcel.findFirst({
    where: { publicCode: id, customerId: user.id, deletedAt: null },
    include: {
      events: { orderBy: { createdAt: "desc" } },
      currentWarehouse: { select: { name: true } },
      destinationBranch: { select: { name: true } },
    },
  });

  if (!parcel) notFound();

  const money =
    parcel.priceAmount != null
      ? `${Number(parcel.priceAmount).toLocaleString("mn-MN")} ${parcel.currency}`
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/dashboard/customer/parcels" className="text-[13px] text-ink-3 hover:text-brand">
          ← Миний бараа
        </Link>
      </div>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-ink to-[#0c1413] p-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-lg font-bold">{parcel.publicCode.slice(-8).toUpperCase()}</span>
          <StatusBadge status={parcel.status} />
        </div>
        {parcel.description && <p className="mt-3 text-sm text-white/70">{parcel.description}</p>}
        {parcel.currentLocationText && (
          <p className="mt-2 text-xs text-white/50">📍 {parcel.currentLocationText}</p>
        )}
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold text-ink">Мэдээлэл</h2>
        <Row label="Трак код" value={parcel.trackCodeOriginal} />
        <Row label="Тоо" value={`${parcel.quantity} ш`} />
        <Row label="Жин" value={parcel.weightKg != null ? `${Number(parcel.weightKg)} кг` : null} />
        <Row label="Эзэлхүүн" value={parcel.volumeM3 != null ? `${Number(parcel.volumeM3)} м³` : null} />
        <Row label="Үнэ" value={money} />
        <Row label="Одоогийн агуулах" value={parcel.currentWarehouse?.name} />
        <Row label="Хүргэх салбар" value={parcel.destinationBranch?.name} />
        <Row label="Бүртгэсэн" value={new Date(parcel.createdAt).toLocaleString("mn-MN")} />
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">Хөдөлгөөний түүх</h2>
        {parcel.events.length === 0 ? (
          <p className="py-4 text-sm text-ink-3">
            Одоогийн төлөв: {PARCEL_STATUS_LABELS_MN[parcel.status] ?? parcel.status}
          </p>
        ) : (
          <ol className="relative space-y-5 pl-6">
            <span className="absolute left-[7px] top-1 bottom-1 w-px bg-neutral-200" />
            {parcel.events.map((e, i) => (
              <li key={e.id} className="relative">
                <span
                  className={`absolute -left-6 top-1 size-3.5 rounded-full border-2 border-white ${
                    i === 0 ? "bg-brand" : "bg-neutral-300"
                  }`}
                />
                <p className="text-sm font-semibold text-ink">
                  {PARCEL_STATUS_LABELS_MN[e.status] ?? e.status}
                </p>
                {e.messageMn && <p className="mt-0.5 text-sm text-ink-2">{e.messageMn}</p>}
                <p className="mt-0.5 text-xs text-ink-3">
                  {e.locationText ? `${e.locationText} · ` : ""}
                  {new Date(e.createdAt).toLocaleString("mn-MN")}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
