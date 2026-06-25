import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createParcel } from "../actions";

async function handleCreate(formData: FormData): Promise<void> {
  "use server";
  const result = await createParcel(formData);
  if (result?.error) {
    redirect(`/dashboard/super-admin/parcels/new?error=${encodeURIComponent(result.error)}`);
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("parcels.create");

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
          href="/dashboard/super-admin/parcels"
          className="text-sm text-brand hover:underline"
        >
          ← Буцах
        </Link>
        <h1 className="text-2xl font-bold text-ink">Шинэ бараа бүртгэх</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form action={handleCreate} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Трак код */}
        <div className="flex flex-col gap-1">
          <label htmlFor="trackCode" className="text-sm font-medium text-ink">
            Трак код <span className="text-red-500">*</span>
          </label>
          <input
            id="trackCode"
            type="text"
            name="trackCode"
            required
            placeholder="Трак код оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Хэрэглэгчийн нэр */}
        <div className="flex flex-col gap-1">
          <label htmlFor="customerName" className="text-sm font-medium text-ink">
            Хэрэглэгчийн нэр
          </label>
          <input
            id="customerName"
            type="text"
            name="customerName"
            placeholder="Нэр оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Хэрэглэгчийн утас */}
        <div className="flex flex-col gap-1">
          <label htmlFor="customerPhone" className="text-sm font-medium text-ink">
            Хэрэглэгчийн утас
          </label>
          <input
            id="customerPhone"
            type="text"
            name="customerPhone"
            placeholder="Утасны дугаар оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Ачааны төрөл */}
        <div className="flex flex-col gap-1">
          <label htmlFor="cargoType" className="text-sm font-medium text-ink">
            Ачааны төрөл
          </label>
          <input
            id="cargoType"
            type="text"
            name="cargoType"
            placeholder="Ачааны төрөл оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Тоо ширхэг */}
        <div className="flex flex-col gap-1">
          <label htmlFor="quantity" className="text-sm font-medium text-ink">
            Тоо ширхэг
          </label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            defaultValue={1}
            min={1}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Жин */}
        <div className="flex flex-col gap-1">
          <label htmlFor="weightKg" className="text-sm font-medium text-ink">
            Жин (кг)
          </label>
          <input
            id="weightKg"
            type="number"
            name="weightKg"
            step="0.001"
            min={0}
            placeholder="0.000"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Хэмжээ: Урт, өргөн, өндөр */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink">Хэмжээ (см)</span>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="lengthCm" className="text-xs text-gray-500">
                Урт
              </label>
              <input
                id="lengthCm"
                type="number"
                name="lengthCm"
                step="0.1"
                min={0}
                placeholder="0"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="widthCm" className="text-xs text-gray-500">
                Өргөн
              </label>
              <input
                id="widthCm"
                type="number"
                name="widthCm"
                step="0.1"
                min={0}
                placeholder="0"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="heightCm" className="text-xs text-gray-500">
                Өндөр
              </label>
              <input
                id="heightCm"
                type="number"
                name="heightCm"
                step="0.1"
                min={0}
                placeholder="0"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Агуулах */}
        <div className="flex flex-col gap-1">
          <label htmlFor="warehouseId" className="text-sm font-medium text-ink">
            Агуулах
          </label>
          <select
            id="warehouseId"
            name="warehouseId"
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
            Бүртгэх
          </button>
        </div>
      </form>
    </div>
  );
}
