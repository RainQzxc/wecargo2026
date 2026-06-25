import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { assignCourier, updateDeliveryStatus } from "../actions";

const DELIVERY_STATUS_OPTIONS = [
  { value: "REQUESTED", label: "Хүсэлт" },
  { value: "ASSIGNED", label: "Томилсон" },
  { value: "OUT_FOR_DELIVERY", label: "Явж байна" },
  { value: "DELIVERED", label: "Хүргэсэн" },
  { value: "FAILED", label: "Амжилтгүй" },
  { value: "RETURNED", label: "Буцаасан" },
  { value: "CANCELLED", label: "Цуцлагдсан" },
] as const;

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

const DELIVERY_LABELS: Record<string, string> = {
  REQUESTED: "Хүсэлт",
  ASSIGNED: "Томилсон",
  OUT_FOR_DELIVERY: "Явж байна",
  DELIVERED: "Хүргэсэн",
  FAILED: "Амжилтгүй",
  RETURNED: "Буцаасан",
  CANCELLED: "Цуцлагдсан",
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("deliveries.read");
  const { id } = await params;

  const [delivery, couriers] = await Promise.all([
    db.deliveryRequest.findUnique({
      where: { id },
      include: {
        parcel: {
          select: {
            id: true,
            publicCode: true,
            status: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        courier: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        events: {
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    db.user.findMany({
      where: { role: "COURIER", status: "ACTIVE" },
      select: { id: true, name: true, phone: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!delivery) {
    notFound();
  }

  async function assignCourierAction(formData: FormData) {
    "use server";
    const courierId = formData.get("courierId") as string;
    await assignCourier(id, courierId);
  }

  async function updateStatusAction(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    const note = (formData.get("note") as string) || undefined;
    await updateDeliveryStatus(id, status, note);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/dashboard/super-admin/deliveries"
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          &larr; Буцах
        </Link>
        <div className="h-4 w-px bg-neutral-200" />
        <h1 className="text-xl font-bold text-ink">Хүргэлт</h1>
        <DeliveryStatusBadge status={delivery.status} />
        <span className="text-xs text-ink-3 font-mono ml-auto">{id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipient info */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Хүлээн авагч</h2>
          <dl className="space-y-2">
            <Row label="Нэр" value={delivery.recipientName ?? "—"} />
            <Row label="Утас" value={delivery.recipientPhone ?? "—"} />
            <Row label="Хот" value={delivery.city ?? "—"} />
            <Row label="Дүүрэг" value={delivery.district ?? "—"} />
            <Row label="Хаяг" value={delivery.addressDetail} />
            <Row label="Цаг" value={delivery.preferredTime ?? "—"} />
          </dl>
        </section>

        {/* Parcel info */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Илгээмж</h2>
          {delivery.parcel ? (
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-ink-3">Код</dt>
                <dd>
                  <Link
                    href={`/dashboard/super-admin/parcels/${delivery.parcel.id}`}
                    className="text-brand hover:underline font-mono"
                  >
                    {delivery.parcel.publicCode}
                  </Link>
                </dd>
              </div>
              <Row
                label="Статус"
                value={
                  PARCEL_STATUS_LABELS_MN[delivery.parcel.status] ??
                  delivery.parcel.status
                }
              />
            </dl>
          ) : (
            <p className="text-sm text-ink-3">Илгээмж олдсонгүй</p>
          )}

          <div className="pt-2 border-t border-neutral-100">
            <h3 className="text-sm font-semibold text-ink mb-2">Харилцагч</h3>
            {delivery.customer ? (
              <dl className="space-y-2">
                <Row label="Нэр" value={delivery.customer.name ?? "—"} />
                <Row label="Утас" value={delivery.customer.phone ?? "—"} />
              </dl>
            ) : (
              <p className="text-sm text-ink-3">—</p>
            )}
          </div>
        </section>

        {/* Courier */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Курьер</h2>
          {delivery.courier ? (
            <dl className="space-y-2">
              <Row label="Нэр" value={delivery.courier.name ?? "—"} />
              <Row label="Утас" value={delivery.courier.phone ?? "—"} />
            </dl>
          ) : (
            <p className="text-sm text-ink-3">Томилогдоогүй</p>
          )}

          {/* Assign courier form */}
          <form action={assignCourierAction} className="pt-3 border-t border-neutral-100 space-y-3">
            <label className="block text-xs font-medium text-ink-3 uppercase tracking-wide">
              Курьер томилох
            </label>
            <select
              name="courierId"
              defaultValue={delivery.courierId ?? ""}
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              <option value="">-- Курьер сонгох --</option>
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? "Нэргүй"} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
            >
              Томилох
            </button>
          </form>
        </section>

        {/* Fee info */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Төлбөр / Дүгнэлт</h2>
          <dl className="space-y-2">
            <Row
              label="Хүргэлтийн үнэ"
              value={
                delivery.deliveryFeeAmount != null
                  ? `${Number(delivery.deliveryFeeAmount).toLocaleString()} ${delivery.currency}`
                  : "—"
              }
            />
            <Row
              label="Хүргэсэн огноо"
              value={formatDate(delivery.deliveredAt)}
            />
            <Row
              label="Амжилтгүй шалтгаан"
              value={delivery.failedReason ?? "—"}
            />
          </dl>
        </section>
      </div>

      {/* Status update form */}
      <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-ink">Статус шинэчлэх</h2>
        <form action={updateStatusAction} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-3 uppercase tracking-wide">
              Шинэ статус
            </label>
            <select
              name="status"
              defaultValue={delivery.status}
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              {DELIVERY_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-3 uppercase tracking-wide">
              Тэмдэглэл
            </label>
            <input
              type="text"
              name="note"
              placeholder="Нэмэлт тэмдэглэл..."
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white text-ink placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
          </div>
          <button
            type="submit"
            className="bg-ink text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
          >
            Шинэчлэх
          </button>
        </form>
      </section>

      {/* Events timeline */}
      <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-ink">Үйл явдлын түүх</h2>
        {delivery.events.length === 0 ? (
          <p className="text-sm text-ink-3">Үйл явдал байхгүй</p>
        ) : (
          <ol className="relative border-l-2 border-neutral-100 ml-2 space-y-5">
            {delivery.events.map((event) => (
              <li key={event.id} className="ml-5 relative">
                <div className="absolute -left-[1.65rem] top-1 size-3 rounded-full bg-brand/20 border-2 border-brand" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {DELIVERY_LABELS[event.status] ?? event.status}
                  </span>
                  <span className="text-xs text-ink-3">
                    {formatDate(event.createdAt)}
                  </span>
                </div>
                {event.note && (
                  <p className="mt-0.5 text-sm text-ink-3">{event.note}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-ink-3 shrink-0">{label}</dt>
      <dd className="text-ink text-right break-all">{value}</dd>
    </div>
  );
}
