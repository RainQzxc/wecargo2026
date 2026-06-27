import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { Pagination } from "@/components/dashboard/Pagination";
import type { Prisma, LinkOrderStatus } from "@prisma/client";

const PAGE_SIZE = 25;

const ORDER_STATUSES = [
  "REQUESTED","REVIEWING","PAYMENT_PENDING","ORDERED","SELLER_SHIPPED",
  "TRACK_CODE_ADDED","RECEIVED_AT_EREEN","LINKED_TO_PARCEL","CANCELLED","ISSUE",
] as const;

const ORDER_STATUS_LABELS: Record<string, string> = {
  REQUESTED:"Хүсэлт", REVIEWING:"Хянаж байна", PAYMENT_PENDING:"Төлбөр хүлээж байна",
  ORDERED:"Захиалсан", SELLER_SHIPPED:"Худалдагч илгээсэн", TRACK_CODE_ADDED:"Трак код нэмсэн",
  RECEIVED_AT_EREEN:"Эрээнд хүлээн авсан", LINKED_TO_PARCEL:"Ачаатай холбосон",
  CANCELLED:"Цуцлагдсан", ISSUE:"Асуудал",
};

const STATUS_COLORS: Record<string, string> = {
  REQUESTED:"bg-neutral-100 text-ink-3", REVIEWING:"bg-amber-50 text-amber-700",
  PAYMENT_PENDING:"bg-orange-50 text-orange-700", ORDERED:"bg-blue-50 text-blue-700",
  SELLER_SHIPPED:"bg-indigo-50 text-indigo-700", TRACK_CODE_ADDED:"bg-teal-50 text-teal-700",
  RECEIVED_AT_EREEN:"bg-cyan-50 text-cyan-700", LINKED_TO_PARCEL:"bg-green-50 text-green-700",
  CANCELLED:"bg-red-50 text-red-700", ISSUE:"bg-red-50 text-red-700",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requirePermission("linkOrders.read");

  const sp     = await searchParams;
  const q      = sp.q?.trim() ?? "";
  const rawSt  = sp.status?.trim() ?? "";
  const status = ORDER_STATUSES.includes(rawSt as typeof ORDER_STATUSES[number]) ? rawSt as LinkOrderStatus : undefined;
  const page   = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip   = (page - 1) * PAGE_SIZE;

  const where: Prisma.LinkOrderWhereInput = {};
  if (status) where.status = status;
  if (q) where.OR = [
    { sellerTrackCodeOriginal: { contains: q, mode:"insensitive" } },
    { productUrl:              { contains: q, mode:"insensitive" } },
    { storeName:               { contains: q, mode:"insensitive" } },
    { customerName:            { contains: q, mode:"insensitive" } },
  ];

  const [orders, total] = await Promise.all([
    db.linkOrder.findMany({ where, orderBy: { createdAt:"desc" }, skip, take: PAGE_SIZE, include: { customer: { select: { name:true } } } }),
    db.linkOrder.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pp: Record<string, string> = {};
  if (q)      pp.q      = q;
  if (status) pp.status = status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Линк Захиалгууд</h1>
        <p className="text-sm text-ink-3 mt-1">Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> захиалга</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 items-end bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs text-ink-3 font-medium">Хайх</label>
          <input type="text" name="q" defaultValue={q} placeholder="Трак код, дэлгүүр, хэрэглэгч…" className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Статус</label>
          <select name="status" defaultValue={status ?? ""} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
            <option value="">Бүгд</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хайх</button>
        {(q || status) && <Link href="/dashboard/admin/link-orders" className="px-4 py-2 rounded-lg border border-neutral-200 text-ink-3 text-sm font-semibold hover:bg-neutral-50 transition-colors">Цэвэрлэх</Link>}
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-3 text-sm">Захиалга олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Трак код</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Дэлгүүр / URL</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Хэрэглэгч</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Огноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/admin/link-orders/${o.id}`} className="font-mono font-semibold text-brand hover:underline">{o.sellerTrackCodeOriginal ?? o.id.slice(-8)}</Link>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-ink truncate">{o.storeName ?? "—"}</p>
                      {o.productUrl && <p className="text-xs text-brand truncate mt-0.5 font-mono">{o.productUrl}</p>}
                    </td>
                    <td className="px-4 py-3 text-ink-3">{o.customer?.name ?? o.customerName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] ?? "bg-neutral-100 text-ink"}`}>
                        {ORDER_STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{o.createdAt.toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseHref="/dashboard/admin/link-orders" searchParams={pp} />
        </div>
      )}
    </div>
  );
}
