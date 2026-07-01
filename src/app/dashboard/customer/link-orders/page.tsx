import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";

const LO_LABELS: Record<string, string> = {
  REQUESTED: "Хүсэлт илгээсэн",
  REVIEWING: "Хянаж байна",
  PAYMENT_PENDING: "Төлбөр хүлээж байна",
  ORDERED: "Захиалсан",
  SELLER_SHIPPED: "Худалдагч илгээсэн",
  TRACK_CODE_ADDED: "Трак код орсон",
  RECEIVED_AT_EREEN: "Эрээнд ирсэн",
  LINKED_TO_PARCEL: "Бараатай холбогдсон",
  CANCELLED: "Цуцлагдсан",
  ISSUE: "Асуудалтай",
};

const LO_VARIANT: Record<string, string> = {
  REQUESTED: "bg-neutral-100 text-ink-3",
  REVIEWING: "bg-blue-50 text-blue-700",
  PAYMENT_PENDING: "bg-amber-50 text-amber-700",
  ORDERED: "bg-blue-50 text-blue-700",
  SELLER_SHIPPED: "bg-amber-50 text-amber-700",
  TRACK_CODE_ADDED: "bg-amber-50 text-amber-700",
  RECEIVED_AT_EREEN: "bg-brand/10 text-brand",
  LINKED_TO_PARCEL: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  ISSUE: "bg-red-50 text-red-700",
};

export default async function CustomerLinkOrdersPage() {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const orders = await db.linkOrder.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      productUrl: true,
      storeName: true,
      quantity: true,
      color: true,
      size: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-ink to-[#0c1413] p-6 text-white">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Линк захиалга</h1>
          <p className="mt-1 text-sm text-white/60">Хятад дэлгүүрийн линкээр захиалах</p>
        </div>
        <Link
          href="/dashboard/customer/link-orders/new"
          className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          + Шинэ захиалга
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-ink-3">Захиалга алга</p>
          <Link
            href="/dashboard/customer/link-orders/new"
            className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
          >
            Эхний захиалгаа өгөх →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {o.storeName ?? "Захиалга"}
                  </p>
                  <a
                    href={o.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block truncate text-xs text-brand hover:underline"
                  >
                    {o.productUrl}
                  </a>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    LO_VARIANT[o.status] ?? "bg-neutral-100 text-ink-3"
                  }`}
                >
                  {LO_LABELS[o.status] ?? o.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
                <span>{o.quantity} ш</span>
                {o.color && <span>Өнгө: {o.color}</span>}
                {o.size && <span>Хэмжээ: {o.size}</span>}
                <span className="ml-auto">{new Date(o.createdAt).toLocaleDateString("mn-MN")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
