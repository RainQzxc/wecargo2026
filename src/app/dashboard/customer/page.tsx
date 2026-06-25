import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default async function CustomerDashboardPage() {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const [inTransit, atUlaanbaatar, readyOrOut, delivered, activeLinkOrders] =
    await Promise.all([
      db.parcel.count({
        where: {
          customerId: user.id,
          deletedAt: null,
          status: { in: ["LOADED", "DEPARTED_EREEN", "IN_TRANSIT"] },
        },
      }),
      db.parcel.count({
        where: {
          customerId: user.id,
          deletedAt: null,
          status: { in: ["ARRIVED_ULAANBAATAR", "SORTING"] },
        },
      }),
      db.parcel.count({
        where: {
          customerId: user.id,
          deletedAt: null,
          status: { in: ["READY_FOR_PICKUP", "DELIVERY_REQUESTED", "OUT_FOR_DELIVERY"] },
        },
      }),
      db.parcel.count({
        where: { customerId: user.id, deletedAt: null, status: "DELIVERED" },
      }),
      db.linkOrder.count({
        where: { customerId: user.id, status: { notIn: ["CANCELLED"] } },
      }),
    ]);

  const activeParcels = await db.parcel.findMany({
    where: {
      customerId: user.id,
      deletedAt: null,
      status: { notIn: ["DELIVERED", "CANCELLED"] },
    },
    orderBy: { updatedAt: "desc" },
    take: 8,
    select: {
      publicCode: true,
      status: true,
      trackCodeOriginal: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">
          Сайн байна уу, {user.name ?? "та"}!
        </h1>
        <p className="text-sm text-ink-3 mt-1">Таны барааны мэдээлэл</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Замд явж байна"
          value={inTransit}
          color={inTransit > 0 ? "brand" : "default"}
          hint="Эрээнээс гарсан"
        />
        <StatCard
          label="УБ-д ирсэн"
          value={atUlaanbaatar}
          color={atUlaanbaatar > 0 ? "brand" : "default"}
          hint="Ангилалт хийгдэж байна"
        />
        <StatCard
          label="Авахад бэлэн"
          value={readyOrOut}
          color={readyOrOut > 0 ? "warning" : "default"}
          hint="Хүргэлт эсвэл авалт"
        />
        <StatCard label="Нийт хүргэгдсэн" value={delivered} color="success" />
      </div>

      {/* Active parcels */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Идэвхтэй бараанууд</h2>
          <Link
            href={`${ROUTES.dashboard.customer}/parcels`}
            className="text-xs text-brand hover:underline"
          >
            Бүгдийг харах
          </Link>
        </div>

        {activeParcels.length === 0 ? (
          <div className="px-5 py-10 text-center text-ink-3 text-sm">
            Идэвхтэй бараа байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {activeParcels.map((p) => (
              <Link
                key={p.publicCode}
                href={`${ROUTES.dashboard.customer}/parcels/${p.publicCode}`}
                className="px-5 py-3 flex items-center gap-3 text-sm hover:bg-neutral-50 transition-colors block"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-ink-2">
                    {p.publicCode.slice(-8).toUpperCase()}
                  </p>
                  {p.trackCodeOriginal && (
                    <p className="text-[11px] text-ink-3 truncate mt-0.5">
                      {p.trackCodeOriginal}
                    </p>
                  )}
                </div>
                <StatusBadge status={p.status} />
                <span className="text-xs text-ink-3 shrink-0 hidden sm:block">
                  {new Date(p.updatedAt).toLocaleDateString("mn-MN")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Link orders summary */}
      {activeLinkOrders > 0 && (
        <div className="bg-brand/5 border border-brand/20 rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink text-sm">
              {activeLinkOrders} идэвхтэй линк захиалга
            </p>
            <p className="text-xs text-ink-3 mt-0.5">
              Таны захиалсан бараанууд боловсруулагдаж байна
            </p>
          </div>
          <Link
            href={`${ROUTES.dashboard.customer}/link-orders`}
            className="text-sm text-brand font-medium hover:underline shrink-0"
          >
            Харах
          </Link>
        </div>
      )}
    </div>
  );
}
