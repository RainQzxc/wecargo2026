import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { toggleBanner, deleteBanner } from "./actions";
import type { BannerPlacement } from "@prisma/client";

const PLACEMENT_LABELS: Record<string, string> = {
  HOME_HERO:     "Нүүр — баатар",
  HOME_SECTION:  "Нүүр — секц",
  ALERT:         "Мэдэгдэл",
  PRICING:       "Үнийн мэдээлэл",
  COOPERATION:   "Хамтын ажиллагаа",
};

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("mn-MN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ placement?: string }>;
}) {
  await requirePermission("content.read");

  const { placement } = await searchParams;
  const validPlacements = Object.keys(PLACEMENT_LABELS) as BannerPlacement[];
  const placementFilter = validPlacements.includes(placement as BannerPlacement) ? placement as BannerPlacement : undefined;
  const where = placementFilter ? { placement: placementFilter } : {};

  const banners = await db.banner.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const placements = Object.keys(PLACEMENT_LABELS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Баннерууд</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт <span className="font-semibold text-ink">{banners.length.toLocaleString("mn-MN")}</span> баннер
          </p>
        </div>
        <Link
          href="/dashboard/super-admin/banners/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Шинэ баннер
        </Link>
      </div>

      {/* Placement filter */}
      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/dashboard/super-admin/banners"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!placement ? "bg-brand text-white" : "bg-white border border-neutral-200 text-ink-3 hover:text-ink"}`}
        >
          Бүгд
        </Link>
        {placements.map((p) => (
          <Link
            key={p}
            href={`/dashboard/super-admin/banners?placement=${p}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${placement === p ? "bg-brand text-white" : "bg-white border border-neutral-200 text-ink-3 hover:text-ink"}`}
          >
            {PLACEMENT_LABELS[p] ?? p}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <svg className="size-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-ink-3">
              {placement
                ? `"${PLACEMENT_LABELS[placement] ?? placement}" байршилд баннер олдсонгүй`
                : "Одоогоор баннер бүртгэгдээгүй байна"}
            </p>
            {placement && (
              <Link href="/dashboard/super-admin/banners" className="text-sm text-brand hover:underline">
                Бүх баннерийг харах
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Гарчиг</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Байршил</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Дараалал</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Огноо</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Статус</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="font-medium text-ink truncate">{banner.title}</p>
                      {banner.subtitle && <p className="text-xs text-ink-3 truncate mt-0.5">{banner.subtitle}</p>}
                      {banner.href && <p className="text-xs text-brand truncate mt-0.5 font-mono">{banner.href}</p>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">
                        {PLACEMENT_LABELS[banner.placement] ?? banner.placement}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-3">{banner.sortOrder ?? 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ink-3">
                      {banner.startsAt || banner.endsAt
                        ? <>{formatDate(banner.startsAt)} – {formatDate(banner.endsAt)}</>
                        : "Хязгааргүй"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <form action={async () => { "use server"; await toggleBanner(banner.id, !banner.isActive); }}>
                        <button type="submit" className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${banner.isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-neutral-100 text-ink-3 hover:bg-neutral-200"}`}>
                          <span className={`size-1.5 rounded-full shrink-0 ${banner.isActive ? "bg-green-500" : "bg-neutral-400"}`} />
                          {banner.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <form action={async () => { "use server"; await deleteBanner(banner.id); }}>
                        <button type="submit" title="Устгахдаа итгэлтэй байна уу?" className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline transition-colors">
                          Устгах
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
