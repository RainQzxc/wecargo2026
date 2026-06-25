import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge, DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN:"Супер Админ", ADMIN:"Админ", WAREHOUSE_STAFF:"Агуулах", CUSTOMER:"Хэрэглэгч", COURIER:"Хүргэлт",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("mn-MN", { year:"numeric", month:"long", day:"numeric" });
}

export default async function Page() {
  await requirePermission("reports.basic");

  const now = new Date();
  const todayStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart  = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    usersByRole, parcelsByStatus, deliveriesByStatus,
    todayParcels, thisMonthParcels, totalUsers, totalParcels,
    activeCustomers, monthlyParcels,
  ] = await Promise.all([
    db.user.groupBy({ by:["role"], _count:{ _all:true }, orderBy:{ _count:{ role:"desc" } } }),
    db.parcel.groupBy({ by:["status"], where:{ deletedAt:null }, _count:{ _all:true }, orderBy:{ _count:{ status:"desc" } }, take:6 }),
    db.deliveryRequest.groupBy({ by:["status"], _count:{ _all:true }, orderBy:{ _count:{ status:"desc" } } }),
    db.parcel.count({ where:{ deletedAt:null, createdAt:{ gte:todayStart } } }),
    db.parcel.count({ where:{ deletedAt:null, createdAt:{ gte:monthStart } } }),
    db.user.count(),
    db.parcel.count({ where:{ deletedAt:null } }),
    db.user.count({ where:{ role:"CUSTOMER", status:"ACTIVE" } }),
    db.parcel.findMany({ where:{ deletedAt:null, createdAt:{ gte:sixMonthsAgo } }, select:{ createdAt:true } }),
  ]);

  const monthlyTrend: { label:string; count:number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear(), m = d.getMonth();
    const label = d.toLocaleDateString("mn-MN", { year:"numeric", month:"short" });
    const count = monthlyParcels.filter((p) => { const pd = new Date(p.createdAt); return pd.getFullYear() === y && pd.getMonth() === m; }).length;
    monthlyTrend.push({ label, count });
  }

  const totalDeliveries = deliveriesByStatus.reduce((s,d) => s + d._count._all, 0);
  const parcelStatusTotal = parcelsByStatus.reduce((s,p) => s + p._count._all, 0);
  const trendMax = Math.max(...monthlyTrend.map((m) => m.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Тайлан ба Статистик</h1>
        <p className="text-sm text-ink-3 mt-1">Системийн нэгдсэн тайлан — <span className="font-medium">{formatDate(now)}</span></p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Нийт хэрэглэгч" value={totalUsers} />
        <StatCard label="Нийт бараа" value={totalParcels} />
        <StatCard label="Өнөөдөр шинэ бараа" value={todayParcels} color="brand" />
        <StatCard label="Энэ сарын бараа" value={thisMonthParcels} color="brand" />
        <StatCard label="Нийт хүргэлт" value={totalDeliveries} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Идэвхтэй үйлчлэгч" value={activeCustomers} />
        <StatCard label="Хүргэгдсэн" value={deliveriesByStatus.find((d) => d.status === "DELIVERED")?._count._all ?? 0} color="success" />
        <StatCard label="Явж байна" value={deliveriesByStatus.find((d) => d.status === "OUT_FOR_DELIVERY")?._count._all ?? 0} color="warning" />
        <StatCard label="Амжилтгүй" value={deliveriesByStatus.find((d) => d.status === "FAILED")?._count._all ?? 0} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100"><h2 className="font-semibold text-ink text-sm">Хэрэглэгч — Дүрээр</h2></div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-neutral-100 bg-neutral-50/60">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">Дүр</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">Тоо</th>
            </tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {usersByRole.map((row) => (
                <tr key={row.role} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-2.5"><span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">{ROLE_LABELS[row.role] ?? row.role}</span></td>
                  <td className="px-4 py-2.5 text-right font-semibold text-ink">{row._count._all.toLocaleString("mn-MN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink text-sm">Бараа — Төлөвөөр (Топ 6)</h2>
            <span className="text-xs text-ink-3">{parcelStatusTotal.toLocaleString("mn-MN")} нийт</span>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-neutral-100 bg-neutral-50/60">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">Төлөв</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">Тоо</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">%</th>
            </tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {parcelsByStatus.map((row) => {
                const pct = parcelStatusTotal > 0 ? ((row._count._all / parcelStatusTotal) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={row.status} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-2.5"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-2.5 text-right font-semibold text-ink">{row._count._all.toLocaleString("mn-MN")}</td>
                    <td className="px-4 py-2.5 text-right text-xs text-ink-3">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink text-sm">Хүргэлт — Төлөвөөр</h2>
            <span className="text-xs text-ink-3">{totalDeliveries.toLocaleString("mn-MN")} нийт</span>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-neutral-100 bg-neutral-50/60">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">Төлөв</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">Тоо</th>
            </tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {deliveriesByStatus.map((row) => (
                <tr key={row.status} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-2.5"><DeliveryStatusBadge status={row.status} /></td>
                  <td className="px-4 py-2.5 text-right font-semibold text-ink">{row._count._all.toLocaleString("mn-MN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100"><h2 className="font-semibold text-ink text-sm">Сарын бараа — Сүүлийн 6 сар</h2></div>
        <div className="px-5 py-6">
          <div className="flex items-end gap-3 h-36">
            {monthlyTrend.map((m) => {
              const hPct = trendMax > 0 ? (m.count / trendMax) * 100 : 0;
              return (
                <div key={m.label} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-semibold text-ink">{m.count.toLocaleString("mn-MN")}</span>
                  <div className="w-full flex items-end" style={{ height:"80px" }}>
                    <div className="w-full rounded-t-md bg-brand/80 transition-all" style={{ height:`${Math.max(hPct, m.count > 0 ? 4 : 0)}%` }} />
                  </div>
                  <span className="text-[10px] text-ink-3 text-center leading-tight truncate w-full">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
