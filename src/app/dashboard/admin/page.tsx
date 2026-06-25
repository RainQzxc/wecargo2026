import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default async function AdminDashboard() {
  const user = await requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN);

  // Get the warehouse this admin manages
  const staffProfile = await db.staffProfile.findUnique({
    where: { userId: user.id },
    include: { warehouse: true },
  });
  const warehouseId = staffProfile?.warehouseId ?? null;
  const warehouseName = staffProfile?.warehouse?.name ?? "Агуулах";

  const parcelWhere = warehouseId
    ? { currentWarehouseId: warehouseId, deletedAt: null }
    : { deletedAt: null };

  const [
    totalParcels,
    readyToLoad,
    inTransitBatches,
    pendingDeliveries,
    issueCount,
    unidentifiedCount,
  ] = await Promise.all([
    db.parcel.count({ where: parcelWhere }),
    db.parcel.count({
      where: { ...parcelWhere, status: "READY_FOR_LOADING" },
    }),
    db.shipmentBatch.count({
      where: {
        ...(warehouseId ? { originWarehouseId: warehouseId } : {}),
        status: { in: ["DEPARTED", "LOADED", "ARRIVED_ULAANBAATAR"] },
      },
    }),
    db.deliveryRequest.count({ where: { status: "REQUESTED" } }),
    db.parcel.count({ where: { ...parcelWhere, status: "ISSUE" } }),
    db.parcel.count({
      where: { ...parcelWhere, ownerStatus: "UNIDENTIFIED" },
    }),
  ]);

  const recentParcels = await db.parcel.findMany({
    where: parcelWhere,
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: {
      publicCode: true,
      status: true,
      customerName: true,
      updatedAt: true,
      priceAmount: true,
      currency: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Үндсэн самбар</h1>
        <p className="text-sm text-ink-3 mt-1">{warehouseName}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
        <StatCard label="Нийт бараа" value={totalParcels} />
        <StatCard
          label="Ачилтанд бэлэн"
          value={readyToLoad}
          color={readyToLoad > 0 ? "brand" : "default"}
          hint="READY_FOR_LOADING"
        />
        <StatCard label="Замд явж байна" value={inTransitBatches} hint="Бүлгийн тоо" />
        <StatCard
          label="Хүргэлт хүлээгдэж байна"
          value={pendingDeliveries}
          color={pendingDeliveries > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Асуудалтай"
          value={issueCount}
          color={issueCount > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Тодорхойгүй ачаа"
          value={unidentifiedCount}
          color={unidentifiedCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Сүүлд шинэчилсэн бараанууд</h2>
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
                  {new Date(p.updatedAt).toLocaleDateString("mn-MN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
