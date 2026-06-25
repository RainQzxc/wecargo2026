import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";

async function handleCreate(formData: FormData): Promise<void> {
  "use server";
  await requirePermission("batches.create");

  const originWarehouseId = (formData.get("originWarehouseId") as string)?.trim();
  if (!originWarehouseId) redirect("/dashboard/admin/batches/new?error=" + encodeURIComponent("Гарал агуулах шаардлагатай"));

  const batchNoRaw = (formData.get("batchNo") as string)?.trim();

  const batch = await db.shipmentBatch.create({
    data: {
      batchNo:            batchNoRaw || `B-${Date.now()}`,
      originWarehouseId,
      driverName:  (formData.get("driverName") as string)?.trim() || null,
      driverPhone: (formData.get("driverPhone") as string)?.trim() || null,
      vehiclePlate:(formData.get("vehiclePlate") as string)?.trim() || null,
      notes:       (formData.get("notes") as string)?.trim() || null,
      status: "DRAFT",
    },
  });
  redirect(`/dashboard/admin/batches/${batch.id}`);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("batches.create");

  const { error } = await searchParams;
  const warehouses = await db.warehouse.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/batches" className="text-sm text-brand hover:underline">← Буцах</Link>
        <h1 className="text-2xl font-bold text-ink">Шинэ ачааны бүлэг</h1>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form action={handleCreate} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="batchNo" className="text-sm font-medium text-ink">Бүлгийн дугаар</label>
          <input id="batchNo" type="text" name="batchNo" placeholder="Хоосон орхивол автоматаар үүснэ"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="originWarehouseId" className="text-sm font-medium text-ink">
            Гарал агуулах <span className="text-red-500">*</span>
          </label>
          <select id="originWarehouseId" name="originWarehouseId" required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
            <option value="">-- Агуулах сонгоно уу --</option>
            {warehouses.map((wh) => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
          </select>
        </div>

        {[
          { id:"driverName",   label:"Жолоочийн нэр",  placeholder:"Жолоочийн нэр оруулна уу" },
          { id:"driverPhone",  label:"Жолоочийн утас",  placeholder:"Утасны дугаар оруулна уу" },
          { id:"vehiclePlate", label:"Машины хавтан",   placeholder:"Улсын дугаар оруулна уу" },
        ].map(({ id, label, placeholder }) => (
          <div key={id} className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>
            <input id={id} type="text" name={id} placeholder={placeholder}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium text-ink">Тэмдэглэл</label>
          <textarea id="notes" name="notes" rows={3} placeholder="Тэмдэглэл оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
            Бүлэг үүсгэх
          </button>
        </div>
      </form>
    </div>
  );
}
