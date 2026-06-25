import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default async function WarehouseDashboardPage() {
  const user = await requireRole(ROLES.WAREHOUSE_STAFF, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const staffProfile = await db.staffProfile.findUnique({
    where: { userId: user.id },
    include: { warehouse: true },
  });
  const warehouseId = staffProfile?.warehouseId ?? null;
  const warehouseName = staffProfile?.warehouse?.name ?? "Агуулах";

  const base = warehouseId
    ? { currentWarehouseId: warehouseId, deletedAt: null }
    : { deletedAt: null };

  const [toReceive, toMeasure, toPrize, readyToLoad, loadedCount, issueCount] =
    await Promise.all([
      db.parcel.count({ where: { ...base, status: "REGISTERED" } }),
      db.parcel.count({ where: { ...base, status: "RECEIVED_AT_EREEN" } }),
      db.parcel.count({ where: { ...base, status: "MEASURED" } }),
      db.parcel.count({ where: { ...base, status: "READY_FOR_LOADING" } }),
      db.parcel.count({ where: { ...base, status: "LOADED" } }),
      db.parcel.count({ where: { ...base, status: "ISSUE" } }),
    ]);

  const recentParcels = await db.parcel.findMany({
    where: base,
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      publicCode: true,
      status: true,
      customerName: true,
      trackCodeOriginal: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Агуулахын самбар</h1>
        <p className="text-sm text-ink-3 mt-1">{warehouseName}</p>
      </div>

      {/* Processing pipeline */}
      <div>
        <p className="text-xs font-semibold text-ink-3 uppercase tracking-widest mb-3">
          Боловсруулалтын дараалал
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard label="Бүртгэгдсэн" value={toReceive} hint="Хүлээн авах" />
          <StatCard label="Эрээнд ирсэн" value={toMeasure} hint="Хэмжих шаардлагатай" color="brand" />
          <StatCard label="Хэмжсэн" value={toPrize} hint="Үнэлэх шаардлагатай" />
          <StatCard label="Ачилтанд бэлэн" value={readyToLoad} color="brand" />
          <StatCard label="Ачигдсан" value={loadedCount} color="success" />
          <StatCard
            label="Асуудалтай"
            value={issueCount}
            color={issueCount > 0 ? "danger" : "default"}
          />
        </div>
      </div>

      {/* Recent parcels */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Сүүлийн бараанууд</h2>
          <span className="text-xs text-ink-3">{recentParcels.length} бараа</span>
        </div>

        {recentParcels.length === 0 ? (
          <div className="px-5 py-10 text-center text-ink-3 text-sm">Бараа байхгүй байна</div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentParcels.map((p) => (
              <div key={p.publicCode} className="px-5 py-3 flex items-center gap-3 text-sm">
                <code className="text-xs font-mono text-ink-2 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
                  {p.publicCode.slice(-8).toUpperCase()}
                </code>
                <div className="flex-1 min-w-0">
                  <p className="text-ink truncate">{p.customerName ?? "—"}</p>
                  {p.trackCodeOriginal && (
                    <p className="text-[11px] text-ink-3 truncate">{p.trackCodeOriginal}</p>
                  )}
                </div>
                <StatusBadge status={p.status} />
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
