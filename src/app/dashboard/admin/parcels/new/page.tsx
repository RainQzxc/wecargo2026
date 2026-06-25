import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";

async function handleCreate(formData: FormData): Promise<void> {
  "use server";
  await requirePermission("parcels.create");

  const trackCode = (formData.get("trackCode") as string)?.trim().toUpperCase();
  if (!trackCode) redirect("/dashboard/admin/parcels/new?error=" + encodeURIComponent("Трак код шаардлагатай"));

  const existing = await db.parcel.findFirst({ where: { trackCodeOriginal: trackCode } });
  if (existing) redirect("/dashboard/admin/parcels/new?error=" + encodeURIComponent("Энэ трак код бүртгэлтэй байна"));

  const weightRaw = formData.get("weightKg") as string | null;
  const quantity  = parseInt(formData.get("quantity") as string || "1", 10) || 1;

  const parcel = await db.parcel.create({
    data: {
      trackCodeOriginal: trackCode,
      customerName:      (formData.get("customerName") as string)?.trim() || null,
      customerPhone:     (formData.get("customerPhone") as string)?.trim() || null,
      cargoType:         (formData.get("cargoType") as string)?.trim() || null,
      quantity,
      weightKg:  weightRaw ? parseFloat(weightRaw) : null,
      lengthCm:  formData.get("lengthCm") ? parseFloat(formData.get("lengthCm") as string) : null,
      widthCm:   formData.get("widthCm")  ? parseFloat(formData.get("widthCm") as string)  : null,
      heightCm:  formData.get("heightCm") ? parseFloat(formData.get("heightCm") as string) : null,
      notes:             (formData.get("notes") as string)?.trim() || null,
      currentWarehouseId:(formData.get("warehouseId") as string) || null,
    },
  });
  redirect(`/dashboard/admin/parcels/${parcel.id}`);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("parcels.create");

  const { error } = await searchParams;
  const warehouses = await db.warehouse.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/parcels" className="text-sm text-brand hover:underline">← Буцах</Link>
        <h1 className="text-2xl font-bold text-ink">Шинэ бараа бүртгэх</h1>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form action={handleCreate} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {[
          { id:"trackCode",    label:"Трак код",          required:true,  placeholder:"Трак код оруулна уу" },
          { id:"customerName", label:"Хэрэглэгчийн нэр",  required:false, placeholder:"Нэр оруулна уу" },
          { id:"customerPhone",label:"Хэрэглэгчийн утас", required:false, placeholder:"Утасны дугаар оруулна уу" },
          { id:"cargoType",    label:"Ачааны төрөл",      required:false, placeholder:"Ачааны төрөл оруулна уу" },
        ].map(({ id, label, required, placeholder }) => (
          <div key={id} className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-ink">
              {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input id={id} type="text" name={id} required={required} placeholder={placeholder}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label htmlFor="quantity" className="text-sm font-medium text-ink">Тоо ширхэг</label>
          <input id="quantity" type="number" name="quantity" defaultValue={1} min={1}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="weightKg" className="text-sm font-medium text-ink">Жин (кг)</label>
          <input id="weightKg" type="number" name="weightKg" step="0.001" min={0} placeholder="0.000"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink">Хэмжээ (см)</span>
          <div className="grid grid-cols-3 gap-3">
            {[["lengthCm","Урт"],["widthCm","Өргөн"],["heightCm","Өндөр"]].map(([name, lbl]) => (
              <div key={name} className="flex flex-col gap-1">
                <label htmlFor={name} className="text-xs text-gray-500">{lbl}</label>
                <input id={name} type="number" name={name} step="0.1" min={0} placeholder="0"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="warehouseId" className="text-sm font-medium text-ink">Агуулах</label>
          <select id="warehouseId" name="warehouseId"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
            <option value="">-- Агуулах сонгоно уу --</option>
            {warehouses.map((wh) => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium text-ink">Тэмдэглэл</label>
          <textarea id="notes" name="notes" rows={3} placeholder="Тэмдэглэл оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
            Бүртгэх
          </button>
        </div>
      </form>
    </div>
  );
}
