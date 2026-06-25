import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createBatch } from "../actions";

async function handleCreate(formData: FormData): Promise<void> {
  "use server";
  const result = await createBatch(formData);
  if (result?.error) {
    redirect(`/dashboard/super-admin/batches/new?error=${encodeURIComponent(result.error)}`);
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("batches.create");

  const { error } = await searchParams;

  const warehouses = await db.warehouse.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/super-admin/batches"
          className="text-sm text-brand hover:underline"
        >
          ← Буцах
        </Link>
        <h1 className="text-2xl font-bold text-ink">Шинэ ачааны бүлэг</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        action={handleCreate}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Бүлгийн дугаар */}
        <div className="flex flex-col gap-1">
          <label htmlFor="batchNo" className="text-sm font-medium text-ink">
            Бүлгийн дугаар
          </label>
          <input
            id="batchNo"
            type="text"
            name="batchNo"
            placeholder="Хоосон орхивол автоматаар үүснэ"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Гарал агуулах */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="originWarehouseId"
            className="text-sm font-medium text-ink"
          >
            Гарал агуулах <span className="text-red-500">*</span>
          </label>
          <select
            id="originWarehouseId"
            name="originWarehouseId"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">-- Агуулах сонгоно уу --</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>

        {/* Жолоочийн нэр */}
        <div className="flex flex-col gap-1">
          <label htmlFor="driverName" className="text-sm font-medium text-ink">
            Жолоочийн нэр
          </label>
          <input
            id="driverName"
            type="text"
            name="driverName"
            placeholder="Жолоочийн нэр оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Жолоочийн утас */}
        <div className="flex flex-col gap-1">
          <label htmlFor="driverPhone" className="text-sm font-medium text-ink">
            Жолоочийн утас
          </label>
          <input
            id="driverPhone"
            type="text"
            name="driverPhone"
            placeholder="Утасны дугаар оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Машины хавтан */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="vehiclePlate"
            className="text-sm font-medium text-ink"
          >
            Машины хавтан
          </label>
          <input
            id="vehiclePlate"
            type="text"
            name="vehiclePlate"
            placeholder="Улсын дугаар оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Тэмдэглэл */}
        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium text-ink">
            Тэмдэглэл
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Тэмдэглэл оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Бүлэг үүсгэх
          </button>
        </div>
      </form>
    </div>
  );
}
