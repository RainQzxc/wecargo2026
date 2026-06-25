import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { updateLinkOrderStatus, updateLinkOrderTrackCode } from "../actions";

const LINK_ORDER_STATUSES = [
  "REQUESTED",
  "REVIEWING",
  "PAYMENT_PENDING",
  "ORDERED",
  "SELLER_SHIPPED",
  "TRACK_CODE_ADDED",
  "RECEIVED_AT_EREEN",
  "LINKED_TO_PARCEL",
  "CANCELLED",
  "ISSUE",
] as const;

const LINK_ORDER_STATUS_LABELS_MN: Record<string, string> = {
  REQUESTED: "Хүсэлт гаргасан",
  REVIEWING: "Шалгаж байна",
  PAYMENT_PENDING: "Төлбөр хүлээж байна",
  ORDERED: "Захиалсан",
  SELLER_SHIPPED: "Худалдагч илгээсэн",
  TRACK_CODE_ADDED: "Трак код нэмсэн",
  RECEIVED_AT_EREEN: "Эрээнд хүлээн авсан",
  LINKED_TO_PARCEL: "Илгээмжтэй холбосон",
  CANCELLED: "Цуцлагдсан",
  ISSUE: "Асуудал",
};

const PRIORITY_LABELS: Record<string, string> = {
  REGULAR: "Энгийн",
  URGENT: "Яаралтай",
};

const PARCEL_STATUS_LABELS_MN: Record<string, string> = {
  REGISTERED: "Бүртгэгдсэн",
  RECEIVED_AT_EREEN: "Эрээнд хүлээн авсан",
  MEASURED: "Хэмжсэн",
  PRICED: "Үнэлсэн",
  UNIDENTIFIED: "Тодорхойгүй",
  READY_FOR_LOADING: "Ачилтанд бэлэн",
  LOADED: "Ачигдсан",
  DEPARTED_EREEN: "Эрээнээс гарсан",
  IN_TRANSIT: "Замд явж байна",
  ARRIVED_ULAANBAATAR: "УБ-д ирсэн",
  SORTING: "Ангилж байна",
  READY_FOR_PICKUP: "Авахад бэлэн",
  DELIVERY_REQUESTED: "Хүргэлт хүссэн",
  OUT_FOR_DELIVERY: "Хүргэлтэнд гарсан",
  DELIVERED: "Хүргэгдсэн",
  STORAGE_REQUESTED: "Хадгалалт хүссэн",
  ISSUE: "Асуудал",
  CANCELLED: "Цуцлагдсан",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-3 border-b border-neutral-100 last:border-0">
      <dt className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest sm:w-44 shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="text-sm text-ink font-medium break-all">{value ?? "—"}</dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-neutral-200 overflow-hidden ${className ?? ""}`}>
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("linkOrders.read");
  const { id } = await params;

  const order = await db.linkOrder.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, name: true, phone: true },
      },
      parcels: {
        select: {
          id: true,
          publicCode: true,
          status: true,
        },
      },
    },
  });

  if (!order) notFound();

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    if (status) {
      await updateLinkOrderStatus(id, status);
    }
  }

  async function handleUpdateTrackCode(formData: FormData) {
    "use server";
    const trackCode = formData.get("trackCode") as string;
    if (trackCode !== null && trackCode !== undefined) {
      await updateLinkOrderTrackCode(id, trackCode);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/super-admin/link-orders"
              className="text-[13px] text-ink-3 hover:text-brand transition-colors"
            >
              Линк захиалгууд
            </Link>
            <span className="text-ink-3 text-[13px]">/</span>
            <span className="text-[13px] text-ink truncate">{id}</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-black text-ink">Линк захиалга</h1>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer info */}
        <SectionCard title="Хэрэглэгч">
          <dl>
            <InfoRow
              label="Нэр"
              value={
                order.customerId ? (
                  <Link
                    href={`/dashboard/super-admin/customers/${order.customerId}`}
                    className="text-brand hover:underline"
                  >
                    {order.customerName ?? order.customer?.name ?? "—"}
                  </Link>
                ) : (
                  order.customerName ?? "—"
                )
              }
            />
            <InfoRow
              label="Утас"
              value={order.customerPhone ?? order.customer?.phone ?? null}
            />
          </dl>
        </SectionCard>

        {/* Product info */}
        <SectionCard title="Бүтээгдэхүүн">
          <dl>
            <InfoRow
              label="Бүтээгдэхүүний URL"
              value={
                order.productUrl ? (
                  <a
                    href={order.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline break-all"
                  >
                    {order.productUrl}
                  </a>
                ) : null
              }
            />
            <InfoRow
              label="Тоо ширхэг"
              value={order.quantity != null ? order.quantity : null}
            />
            <InfoRow label="Өнгө" value={order.color ?? null} />
            <InfoRow label="Хэмжээ" value={order.size ?? null} />
            <InfoRow
              label="Яаралтай байдал"
              value={order.priority ? (PRIORITY_LABELS[order.priority] ?? order.priority) : null}
            />
          </dl>
        </SectionCard>

        {/* Pricing */}
        <SectionCard title="Үнэ / Төлбөр">
          <dl>
            <InfoRow
              label="Бүтээгдэхүүний үнэ"
              value={
                order.productPriceAmount != null
                  ? `${Number(order.productPriceAmount).toLocaleString("mn-MN")} ${order.currency ?? ""}`
                  : null
              }
            />
            <InfoRow
              label="Үйлчилгээний хөлс"
              value={
                order.serviceFeeAmount != null
                  ? `${Number(order.serviceFeeAmount).toLocaleString("mn-MN")} ${order.currency ?? ""}`
                  : null
              }
            />
            <InfoRow
              label="Нийт дүн"
              value={
                order.totalAmount != null ? (
                  <span className="font-bold text-ink">
                    {Number(order.totalAmount).toLocaleString("mn-MN")} {order.currency ?? ""}
                  </span>
                ) : null
              }
            />
            <InfoRow label="Валют" value={order.currency ?? null} />
          </dl>
        </SectionCard>

        {/* Store info */}
        <SectionCard title="Дэлгүүрийн мэдээлэл">
          <dl>
            <InfoRow label="Дэлгүүрийн нэр" value={order.storeName ?? null} />
            <InfoRow
              label="Дэлгүүрийн захиалгын №"
              value={
                order.storeOrderNo ? (
                  <span className="font-mono text-xs">{order.storeOrderNo}</span>
                ) : null
              }
            />
            <InfoRow
              label="Худалдагчийн трак код"
              value={
                order.sellerTrackCodeOriginal ? (
                  <span className="font-mono text-xs">{order.sellerTrackCodeOriginal}</span>
                ) : null
              }
            />
          </dl>
        </SectionCard>

        {/* Notes */}
        {order.notes && (
          <SectionCard title="Тэмдэглэл" className="lg:col-span-2">
            <dl>
              <InfoRow label="Тэмдэглэл" value={order.notes} />
            </dl>
          </SectionCard>
        )}
      </div>

      {/* Status update form */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-[13px] font-semibold text-ink">Статус өөрчлөх</h2>
        </div>
        <div className="p-5">
          <form action={handleUpdateStatus} className="flex items-center gap-3 flex-wrap">
            <select
              name="status"
              defaultValue={order.status}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              {LINK_ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LINK_ORDER_STATUS_LABELS_MN[s] ?? s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
            >
              Хадгалах
            </button>
            <span className="text-xs text-ink-3">
              Одоогийн: <StatusBadge status={order.status} />
            </span>
          </form>
        </div>
      </div>

      {/* Track code update form */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-[13px] font-semibold text-ink">Трак код шинэчлэх</h2>
        </div>
        <div className="p-5">
          <form action={handleUpdateTrackCode} className="flex items-center gap-3 flex-wrap">
            <input
              name="trackCode"
              type="text"
              defaultValue={order.sellerTrackCodeOriginal ?? ""}
              placeholder="Трак код оруулах..."
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand min-w-[240px]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
            >
              Хадгалах
            </button>
          </form>
        </div>
      </div>

      {/* Linked parcels */}
      {order.parcels && order.parcels.length > 0 && (
        <SectionCard title={`Холбоотой илгээмжүүд (${order.parcels.length})`}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                    Нийтийн код
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.parcels.map(
                  (parcel: { id: string; publicCode: string; status: string }) => (
                    <tr
                      key={parcel.id}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/super-admin/parcels/${parcel.id}`}
                          className="font-mono text-brand hover:underline text-sm"
                        >
                          {parcel.publicCode}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-ink-3">
                          {PARCEL_STATUS_LABELS_MN[parcel.status] ?? parcel.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
