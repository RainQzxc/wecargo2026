import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default async function SuperAdminDashboard() {
  await requireRole(ROLES.SUPER_ADMIN);

  const [
    totalUsers,
    totalParcels,
    activeParcels,
    activeWarehouses,
    activeBatches,
    pendingDeliveries,
    totalCustomers,
    issueCount,
  ] = await Promise.all([
    db.user.count(),
    db.parcel.count({ where: { deletedAt: null } }),
    db.parcel.count({
      where: { deletedAt: null, status: { notIn: ["DELIVERED", "CANCELLED"] } },
    }),
    db.warehouse.count({ where: { isActive: true } }),
    db.shipmentBatch.count({ where: { status: { notIn: ["CLOSED", "CANCELLED"] } } }),
    db.deliveryRequest.count({ where: { status: "REQUESTED" } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.parcel.count({ where: { deletedAt: null, status: "ISSUE" } }),
  ]);

  const recentParcels = await db.parcel.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      publicCode: true,
      status: true,
      customerName: true,
      createdAt: true,
      priceAmount: true,
      currency: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Үндсэн самбар</h1>
        <p className="text-sm text-ink-3 mt-1">Системийн ерөнхий мэдээлэл</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Нийт хэрэглэгч" value={totalUsers} />
        <StatCard label="Нийт бараа" value={totalParcels} />
        <StatCard label="Идэвхтэй бараа" value={activeParcels} color="brand" />
        <StatCard label="Үйлчлэгч" value={totalCustomers} />
        <StatCard label="Агуулах" value={activeWarehouses} />
        <StatCard label="Идэвхтэй бүлэг" value={activeBatches} />
        <StatCard
          label="Хүргэлт хүлээгдэж байна"
          value={pendingDeliveries}
          color={pendingDeliveries > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Асуудалтай бараа"
          value={issueCount}
          color={issueCount > 0 ? "danger" : "default"}
        />
      </div>

      {/* Recent parcels table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Сүүлийн бараанууд</h2>
          <span className="text-xs text-ink-3">{recentParcels.length} бараа</span>
        </div>

        {recentParcels.length === 0 ? (
          <div className="px-5 py-10 text-center text-ink-3 text-sm">
            Бараа байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentParcels.map((p) => (
              <div key={p.publicCode} className="px-5 py-3 flex items-center gap-3 text-sm">
                <code className="text-xs font-mono text-ink-2 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
                  {p.publicCode.slice(-8).toUpperCase()}
                </code>
                <span className="flex-1 text-ink truncate">{p.customerName ?? "—"}</span>
                <StatusBadge status={p.status} />
                {p.priceAmount != null && (
                  <span className="text-xs text-ink-3 shrink-0">
                    {Number(p.priceAmount).toLocaleString("mn-MN")} {p.currency}
                  </span>
                )}
                <span className="text-xs text-ink-3 shrink-0 hidden sm:block">
                  {new Date(p.createdAt).toLocaleDateString("mn-MN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
