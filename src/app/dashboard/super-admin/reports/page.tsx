import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge, DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN:     "Супер Админ",
  ADMIN:           "Админ",
  WAREHOUSE_STAFF: "Агуулах",
  CUSTOMER:        "Хэрэглэгч",
  COURIER:         "Хүргэлт",
};

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  REQUESTED:        "Хүсэлт",
  ASSIGNED:         "Томилсон",
  OUT_FOR_DELIVERY: "Явж байна",
  DELIVERED:        "Хүргэсэн",
  FAILED:           "Амжилтгүй",
  RETURNED:         "Буцаасан",
  CANCELLED:        "Цуцлагдсан",
};

function formatCurrency(amount: number, currency = "CNY"): string {
  return `${amount.toLocaleString("mn-MN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Page() {
  await requirePermission("reports.basic");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    usersByRole,
    parcelsByStatus,
    deliveriesByStatus,
    deliveredPaidParcels,
    todayParcels,
    thisMonthParcels,
    totalUsers,
    totalParcels,
    activeCustomers,
    monthlyParcels,
  ] = await Promise.all([
    // 1. Users by role
    db.user.groupBy({
      by: ["role"],
      _count: { _all: true },
      orderBy: { _count: { role: "desc" } },
    }),

    // 2. Parcels by status (top 6, excluding deleted)
    db.parcel.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { _all: true },
      orderBy: { _count: { status: "desc" } },
      take: 6,
    }),

    // 3. Deliveries by status
    db.deliveryRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
      orderBy: { _count: { status: "desc" } },
    }),

    // 4. Revenue: DELIVERED parcels with PAID payment status
    db.parcel.findMany({
      where: {
        deletedAt: null,
        status: "DELIVERED",
        paymentStatus: "PAID",
      },
      select: { priceAmount: true, currency: true },
    }),

    // 5. Today's new parcels
    db.parcel.count({
      where: {
        deletedAt: null,
        createdAt: { gte: todayStart },
      },
    }),

    // 6. This month's new parcels
    db.parcel.count({
      where: {
        deletedAt: null,
        createdAt: { gte: monthStart },
      },
    }),

    // 7. Total users
    db.user.count(),

    // 8. Total parcels
    db.parcel.count({ where: { deletedAt: null } }),

    // 9. Active customers
    db.user.count({
      where: { role: "CUSTOMER", status: "ACTIVE" },
    }),

    // 10. Monthly parcel trend: last 6 months raw data
    db.parcel.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { createdAt: true },
    }),
  ]);

  // Group monthly parcels client-side
  const monthlyTrend: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = d.toLocaleDateString("mn-MN", { year: "numeric", month: "short" });
    const count = monthlyParcels.filter((p) => {
      const pd = new Date(p.createdAt);
      return pd.getFullYear() === year && pd.getMonth() === month;
    }).length;
    monthlyTrend.push({ label, count });
  }

  // Revenue calculation (group by currency)
  const revenueByCurrency: Record<string, number> = {};
  for (const p of deliveredPaidParcels) {
    if (p.priceAmount != null) {
      const cur = p.currency ?? "CNY";
      revenueByCurrency[cur] = (revenueByCurrency[cur] ?? 0) + Number(p.priceAmount);
    }
  }
  const revenueDisplay =
    Object.entries(revenueByCurrency)
      .map(([cur, amt]) => formatCurrency(amt, cur))
      .join(" / ") || "0";

  const totalDeliveries = deliveriesByStatus.reduce((s, d) => s + d._count._all, 0);
  const parcelStatusTotal = parcelsByStatus.reduce((s, p) => s + p._count._all, 0);

  // Max count for trend bar width
  const trendMax = Math.max(...monthlyTrend.map((m) => m.count), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-ink">Тайлан ба Статистик</h1>
          <p className="text-sm text-ink-3 mt-1">
            Системийн нэгдсэн тайлан — <span className="font-medium">{formatDate(now)}</span>
          </p>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Нийт хэрэглэгч" value={totalUsers} />
        <StatCard label="Нийт бараа" value={totalParcels} />
        <StatCard label="Өнөөдөр шинэ бараа" value={todayParcels} color="brand" />
        <StatCard label="Энэ сарын бараа" value={thisMonthParcels} color="brand" />
        <StatCard label="Орлого (хүргэгдсэн/төлсөн)" value={revenueDisplay} color="success" />
        <StatCard label="Нийт хүргэлт" value={totalDeliveries} />
      </div>

      {/* Secondary cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Идэвхтэй үйлчлэгч" value={activeCustomers} />
        <StatCard label="Хүргэгдсэн" value={deliveriesByStatus.find((d) => d.status === "DELIVERED")?._count._all ?? 0} color="success" />
        <StatCard label="Хүргэлтэнд явж байна" value={deliveriesByStatus.find((d) => d.status === "OUT_FOR_DELIVERY")?._count._all ?? 0} color="warning" />
        <StatCard label="Хүргэлт амжилтгүй" value={deliveriesByStatus.find((d) => d.status === "FAILED")?._count._all ?? 0} color="danger" />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users by role */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="font-semibold text-ink text-sm">Хэрэглэгч — Дүрээр</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Дүр
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Тоо
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {usersByRole.map((row) => (
                <tr key={row.role} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">
                      {ROLE_LABELS[row.role] ?? row.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-ink">
                    {row._count._all.toLocaleString("mn-MN")}
                  </td>
                </tr>
              ))}
              {usersByRole.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-ink-3 text-xs">
                    Мэдээлэл байхгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Parcels by status */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink text-sm">Бараа — Төлөвөөр (Топ 6)</h2>
            <span className="text-xs text-ink-3">{parcelStatusTotal.toLocaleString("mn-MN")} нийт</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Төлөв
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Тоо
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {parcelsByStatus.map((row) => {
                const pct = parcelStatusTotal > 0
                  ? ((row._count._all / parcelStatusTotal) * 100).toFixed(1)
                  : "0.0";
                return (
                  <tr key={row.status} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-2.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-ink">
                      {row._count._all.toLocaleString("mn-MN")}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-ink-3">
                      {pct}%
                    </td>
                  </tr>
                );
              })}
              {parcelsByStatus.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-3 text-xs">
                    Мэдээлэл байхгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Deliveries by status */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink text-sm">Хүргэлт — Төлөвөөр</h2>
            <span className="text-xs text-ink-3">{totalDeliveries.toLocaleString("mn-MN")} нийт</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Төлөв
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Тоо
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {deliveriesByStatus.map((row) => (
                <tr key={row.status} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <DeliveryStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-ink">
                    {row._count._all.toLocaleString("mn-MN")}
                  </td>
                </tr>
              ))}
              {deliveriesByStatus.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-ink-3 text-xs">
                    Мэдээлэл байхгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="font-semibold text-ink text-sm">Сарын бараа — Сүүлийн 6 сар</h2>
        </div>
        <div className="px-5 py-6">
          <div className="flex items-end gap-3 h-36">
            {monthlyTrend.map((m) => {
              const heightPct = trendMax > 0 ? (m.count / trendMax) * 100 : 0;
              return (
                <div key={m.label} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-semibold text-ink">
                    {m.count.toLocaleString("mn-MN")}
                  </span>
                  <div className="w-full flex items-end" style={{ height: "80px" }}>
                    <div
                      className="w-full rounded-t-md bg-brand/80 transition-all"
                      style={{ height: `${Math.max(heightPct, m.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-3 text-center leading-tight truncate w-full">
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export note */}
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <svg className="size-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        <span>
          Дэлгэрэнгүй тайланг экспортлохын тулд{" "}
          <code className="font-mono bg-amber-100 px-1 rounded text-xs">REPORTS_EXPORT</code>{" "}
          эрх шаардлагатай
        </span>
      </div>
    </div>
  );
}
