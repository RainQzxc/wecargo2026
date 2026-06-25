import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/dashboard/Pagination";
import type { Prisma, DeliveryStatus } from "@prisma/client";

const PAGE_SIZE = 25;

const DELIVERY_STATUSES = ["REQUESTED","ASSIGNED","OUT_FOR_DELIVERY","DELIVERED","FAILED","RETURNED","CANCELLED"] as const;
const DELIVERY_STATUS_LABELS: Record<string, string> = {
  REQUESTED:"Хүсэлт", ASSIGNED:"Томилсон", OUT_FOR_DELIVERY:"Явж байна",
  DELIVERED:"Хүргэсэн", FAILED:"Амжилтгүй", RETURNED:"Буцаасан", CANCELLED:"Цуцлагдсан",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requirePermission("deliveries.read");

  const sp     = await searchParams;
  const status = DELIVERY_STATUSES.includes(sp.status as typeof DELIVERY_STATUSES[number]) ? sp.status : undefined;
  const page   = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip   = (page - 1) * PAGE_SIZE;

  const where: Prisma.DeliveryRequestWhereInput = status ? { status: status as DeliveryStatus } : {};
  const [deliveries, total] = await Promise.all([
    db.deliveryRequest.findMany({
      where, orderBy: { createdAt:"desc" }, skip, take: PAGE_SIZE,
      include: {
        parcel:  { select: { trackCodeOriginal:true, publicCode:true, customerName:true } },
        courier: { select: { name:true } },
      },
    }),
    db.deliveryRequest.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pp: Record<string, string> = {};
  if (status) pp.status = status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Хүргэлтүүд</h1>
        <p className="text-sm text-ink-3 mt-1">Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> хүргэлт</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link href="/dashboard/admin/deliveries" className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!status ? "bg-brand text-white" : "bg-white border border-neutral-200 text-ink-3 hover:text-ink"}`}>Бүгд</Link>
        {DELIVERY_STATUSES.map((s) => (
          <Link key={s} href={`/dashboard/admin/deliveries?status=${s}`} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${status === s ? "bg-brand text-white" : "bg-white border border-neutral-200 text-ink-3 hover:text-ink"}`}>
            {DELIVERY_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-3 text-sm">Хүргэлт олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Хүргэлт</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Ачаа</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Курьер</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Огноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/admin/deliveries/${d.id}`} className="font-mono text-xs text-brand hover:underline">{d.id.slice(-8)}</Link>
                      {d.addressDetail && <p className="text-xs text-ink-3 mt-0.5 max-w-[200px] truncate">{d.addressDetail}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {d.parcel ? (
                        <><p className="font-mono font-semibold text-xs text-ink">{d.parcel.trackCodeOriginal ?? d.parcel.publicCode}</p>
                        {d.parcel.customerName && <p className="text-xs text-ink-3 mt-0.5">{d.parcel.customerName}</p>}</>
                      ) : <span className="text-xs text-ink-3">—</span>}
                    </td>
                    <td className="px-4 py-3 text-ink-3">{d.courier?.name ?? <span className="italic text-xs">Томилоогүй</span>}</td>
                    <td className="px-4 py-3"><DeliveryStatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{d.createdAt.toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseHref="/dashboard/admin/deliveries" searchParams={pp} />
        </div>
      )}
    </div>
  );
}
