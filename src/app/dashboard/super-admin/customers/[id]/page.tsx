import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";

const LINK_ORDER_STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Хүсэлт",
  REVIEWING: "Хянаж байна",
  PAYMENT_PENDING: "Төлбөр хүлээж байна",
  ORDERED: "Захиалсан",
  SELLER_SHIPPED: "Худалдагч илгээсэн",
  TRACK_CODE_ADDED: "Трак код нэмсэн",
  RECEIVED_AT_EREEN: "Эрээнд хүлээн авсан",
  LINKED_TO_PARCEL: "Илгээмжтэй холбосон",
  CANCELLED: "Цуцлагдсан",
  ISSUE: "Асуудал",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("customers.read");
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      customerProfile: true,
      addresses: true,
    },
  });

  if (!user || user.role !== "CUSTOMER") {
    notFound();
  }

  const [parcels, linkOrders, totalParcels, deliveredParcels, activeParcels] =
    await Promise.all([
      db.parcel.findMany({
        where: { customerId: id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.linkOrder.findMany({
        where: { customerId: id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.parcel.count({ where: { customerId: id } }),
      db.parcel.count({ where: { customerId: id, status: "DELIVERED" } }),
      db.parcel.count({
        where: {
          customerId: id,
          status: { notIn: ["DELIVERED", "CANCELLED"] },
        },
      }),
    ]);

  const displayName = user.name ?? user.email ?? user.phone ?? "—";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/dashboard/super-admin/customers"
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          &larr; Харилцагчид
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-ink">{displayName}</h1>
          <p className="text-xs text-ink-3 mt-0.5">
            Super-admin харагдац &mdash; энэ хуудас зөвхөн admin-д харагдана
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Нийт илгээмж" value={totalParcels} color="default" />
        <StatCard
          label="Хүргэгдсэн"
          value={deliveredParcels}
          color="success"
        />
        <StatCard
          label="Идэвхтэй"
          value={activeParcels}
          color="brand"
          hint="Хүргэгдсэн/Цуцлагдсанаас бусад"
        />
      </div>

      {/* Customer info */}
      <section className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold text-ink-3 uppercase tracking-widest mb-4">
          Харилцагчийн мэдээлэл
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex gap-2">
            <dt className="text-ink-3 w-28 shrink-0">Нэр</dt>
            <dd className="text-ink font-medium">{user.name ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-3 w-28 shrink-0">Утас</dt>
            <dd className="text-ink font-medium">{user.phone ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-3 w-28 shrink-0">Имэйл</dt>
            <dd className="text-ink font-medium">{user.email ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-3 w-28 shrink-0">Харилцагч код</dt>
            <dd className="text-ink font-medium font-mono">
              {user.customerProfile?.customerCode ?? "—"}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-3 w-28 shrink-0">Бүртгүүлсэн</dt>
            <dd className="text-ink">
              {new Date(user.createdAt).toLocaleDateString("mn-MN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-3 w-28 shrink-0">Статус</dt>
            <dd>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  user.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {user.status === "ACTIVE" ? "Идэвхтэй" : "Хаагдсан"}
              </span>
            </dd>
          </div>
          {user.customerProfile?.notes && (
            <div className="flex gap-2 sm:col-span-2">
              <dt className="text-ink-3 w-28 shrink-0">Тэмдэглэл</dt>
              <dd className="text-ink">{user.customerProfile.notes}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Addresses */}
      {user.addresses && user.addresses.length > 0 && (
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-ink-3 uppercase tracking-widest mb-4">
            Хаягууд ({user.addresses.length})
          </h2>
          <ul className="space-y-2">
            {user.addresses.map((addr: { id: string; label?: string | null; city?: string | null; district?: string | null; addressDetail?: string | null; recipientName?: string | null; recipientPhone?: string | null }) => (
              <li
                key={addr.id}
                className="text-sm rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3"
              >
                {addr.label && (
                  <span className="font-semibold text-ink mr-2">
                    {addr.label}
                  </span>
                )}
                <span className="text-ink-3">
                  {[addr.city, addr.district, addr.addressDetail]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </span>
                {(addr.recipientName || addr.recipientPhone) && (
                  <span className="ml-2 text-ink-3">
                    &mdash; {addr.recipientName ?? ""}{" "}
                    {addr.recipientPhone ?? ""}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent parcels */}
      <section className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold text-ink-3 uppercase tracking-widest mb-4">
          Сүүлийн илгээмжүүд
        </h2>
        {parcels.length === 0 ? (
          <p className="text-sm text-ink-3">Илгээмж байхгүй</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Код
                  </th>
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Трак код
                  </th>
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Статус
                  </th>
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Огноо
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {parcels.map((parcel: { id: string; publicCode: string; trackCodeOriginal?: string | null; status: string; createdAt: Date }) => (
                  <tr key={parcel.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-brand font-semibold">
                      {parcel.publicCode}
                    </td>
                    <td className="px-5 py-3 text-ink-3 font-mono text-xs">
                      {parcel.trackCodeOriginal ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={parcel.status} />
                    </td>
                    <td className="px-5 py-3 text-ink-3 text-xs whitespace-nowrap">
                      {new Date(parcel.createdAt).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent link orders */}
      <section className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold text-ink-3 uppercase tracking-widest mb-4">
          Сүүлийн захиалгууд (Link Order)
        </h2>
        {linkOrders.length === 0 ? (
          <p className="text-sm text-ink-3">Захиалга байхгүй</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Бүтээгдэхүүний URL
                  </th>
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Статус
                  </th>
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Тоо
                  </th>
                  <th className="text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest px-5 py-2.5">
                    Огноо
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {linkOrders.map((order: { id: string; productUrl: string; status: string; quantity: number; createdAt: Date }) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 max-w-xs">
                      <span
                        className="block truncate text-ink-3 text-xs font-mono"
                        title={order.productUrl}
                      >
                        {order.productUrl.length > 50
                          ? order.productUrl.slice(0, 50) + "..."
                          : order.productUrl}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-ink-3">
                        {LINK_ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink font-medium">
                      {order.quantity}
                    </td>
                    <td className="px-5 py-3 text-ink-3 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
