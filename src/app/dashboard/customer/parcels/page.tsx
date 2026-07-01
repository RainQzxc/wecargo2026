import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const FILTERS: { key: string; label: string; statuses?: string[] }[] = [
  { key: "active", label: "Идэвхтэй" },
  { key: "transit", label: "Замд", statuses: ["LOADED", "DEPARTED_EREEN", "IN_TRANSIT"] },
  { key: "ready", label: "Авахад бэлэн", statuses: ["READY_FOR_PICKUP", "DELIVERY_REQUESTED", "OUT_FOR_DELIVERY"] },
  { key: "delivered", label: "Хүргэгдсэн", statuses: ["DELIVERED"] },
  { key: "all", label: "Бүгд" },
];

export default async function CustomerParcelsPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string }>;
}) {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const { f = "active" } = await searchParams;
  const filter = FILTERS.find((x) => x.key === f) ?? FILTERS[0];

  const where: {
    customerId: string;
    deletedAt: null;
    status?: { in?: string[]; notIn?: string[] };
  } = { customerId: user.id, deletedAt: null };
  if (filter.statuses) where.status = { in: filter.statuses };
  else if (filter.key === "active") where.status = { notIn: ["DELIVERED", "CANCELLED"] };

  const parcels = await db.parcel.findMany({
    where: where as never,
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      publicCode: true,
      status: true,
      trackCodeOriginal: true,
      description: true,
      quantity: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-ink to-[#0c1413] p-6 text-white">
        <h1 className="text-2xl font-black tracking-tight">Миний бараа</h1>
        <p className="mt-1 text-sm text-white/60">Захиалсан бараануудаа хянаарай</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((x) => (
          <Link
            key={x.key}
            href={`?f=${x.key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              x.key === filter.key
                ? "bg-brand text-white"
                : "bg-white text-ink-3 border border-neutral-200 hover:text-ink"
            }`}
          >
            {x.label}
          </Link>
        ))}
      </div>

      {parcels.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-ink-3">Бараа алга</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {parcels.map((p) => (
            <Link
              key={p.publicCode}
              href={`/dashboard/customer/parcels/${p.publicCode}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-[0_12px_40px_rgba(17,17,17,0.08)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-ink">
                  {p.publicCode.slice(-8).toUpperCase()}
                </span>
                <StatusBadge status={p.status} />
              </div>
              {p.description && (
                <p className="mt-3 line-clamp-2 text-sm text-ink-2">{p.description}</p>
              )}
              {p.trackCodeOriginal && (
                <p className="mt-2 truncate font-mono text-[11px] text-ink-3">
                  {p.trackCodeOriginal}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs text-ink-3">
                <span>{p.quantity} ш</span>
                <span>{new Date(p.updatedAt).toLocaleDateString("mn-MN")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
