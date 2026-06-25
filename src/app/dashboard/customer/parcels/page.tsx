import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/dashboard/Pagination";
import { getPageParams, getTotalPages, firstParam } from "@/lib/pagination";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";
import { ROUTES } from "@/constants/routes";
import type { Prisma, ParcelStatus } from "@prisma/client";

const FILTERABLE: ParcelStatus[] = [
  "IN_TRANSIT",
  "ARRIVED_ULAANBAATAR",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default async function CustomerParcelsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const status = firstParam(sp.status);
  const { page, skip, take, pageSize } = getPageParams(sp.page);

  const where: Prisma.ParcelWhereInput = {
    customerId: user.id,
    deletedAt: null,
    ...(status ? { status: status as ParcelStatus } : {}),
    ...(q
      ? {
          OR: [
            { publicCode: { contains: q, mode: "insensitive" } },
            { trackCodeNormalized: { contains: q.toUpperCase() } },
            { trackCodeOriginal: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, parcels] = await Promise.all([
    db.parcel.count({ where }),
    db.parcel.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take,
      select: {
        publicCode: true,
        trackCodeOriginal: true,
        status: true,
        cargoType: true,
        updatedAt: true,
      },
    }),
  ]);

  const totalPages = getTotalPages(total, pageSize);
  const base = `${ROUTES.dashboard.customer}/parcels`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Миний бараа</h1>
        <p className="text-sm text-ink-3 mt-1">
          Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> бараа
        </p>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 items-end bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs text-ink-3 font-medium">Хайх</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Трак код, нийтийн код…"
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Төлөв</label>
          <select
            name="status"
            defaultValue={status}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          >
            <option value="">Бүгд</option>
            {FILTERABLE.map((s) => (
              <option key={s} value={s}>{PARCEL_STATUS_LABELS_MN[s] ?? s}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хайх</button>
        {(q || status) && (
          <Link href={base} className="px-4 py-2 rounded-lg border border-neutral-200 text-ink-3 text-sm font-semibold hover:bg-neutral-50 transition-colors">Цэвэрлэх</Link>
        )}
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {parcels.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-3 text-sm">Бараа олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Код</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Трак код</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Төрөл</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Төлөв</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Шинэчлэгдсэн</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((p) => (
                  <tr key={p.publicCode} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      <Link href={`${base}/${p.publicCode}`} className="font-mono text-xs text-brand hover:underline">
                        {p.publicCode.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-3 font-mono text-xs">{p.trackCodeOriginal ?? "—"}</td>
                    <td className="px-5 py-3 text-ink-2">{p.cargoType ?? "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-xs text-ink-3 whitespace-nowrap">{new Date(p.updatedAt).toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseHref={base}
          searchParams={{ ...(q ? { q } : {}), ...(status ? { status } : {}) }}
        />
      )}
    </div>
  );
}
