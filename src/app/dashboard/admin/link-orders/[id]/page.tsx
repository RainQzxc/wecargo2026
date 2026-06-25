import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import type { LinkOrderStatus } from "@prisma/client";

const LINK_ORDER_STATUSES: LinkOrderStatus[] = [
  "REQUESTED","REVIEWING","PAYMENT_PENDING","ORDERED","SELLER_SHIPPED",
  "TRACK_CODE_ADDED","RECEIVED_AT_EREEN","LINKED_TO_PARCEL","CANCELLED","ISSUE",
];

const STATUS_LABELS: Record<string, string> = {
  REQUESTED:"Хүсэлт", REVIEWING:"Хянаж байна", PAYMENT_PENDING:"Төлбөр хүлээж байна",
  ORDERED:"Захиалсан", SELLER_SHIPPED:"Худалдагч илгээсэн", TRACK_CODE_ADDED:"Трак код нэмсэн",
  RECEIVED_AT_EREEN:"Эрээнд хүлээн авсан", LINKED_TO_PARCEL:"Ачаатай холбосон",
  CANCELLED:"Цуцлагдсан", ISSUE:"Асуудал",
};

async function updateStatus(formData: FormData): Promise<void> {
  "use server";
  await requirePermission("linkOrders.updateStatus");
  const id = formData.get("id") as string;
  const status = formData.get("status") as LinkOrderStatus;
  if (!LINK_ORDER_STATUSES.includes(status)) return;
  await db.linkOrder.update({ where: { id }, data: { status } });
  revalidatePath(`/dashboard/admin/link-orders/${id}`);
  revalidatePath("/dashboard/admin/link-orders");
}

async function updateTrackCode(formData: FormData): Promise<void> {
  "use server";
  await requirePermission("linkOrders.update");
  const id = formData.get("id") as string;
  const raw = (formData.get("trackCode") as string | null)?.trim() ?? "";
  await db.linkOrder.update({ where: { id }, data: { sellerTrackCodeOriginal: raw ? raw.toUpperCase() : null } });
  revalidatePath(`/dashboard/admin/link-orders/${id}`);
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("linkOrders.read");
  const { id } = await params;

  const order = await db.linkOrder.findUnique({
    where: { id },
    include: {
      customer: { select: { id:true, name:true, email:true } },
      parcels:  { select: { id:true, publicCode:true, trackCodeOriginal:true, status:true }, take: 1 },
    },
  });

  if (!order) notFound();

  const linkedParcel = order.parcels[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/link-orders" className="text-sm text-brand hover:underline">← Буцах</Link>
        <h1 className="text-2xl font-bold text-ink">Линк захиалга</h1>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-ink">{STATUS_LABELS[order.status] ?? order.status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-3">
          <h2 className="font-semibold text-ink">Мэдээлэл</h2>
          {[
            { label:"Трак код",     value: order.sellerTrackCodeOriginal ?? "—" },
            { label:"Дэлгүүр",      value: order.storeName ?? "—" },
            { label:"Дэлгүүрийн №", value: order.storeOrderNo ?? "—" },
            { label:"URL",          value: order.productUrl },
            { label:"Тоо",          value: order.quantity.toString() },
            { label:"Хэмжээ",       value: order.size ?? "—" },
            { label:"Өнгө",         value: order.color ?? "—" },
            { label:"Хэрэглэгч",    value: order.customer ? `${order.customer.name ?? "—"} (${order.customer.email ?? "—"})` : (order.customerName ?? "—") },
            { label:"Огноо",        value: order.createdAt.toLocaleDateString("mn-MN") },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-xs text-ink-3 font-medium w-28 shrink-0 pt-0.5">{label}</span>
              <span className="text-sm text-ink break-all">{value}</span>
            </div>
          ))}
          {linkedParcel && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-3 font-medium w-28 shrink-0">Ачаа</span>
              <Link href={`/dashboard/admin/parcels/${linkedParcel.id}`} className="font-mono text-sm text-brand hover:underline">{linkedParcel.publicCode}</Link>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h2 className="font-semibold text-ink mb-3">Статус өөрчлөх</h2>
            <form action={updateStatus} className="space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <select name="status" defaultValue={order.status} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
                {LINK_ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <button type="submit" className="w-full px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хадгалах</button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h2 className="font-semibold text-ink mb-3">Трак код тохируулах</h2>
            <form action={updateTrackCode} className="space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <input type="text" name="trackCode" defaultValue={order.sellerTrackCodeOriginal ?? ""} placeholder="Трак код…" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
              <button type="submit" className="w-full px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хадгалах</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
