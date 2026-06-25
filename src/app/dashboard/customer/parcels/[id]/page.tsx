import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ROUTES } from "@/constants/routes";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-3 border-b border-neutral-100 last:border-0">
      <dt className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest sm:w-40 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-ink font-medium break-all">{value ?? "—"}</dd>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

const DELIVERABLE = ["READY_FOR_PICKUP", "ARRIVED_ULAANBAATAR", "SORTING"];

export default async function CustomerParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const { id } = await params;

  // Detail is keyed by publicCode (links from the list/dashboard) and scoped to
  // the current customer so one customer can't read another's parcel.
  const parcel = await db.parcel.findFirst({
    where: { publicCode: id, customerId: user.id, deletedAt: null },
    include: {
      events: { orderBy: { createdAt: "desc" }, take: 30 },
      currentWarehouse: { select: { name: true } },
      destinationBranch: { select: { name: true } },
    },
  });

  if (!parcel) notFound();

  const base = ROUTES.dashboard.customer;
  const dims = [parcel.lengthCm, parcel.widthCm, parcel.heightCm].some((d) => d != null)
    ? `${parcel.lengthCm ?? "?"} x ${parcel.widthCm ?? "?"} x ${parcel.heightCm ?? "?"} см`
    : null;
  const canRequest = DELIVERABLE.includes(parcel.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href={`${base}/parcels`} className="text-[13px] text-ink-3 hover:text-brand transition-colors">Миний бараа</Link>
          <span className="text-ink-3 text-[13px]">/</span>
          <span className="text-[13px] text-ink font-mono truncate">{parcel.publicCode.slice(-8).toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-black text-ink">Бараа #{parcel.publicCode.slice(-8).toUpperCase()}</h1>
          <StatusBadge status={parcel.status} />
        </div>
      </div>

      {canRequest && (
        <div className="flex flex-wrap gap-3">
          <Link href={`${base}/delivery`} className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors">
            Хүргэлт хүсэх
          </Link>
          <Link href={`${base}/storage`} className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-ink hover:bg-neutral-50 transition-colors">
            Хадгалалт хүсэх
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Барааны мэдээлэл">
          <dl>
            <InfoRow label="Нийтийн код" value={<span className="font-mono text-brand font-semibold">{parcel.publicCode.slice(-8).toUpperCase()}</span>} />
            <InfoRow label="Трак код" value={parcel.trackCodeOriginal ? <span className="font-mono text-xs">{parcel.trackCodeOriginal}</span> : null} />
            <InfoRow label="Төрөл" value={parcel.cargoType} />
            <InfoRow label="Тайлбар" value={parcel.description} />
            <InfoRow label="Тоо ширхэг" value={parcel.quantity} />
            <InfoRow label="Яаралтай" value={parcel.priority === "URGENT" ? "Тийм" : "Үгүй"} />
          </dl>
        </SectionCard>

        <SectionCard title="Жин / Үнэ / Байршил">
          <dl>
            <InfoRow label="Жин" value={parcel.weightKg != null ? `${parcel.weightKg} кг` : null} />
            <InfoRow label="Хэмжээс" value={dims} />
            <InfoRow label="Үнэ" value={parcel.priceAmount != null ? `${Number(parcel.priceAmount).toLocaleString("mn-MN")} ${parcel.currency}` : null} />
            <InfoRow label="Агуулах" value={parcel.currentWarehouse?.name} />
            <InfoRow label="Салбар" value={parcel.destinationBranch?.name} />
            <InfoRow label="Бүртгэгдсэн" value={new Date(parcel.createdAt).toLocaleDateString("mn-MN")} />
          </dl>
        </SectionCard>
      </div>

      <SectionCard title={`Хөдөлгөөний түүх (${parcel.events.length})`}>
        {parcel.events.length === 0 ? (
          <p className="text-sm text-ink-3 py-4">Хөдөлгөөн бүртгэгдээгүй байна.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {parcel.events.map((e) => (
              <li key={e.id} className="py-3 flex items-start gap-3">
                <div className="mt-0.5 shrink-0"><StatusBadge status={e.status} /></div>
                <div className="flex-1 min-w-0">
                  {e.messageMn && <p className="text-sm text-ink">{e.messageMn}</p>}
                  {e.locationText && <p className="text-xs text-ink-3 mt-0.5">{e.locationText}</p>}
                </div>
                <time className="text-xs text-ink-3 whitespace-nowrap shrink-0">{new Date(e.createdAt).toLocaleString("mn-MN")}</time>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
