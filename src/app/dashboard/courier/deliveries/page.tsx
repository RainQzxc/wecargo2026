import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { ROUTES } from "@/constants/routes";

export default async function CourierDeliveriesPage() {
  const user = await requireRole(ROLES.COURIER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const base = `${ROUTES.dashboard.courier}/deliveries`;

  const deliveries = await db.deliveryRequest.findMany({
    where: { courierId: user.id, status: { in: ["ASSIGNED", "OUT_FOR_DELIVERY"] } },
    orderBy: [{ status: "asc" }, { assignedAt: "desc" }],
    select: {
      id: true,
      status: true,
      recipientName: true,
      recipientPhone: true,
      city: true,
      district: true,
      addressDetail: true,
      preferredTime: true,
      assignedAt: true,
      parcel: { select: { publicCode: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Идэвхтэй хүргэлт</h1>
        <p className="text-sm text-ink-3 mt-1">
          Танд оноогдсон <span className="font-semibold text-ink">{deliveries.length}</span> хүргэлт
        </p>
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl py-16 text-center text-ink-3 text-sm">
          Идэвхтэй хүргэлт алга байна
        </div>
      ) : (
        <div className="grid gap-3">
          {deliveries.map((d) => (
            <Link
              key={d.id}
              href={`${base}/${d.id}`}
              className="block bg-white border border-neutral-200 rounded-xl p-4 hover:border-brand/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{d.recipientName ?? "—"}</span>
                    {d.recipientPhone && <a href={`tel:${d.recipientPhone}`} className="text-xs text-brand">{d.recipientPhone}</a>}
                  </div>
                  <p className="text-sm text-ink-3 mt-0.5 truncate">
                    {[d.district, d.city, d.addressDetail].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-xs text-ink-3 mt-1 font-mono">{d.parcel.publicCode.slice(-8).toUpperCase()}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <DeliveryStatusBadge status={d.status} />
                  {d.preferredTime && <span className="text-[11px] text-ink-3">{d.preferredTime}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
