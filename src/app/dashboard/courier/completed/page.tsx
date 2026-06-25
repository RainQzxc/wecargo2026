import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/dashboard/Pagination";
import { getPageParams, getTotalPages } from "@/lib/pagination";
import { ROUTES } from "@/constants/routes";
import type { DeliveryStatus } from "@prisma/client";

const DONE: DeliveryStatus[] = ["DELIVERED", "FAILED", "RETURNED"];

export default async function CourierCompletedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireRole(ROLES.COURIER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const sp = await searchParams;
  const { page, skip, take, pageSize } = getPageParams(sp.page);
  const base = `${ROUTES.dashboard.courier}/completed`;

  const where = { courierId: user.id, status: { in: DONE } };

  const [total, deliveries] = await Promise.all([
    db.deliveryRequest.count({ where }),
    db.deliveryRequest.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        status: true,
        recipientName: true,
        city: true,
        district: true,
        deliveredAt: true,
        updatedAt: true,
        parcel: { select: { publicCode: true } },
      },
    }),
  ]);

  const totalPages = getTotalPages(total, pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Дууссан хүргэлт</h1>
        <p className="text-sm text-ink-3 mt-1">
          Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span>
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="py-16 text-center text-ink-3 text-sm">Бичлэг алга байна</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Код</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Хүлээн авагч</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Хаяг</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Төлөв</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">Огноо</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3 font-mono text-xs text-ink-2">{d.parcel.publicCode.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-ink font-medium">{d.recipientName ?? "—"}</td>
                    <td className="px-5 py-3 text-ink-3 text-xs">{[d.district, d.city].filter(Boolean).join(", ") || "—"}</td>
                    <td className="px-5 py-3"><DeliveryStatusBadge status={d.status} /></td>
                    <td className="px-5 py-3 text-xs text-ink-3 whitespace-nowrap">{new Date(d.deliveredAt ?? d.updatedAt).toLocaleDateString("mn-MN")}</td>
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
