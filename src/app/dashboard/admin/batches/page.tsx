import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { Pagination } from "@/components/dashboard/Pagination";

const PAGE_SIZE = 20;

type BatchStatus = "DRAFT"|"LOADING"|"LOADED"|"DEPARTED"|"ARRIVED_ULAANBAATAR"|"CLOSED"|"CANCELLED";
const BATCH_STATUS_LABELS: Record<BatchStatus, string> = {
  DRAFT:"Ноорог", LOADING:"Ачилж байна", LOADED:"Ачигдсан",
  DEPARTED:"Явсан", ARRIVED_ULAANBAATAR:"УБ ирсэн", CLOSED:"Хаагдсан", CANCELLED:"Цуцлагдсан",
};
const BATCH_STATUS_COLORS: Record<BatchStatus, string> = {
  DRAFT:"bg-neutral-100 text-ink-3", LOADING:"bg-amber-50 text-amber-700", LOADED:"bg-blue-50 text-blue-700",
  DEPARTED:"bg-indigo-50 text-indigo-700", ARRIVED_ULAANBAATAR:"bg-teal-50 text-teal-700",
  CLOSED:"bg-green-50 text-green-700", CANCELLED:"bg-red-50 text-red-700",
};
const ALL_STATUSES = Object.keys(BATCH_STATUS_LABELS) as BatchStatus[];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requirePermission("batches.read");

  const sp     = await searchParams;
  const status = ALL_STATUSES.includes(sp.status as BatchStatus) ? sp.status as BatchStatus : undefined;
  const page   = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip   = (page - 1) * PAGE_SIZE;

  const where = status ? { status } : {};
  const [batches, total] = await Promise.all([
    db.shipmentBatch.findMany({ where, orderBy: { createdAt:"desc" }, skip, take: PAGE_SIZE, include: { _count: { select: { items:true } } } }),
    db.shipmentBatch.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pp: Record<string, string> = {};
  if (status) pp.status = status;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Тээврийн Баглаа</h1>
          <p className="text-sm text-ink-3 mt-1">Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> баглаа</p>
        </div>
        <Link href="/dashboard/admin/batches/new" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Шинэ баглаа
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link href="/dashboard/admin/batches" className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!status ? "bg-brand text-white" : "bg-white border border-neutral-200 text-ink-3 hover:text-ink"}`}>Бүгд</Link>
        {ALL_STATUSES.map((s) => (
          <Link key={s} href={`/dashboard/admin/batches?status=${s}`} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${status === s ? "bg-brand text-white" : "bg-white border border-neutral-200 text-ink-3 hover:text-ink"}`}>
            {BATCH_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {batches.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-3 text-sm">Баглаа олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Баглааны №</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Статус</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Ачааны тоо</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Явсан</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Ирсэн</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Огноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/admin/batches/${b.id}`} className="font-mono font-semibold text-brand hover:underline">{b.batchNo}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${BATCH_STATUS_COLORS[b.status as BatchStatus] ?? "bg-neutral-100 text-ink"}`}>
                        {BATCH_STATUS_LABELS[b.status as BatchStatus] ?? b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-ink">{b._count.items}</td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{b.departedAt ? b.departedAt.toLocaleDateString("mn-MN") : "—"}</td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{b.arrivedAt ? b.arrivedAt.toLocaleDateString("mn-MN") : "—"}</td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{b.createdAt.toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseHref="/dashboard/admin/batches" searchParams={pp} />
        </div>
      )}
    </div>
  );
}
