import { requirePermission } from "@/features/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createTariff } from "../actions";

async function handleCreate(formData: FormData): Promise<void> {
  "use server";
  const result = await createTariff(formData);
  if (result?.error) {
    redirect(`/dashboard/super-admin/tariffs/new?error=${encodeURIComponent(result.error)}`);
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("tariffs.create");

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/super-admin/tariffs"
          className="text-sm text-brand hover:underline"
        >
          ← Буцах
        </Link>
        <h1 className="text-2xl font-bold text-ink">Шинэ тариф үүсгэх</h1>
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
        {/* Нэр */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Нэр <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            placeholder="Тарифын нэр оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Тайлбар */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-ink">
            Тайлбар
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Тайлбар оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Маршрутын код */}
        <div className="flex flex-col gap-1">
          <label htmlFor="routeCode" className="text-sm font-medium text-ink">
            Маршрутын код
          </label>
          <input
            id="routeCode"
            type="text"
            name="routeCode"
            placeholder="Жишээ: EREEN-UB"
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

        {/* Ачааллын зэрэглэл */}
        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="text-sm font-medium text-ink">
            Ачааллын зэрэглэл
          </label>
          <select
            id="priority"
            name="priority"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">-- Сонгоно уу --</option>
            <option value="REGULAR">Энгийн (REGULAR)</option>
            <option value="URGENT">Яаралтай (URGENT)</option>
          </select>
        </div>

        {/* Нэгж */}
        <div className="flex flex-col gap-1">
          <label htmlFor="unit" className="text-sm font-medium text-ink">
            Нэгж <span className="text-red-500">*</span>
          </label>
          <select
            id="unit"
            name="unit"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">-- Нэгж сонгоно уу --</option>
            <option value="kg">кг (kg)</option>
            <option value="ton">тонн (ton)</option>
            <option value="m3">шоо метр (m3)</option>
            <option value="piece">ширхэг (piece)</option>
            <option value="set">багц (set)</option>
          </select>
        </div>

        {/* Үнэ */}
        <div className="flex flex-col gap-1">
          <label htmlFor="priceAmount" className="text-sm font-medium text-ink">
            Үнэ <span className="text-red-500">*</span>
          </label>
          <input
            id="priceAmount"
            type="number"
            name="priceAmount"
            required
            min={0}
            step="0.01"
            placeholder="0.00"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Валют */}
        <div className="flex flex-col gap-1">
          <label htmlFor="currency" className="text-sm font-medium text-ink">
            Валют
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue="CNY"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="CNY">CNY (Юань)</option>
            <option value="MNT">MNT (Төгрөг)</option>
            <option value="USD">USD (Доллар)</option>
          </select>
        </div>

        {/* Хамгийн бага үнэ */}
        <div className="flex flex-col gap-1">
          <label htmlFor="minFeeAmount" className="text-sm font-medium text-ink">
            Хамгийн бага үнэ
          </label>
          <input
            id="minFeeAmount"
            type="number"
            name="minFeeAmount"
            min={0}
            step="0.01"
            placeholder="0.00"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Эхлэх огноо */}
        <div className="flex flex-col gap-1">
          <label htmlFor="effectiveFrom" className="text-sm font-medium text-ink">
            Эхлэх огноо
          </label>
          <input
            id="effectiveFrom"
            type="date"
            name="effectiveFrom"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Дуусах огноо */}
        <div className="flex flex-col gap-1">
          <label htmlFor="effectiveTo" className="text-sm font-medium text-ink">
            Дуусах огноо
          </label>
          <input
            id="effectiveTo"
            type="date"
            name="effectiveTo"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Идэвхтэй */}
        <div className="flex items-center gap-3">
          <input
            id="isActive"
            type="checkbox"
            name="isActive"
            defaultChecked
            className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-ink">
            Идэвхтэй
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Тариф үүсгэх
          </button>
        </div>
      </form>
    </div>
  );
}
