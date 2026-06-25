import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { Pagination } from "@/components/dashboard/Pagination";
import { getPageParams, getTotalPages } from "@/lib/pagination";
import { ROUTES } from "@/constants/routes";

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Хүсэлт илгээсэн",
  REVIEWING: "Шалгаж байна",
  PAYMENT_PENDING: "Төлбөр хүлээж байна",
  ORDERED: "Захиалсан",
  SELLER_SHIPPED: "Худалдагч илгээсэн",
  TRACK_CODE_ADDED: "Трак код нэмэгдсэн",
  RECEIVED_AT_EREEN: "Эрээнд хүлээн авсан",
  LINKED_TO_PARCEL: "Бараатай холбосон",
  CANCELLED: "Цуцалсан",
  ISSUE: "Асуудалтай",
};

const STATUS_CLASS: Record<string, string> = {
  REQUESTED: "bg-neutral-100 text-ink-3",
  REVIEWING: "bg-blue-50 text-blue-700",
  PAYMENT_PENDING: "bg-amber-50 text-amber-700",
  ORDERED: "bg-blue-50 text-blue-700",
  SELLER_SHIPPED: "bg-amber-50 text-amber-700",
  TRACK_CODE_ADDED: "bg-purple-50 text-purple-700",
  RECEIVED_AT_EREEN: "bg-brand/10 text-brand",
  LINKED_TO_PARCEL: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  ISSUE: "bg-red-50 text-red-700",
};

export default async function CustomerLinkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const sp = await searchParams;
  const { page, skip, take, pageSize } = getPageParams(sp.page);
  const base = `${ROUTES.dashboard.customer}/link-orders`;

  const where = { customerId: user.id };
  const [total, orders] = await Promise.all([
    db.linkOrder.count({ where }),
    db.linkOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        productUrl: true,
        storeName: true,
        quantity: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPages = getTotalPages(total, pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Линк захиалга</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> захиалга
          </p>
        </div>
        <Link href={`${base}/new`} className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0">
          + Шинэ захиалга
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-ink-3 text-sm">Захиалга алга байна</p>
            <Link href={`${base}/new`} className="text-brand text-sm font-semibold hover:underline">Эхний захиалгаа илгээх →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Дэлгүүр / Линк</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Тоо</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Төлөв</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Огноо</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3 max-w-[320px]">
                      <p className="text-ink font-medium">{o.storeName ?? "—"}</p>
                      <a href={o.productUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline truncate block">
                        {o.productUrl}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-ink-2">{o.quantity}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_CLASS[o.status] ?? "bg-neutral-100 text-ink-3"}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-3 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} baseHref={base} />}
    </div>
  );
}
