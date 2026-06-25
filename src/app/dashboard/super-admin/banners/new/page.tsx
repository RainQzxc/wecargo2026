import { requirePermission } from "@/features/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createBanner } from "../actions";

async function handleCreate(formData: FormData): Promise<void> {
  "use server";
  const result = await createBanner(formData);
  if (result?.error) {
    redirect(`/dashboard/super-admin/banners/new?error=${encodeURIComponent(result.error)}`);
  }
}

const PLACEMENT_LABELS: Record<string, string> = {
  HOME_HERO: "Нүүр хуудас — баатар хэсэг",
  HOME_SECTION: "Нүүр хуудас — секц",
  ALERT: "Мэдэгдэл",
  PRICING: "Үнийн мэдээлэл",
  COOPERATION: "Хамтын ажиллагаа",
};

const PLACEMENT_VALUES = [
  "HOME_HERO",
  "HOME_SECTION",
  "ALERT",
  "PRICING",
  "COOPERATION",
] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("content.create");

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/super-admin/banners"
          className="text-sm text-brand hover:underline"
        >
          ← Буцах
        </Link>
        <h1 className="text-2xl font-bold text-ink">Шинэ баннер</h1>
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
        {/* Байршил */}
        <div className="flex flex-col gap-1">
          <label htmlFor="placement" className="text-sm font-medium text-ink">
            Байршил <span className="text-red-500">*</span>
          </label>
          <select
            id="placement"
            name="placement"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">-- Байршил сонгоно уу --</option>
            {PLACEMENT_VALUES.map((val) => (
              <option key={val} value={val}>
                {PLACEMENT_LABELS[val]}
              </option>
            ))}
          </select>
        </div>

        {/* Гарчиг */}
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-ink">
            Гарчиг <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            required
            placeholder="Баннерийн гарчиг оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Дэд гарчиг */}
        <div className="flex flex-col gap-1">
          <label htmlFor="subtitle" className="text-sm font-medium text-ink">
            Дэд гарчиг
          </label>
          <input
            id="subtitle"
            type="text"
            name="subtitle"
            placeholder="Дэд гарчиг оруулна уу"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Зургийн URL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="imageUrl" className="text-sm font-medium text-ink">
            Зургийн URL
          </label>
          <input
            id="imageUrl"
            type="url"
            name="imageUrl"
            placeholder="https://..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Холбоос */}
        <div className="flex flex-col gap-1">
          <label htmlFor="href" className="text-sm font-medium text-ink">
            Холбоос
          </label>
          <input
            id="href"
            type="text"
            name="href"
            placeholder="/page эсвэл https://..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* CTA товч */}
        <div className="flex flex-col gap-1">
          <label htmlFor="ctaLabel" className="text-sm font-medium text-ink">
            CTA товч
          </label>
          <input
            id="ctaLabel"
            type="text"
            name="ctaLabel"
            placeholder="Жишээ: Дэлгэрэнгүй үзэх"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Дараалал */}
        <div className="flex flex-col gap-1">
          <label htmlFor="sortOrder" className="text-sm font-medium text-ink">
            Дараалал
          </label>
          <input
            id="sortOrder"
            type="number"
            name="sortOrder"
            defaultValue={0}
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

        {/* Огнооны хэсэг */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Эхлэх огноо */}
          <div className="flex flex-col gap-1">
            <label htmlFor="startsAt" className="text-sm font-medium text-ink">
              Эхлэх огноо
            </label>
            <input
              id="startsAt"
              type="datetime-local"
              name="startsAt"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Дуусах огноо */}
          <div className="flex flex-col gap-1">
            <label htmlFor="endsAt" className="text-sm font-medium text-ink">
              Дуусах огноо
            </label>
            <input
              id="endsAt"
              type="datetime-local"
              name="endsAt"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Баннер үүсгэх
          </button>
        </div>
      </form>
    </div>
  );
}
