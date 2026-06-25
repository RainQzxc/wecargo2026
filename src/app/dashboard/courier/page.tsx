import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default async function CourierDashboardPage() {
  const user = await requireRole(ROLES.COURIER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [assigned, outForDelivery, deliveredToday, failedCount] = await Promise.all([
    db.deliveryRequest.count({ where: { courierId: user.id, status: "ASSIGNED" } }),
    db.deliveryRequest.count({ where: { courierId: user.id, status: "OUT_FOR_DELIVERY" } }),
    db.deliveryRequest.count({
      where: { courierId: user.id, status: "DELIVERED", deliveredAt: { gte: today } },
    }),
    db.deliveryRequest.count({
      where: { courierId: user.id, status: "FAILED" },
    }),
  ]);

  const activeDeliveries = await db.deliveryRequest.findMany({
    where: {
      courierId: user.id,
      status: { in: ["ASSIGNED", "OUT_FOR_DELIVERY"] },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      status: true,
      recipientName: true,
      recipientPhone: true,
      addressDetail: true,
      city: true,
      district: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Хүргэлтийн самбар</h1>
        <p className="text-sm text-ink-3 mt-1">
          Өнөөдөр: {today.toLocaleDateString("mn-MN")}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Томилогдсон"
          value={assigned}
          color={assigned > 0 ? "brand" : "default"}
          hint="Эхлэх хүлээгдэж байна"
        />
        <StatCard
          label="Явж байна"
          value={outForDelivery}
          color={outForDelivery > 0 ? "warning" : "default"}
          hint="OUT_FOR_DELIVERY"
        />
        <StatCard
          label="Өнөөдөр хүргэсэн"
          value={deliveredToday}
          color={deliveredToday > 0 ? "success" : "default"}
        />
        <StatCard
          label="Амжилтгүй"
          value={failedCount}
          color={failedCount > 0 ? "danger" : "default"}
        />
      </div>

      {/* Active deliveries */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Идэвхтэй хүргэлтүүд</h2>
          <Link
            href={`${ROUTES.dashboard.courier}/deliveries`}
            className="text-xs text-brand hover:underline"
          >
            Бүгдийг харах
          </Link>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="px-5 py-10 text-center text-ink-3 text-sm">
            Идэвхтэй хүргэлт байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {activeDeliveries.map((d) => (
              <Link
                key={d.id}
                href={`${ROUTES.dashboard.courier}/deliveries/${d.id}`}
                className="px-5 py-3 flex items-start gap-3 text-sm hover:bg-neutral-50 transition-colors block"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-ink truncate">
                      {d.recipientName ?? "—"}
                    </span>
                    {d.recipientPhone && (
                      <span className="text-xs text-ink-3">{d.recipientPhone}</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-3 truncate">
                    {[d.district, d.city, d.addressDetail].filter(Boolean).join(", ")}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <DeliveryStatusBadge status={d.status} />
                  <span className="text-[11px] text-ink-3">
                    {new Date(d.createdAt).toLocaleDateString("mn-MN")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
