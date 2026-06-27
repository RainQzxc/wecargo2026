import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/dashboard/Pagination";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 25;

const ALL_STATUSES = [
  "REGISTERED","RECEIVED_AT_EREEN","MEASURED","PRICED","UNIDENTIFIED",
  "READY_FOR_LOADING","LOADED","DEPARTED_EREEN","IN_TRANSIT",
  "ARRIVED_ULAANBAATAR","SORTING","READY_FOR_PICKUP","DELIVERY_REQUESTED",
  "OUT_FOR_DELIVERY","DELIVERED","STORAGE_REQUESTED","ISSUE","CANCELLED",
] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requirePermission("parcels.read");

  const sp     = await searchParams;
  const q      = sp.q?.trim() ?? "";
  const status = sp.status?.trim() ?? "";
  const page   = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip   = (page - 1) * PAGE_SIZE;

  const where: Prisma.ParcelWhereInput = { deletedAt: null };
  if (status && ALL_STATUSES.includes(status as typeof ALL_STATUSES[number])) {
    where.status = status as (typeof ALL_STATUSES)[number];
  }
  if (q) {
    where.OR = [
      { trackCodeOriginal: { contains: q, mode: "insensitive" } },
      { publicCode:        { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerPhone:{ contains: q, mode: "insensitive" } },
    ];
  }

  const [parcels, total] = await Promise.all([
    db.parcel.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: PAGE_SIZE }),
    db.parcel.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const sp2: Record<string, string> = {};
  if (q)      sp2.q      = q;
  if (status) sp2.status = status;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Ачааны Жагсаалт</h1>
          <p className="text-sm text-ink-3 mt-1">Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> ачаа</p>
        </div>
        <Link href="/dashboard/admin/parcels/new" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Шинэ ачаа
        </Link>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 items-end bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs text-ink-3 font-medium">Хайх</label>
          <input type="text" name="q" defaultValue={q} placeholder="Трак код, нэр, утас…" className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Төлөв</label>
          <select name="status" defaultValue={status} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
            <option value="">Бүгд</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{PARCEL_STATUS_LABELS_MN[s] ?? s}</option>)}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хайх</button>
        {(q || status) && <Link href="/dashboard/admin/parcels" className="px-4 py-2 rounded-lg border border-neutral-200 text-ink-3 text-sm font-semibold hover:bg-neutral-50 transition-colors">Цэвэрлэх</Link>}
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {parcels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-3">
            <p className="text-sm font-medium">Ачаа олдсонгүй</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Трак код</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Хэрэглэгч</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Төлөв</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Жин</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Огноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {parcels.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/admin/parcels/${p.id}`} className="font-mono text-sm font-semibold text-brand hover:underline">{p.trackCodeOriginal ?? p.publicCode}</Link>
                      {p.publicCode && <p className="text-xs text-ink-3 mt-0.5">{p.publicCode}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{p.customerName ?? "—"}</p>
                      {p.customerPhone && <p className="text-xs text-ink-3 mt-0.5">{p.customerPhone}</p>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right text-ink-3 font-mono text-xs">{p.weightKg != null ? `${Number(p.weightKg).toFixed(2)} кг` : "—"}</td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{p.createdAt.toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseHref="/dashboard/admin/parcels" searchParams={sp2} />
        </div>
      )}
    </div>
  );
}
