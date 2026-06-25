import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { revalidatePath } from "next/cache";

const BATCH_STATUSES: { value: string; label: string }[] = [
  { value:"DRAFT",                label:"Ноорог" },
  { value:"LOADING",              label:"Ачаалж байна" },
  { value:"LOADED",               label:"Ачаалсан" },
  { value:"DEPARTED",             label:"Гарсан" },
  { value:"ARRIVED_ULAANBAATAR",  label:"УБ-д ирсэн" },
  { value:"CLOSED",               label:"Хаасан" },
  { value:"CANCELLED",            label:"Цуцлагдсан" },
];

const BATCH_STATUS_CLASSES: Record<string, string> = {
  DRAFT:"bg-neutral-100 text-ink-3", LOADING:"bg-amber-50 text-amber-700",
  LOADED:"bg-amber-50 text-amber-700", DEPARTED:"bg-blue-50 text-blue-700",
  ARRIVED_ULAANBAATAR:"bg-brand/10 text-brand", CLOSED:"bg-green-50 text-green-700",
  CANCELLED:"bg-red-50 text-red-700",
};

function BatchStatusBadge({ status }: { status: string }) {
  const label = BATCH_STATUSES.find((s) => s.value === status)?.label ?? status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${BATCH_STATUS_CLASSES[status] ?? "bg-neutral-100 text-ink-3"}`}>
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-3 border-b border-neutral-100 last:border-0">
      <dt className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest sm:w-44 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-ink font-medium break-all">{value ?? "—"}</dd>
    </div>
  );
}

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-neutral-200 overflow-hidden ${className ?? ""}`}>
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("batches.read");
  const { id } = await params;

  const batch = await db.shipmentBatch.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          parcel: {
            select: { id:true, publicCode:true, trackCodeOriginal:true, customerName:true, status:true, weightKg:true },
          },
        },
      },
      originWarehouse: true,
      destinationWarehouse: true,
      createdBy: { select: { id:true, name:true } },
    },
  });

  if (!batch) notFound();

  const batchItemsCount = batch.items.length;
  const totalWeight = batch.items.reduce((sum, item) => {
    const w = item.parcel?.weightKg;
    return sum + (w != null ? Number(w) : 0);
  }, 0);

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    await requirePermission("batches.updateStatus");
    const status = formData.get("status") as string;
    if (!status) return;
    const dateMap: Record<string, Record<string, Date>> = {
      LOADED:               { loadedAt:   new Date() },
      DEPARTED:             { departedAt: new Date() },
      ARRIVED_ULAANBAATAR:  { arrivedAt:  new Date() },
      CLOSED:               { closedAt:   new Date() },
    };
    await db.shipmentBatch.update({ where: { id }, data: { status: status as import("@prisma/client").BatchStatus, ...dateMap[status] } });
    revalidatePath(`/dashboard/admin/batches/${id}`);
    revalidatePath("/dashboard/admin/batches");
  }

  async function handleAddParcel(formData: FormData) {
    "use server";
    await requirePermission("batches.update");
    const publicCode = String(formData.get("publicCode") ?? "").trim().toUpperCase();
    if (!publicCode) return;
    const parcel = await db.parcel.findFirst({ where: { publicCode } });
    if (!parcel) return;
    const exists = await db.shipmentBatchItem.findFirst({ where: { batchId: id, parcelId: parcel.id } });
    if (exists) return;
    await db.shipmentBatchItem.create({ data: { batchId: id, parcelId: parcel.id } });
    revalidatePath(`/dashboard/admin/batches/${id}`);
  }

  async function handleRemoveParcel(formData: FormData) {
    "use server";
    await requirePermission("batches.update");
    const parcelId = formData.get("parcelId") as string;
    if (!parcelId) return;
    await db.shipmentBatchItem.deleteMany({ where: { batchId: id, parcelId } });
    revalidatePath(`/dashboard/admin/batches/${id}`);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard/admin/batches" className="text-[13px] text-ink-3 hover:text-brand transition-colors">Бүлгүүд</Link>
            <span className="text-ink-3 text-[13px]">/</span>
            <span className="text-[13px] text-ink font-mono truncate">{batch.batchNo}</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-black text-ink">Бүлэг #{batch.batchNo}</h1>
            <BatchStatusBadge status={batch.status} />
          </div>
        </div>
        <Link href="/dashboard/admin/batches" className="text-sm text-ink-3 hover:text-brand transition-colors whitespace-nowrap">&larr; Буцах</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Нийт илгээмж" value={batchItemsCount} color="brand" />
        <StatCard label="Нийт жин" value={totalWeight > 0 ? `${totalWeight.toFixed(2)} кг` : "—"} color="default" />
        <StatCard label="Гарах агуулах" value={batch.originWarehouse?.name ?? "—"} color="default" />
        <StatCard label="Очих агуулах" value={batch.destinationWarehouse?.name ?? "—"} color="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Бүлгийн мэдээлэл">
          <dl>
            <InfoRow label="Гарах агуулах"            value={batch.originWarehouse?.name ?? null} />
            <InfoRow label="Очих агуулах"             value={batch.destinationWarehouse?.name ?? null} />
            <InfoRow label="Тээврийн хэрэгслийн дугаар" value={batch.vehiclePlate ?? null} />
            <InfoRow label="Жолоочийн нэр"            value={batch.driverName ?? null} />
            <InfoRow label="Жолоочийн утас"           value={batch.driverPhone ?? null} />
            <InfoRow label="Бүртгэсэн"                value={batch.createdBy?.name ?? null} />
          </dl>
        </SectionCard>

        <SectionCard title="Огноо / Тэмдэглэл">
          <dl>
            <InfoRow label="Ачааласан огноо" value={batch.loadedAt   ? new Date(batch.loadedAt).toLocaleString("mn-MN")   : null} />
            <InfoRow label="Гарсан огноо"    value={batch.departedAt ? new Date(batch.departedAt).toLocaleString("mn-MN") : null} />
            <InfoRow label="Ирсэн огноо"     value={batch.arrivedAt  ? new Date(batch.arrivedAt).toLocaleString("mn-MN")  : null} />
            <InfoRow label="Хаасан огноо"    value={batch.closedAt   ? new Date(batch.closedAt).toLocaleString("mn-MN")   : null} />
            <InfoRow label="Тэмдэглэл"       value={batch.notes ?? null} />
          </dl>
        </SectionCard>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-[13px] font-semibold text-ink">Статус өөрчлөх</h2>
        </div>
        <div className="p-5">
          <form action={handleUpdateStatus} className="flex items-center gap-3 flex-wrap">
            <select name="status" defaultValue={batch.status} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
              {BATCH_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хадгалах</button>
            <span className="text-xs text-ink-3">Одоогийн: <BatchStatusBadge status={batch.status} /></span>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-[13px] font-semibold text-ink">Илгээмж нэмэх</h2>
        </div>
        <div className="p-5">
          <form action={handleAddParcel} className="flex items-center gap-3 flex-wrap">
            <input name="publicCode" type="text" placeholder="Нийтийн код оруулна уу"
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand w-64" />
            <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Нэмэх</button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-ink">Илгээмжүүд ({batchItemsCount})</h2>
        </div>
        {batchItemsCount === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-ink-3">Энэ бүлэгт илгээмж байхгүй байна.</p>
            <p className="text-xs text-ink-3 mt-1">Дээрх маягтаар нийтийн код ашиглан илгээмж нэмнэ үү.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  {["Код","Трак код","Хэрэглэгч","Статус","Үйлдэл"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batch.items.map((item) => {
                  const p = item.parcel;
                  return (
                    <tr key={item.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                      <td className="px-5 py-3">
                        {p ? (
                          <Link href={`/dashboard/admin/parcels/${p.id}`} className="font-mono text-brand hover:underline text-xs">{p.publicCode}</Link>
                        ) : <span className="text-ink-3 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-ink-3">{p?.trackCodeOriginal ?? "—"}</td>
                      <td className="px-5 py-3 text-sm text-ink">{p?.customerName ?? "—"}</td>
                      <td className="px-5 py-3">{p ? <StatusBadge status={p.status} /> : <span className="text-ink-3 text-xs">—</span>}</td>
                      <td className="px-5 py-3">
                        {p && (
                          <form action={handleRemoveParcel}>
                            <input type="hidden" name="parcelId" value={p.id} />
                            <button type="submit" className="px-3 py-1 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">Хасах</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
