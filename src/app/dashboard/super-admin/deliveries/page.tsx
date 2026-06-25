import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";

const PAGE_SIZE = 25;

const DELIVERY_STATUSES = [
  "REQUESTED",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "RETURNED",
  "CANCELLED",
] as const;

const DELIVERY_STATUS_LABELS_MN: Record<string, string> = {
  REQUESTED:        "Хүсэлт",
  ASSIGNED:         "Томилсон",
  OUT_FOR_DELIVERY: "Явж байна",
  DELIVERED:        "Хүргэгдсэн",
  FAILED:           "Амжилтгүй",
  RETURNED:         "Буцаасан",
  CANCELLED:        "Цуцлагдсан",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  await requirePermission("deliveries.read");

  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(q
      ? {
          OR: [
            { recipientName: { contains: q, mode: "insensitive" as const } },
            { recipientPhone: { contains: q, mode: "insensitive" as const } },
            { addressDetail: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    db.deliveryRequest.findMany({
      where,
      select: {
        id: true,
        recipientName: true,
        recipientPhone: true,
        district: true,
        city: true,
        addressDetail: true,
        status: true,
        deliveryFeeAmount: true,
        createdAt: true,
        parcel: { select: { publicCode: true, status: true } },
        customer: { select: { name: true } },
        courier: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.deliveryRequest.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasFilters = !!(q || status);

  function buildPageHref(p: number): string {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    params.set("page", String(p));
    return `/dashboard/super-admin/deliveries?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Хүргэлтүүд</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт{" "}
            <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span>{" "}
            хүргэлт
          </p>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────── */}
      <form method="GET" className="flex flex-col sm:flex-row gap-2 flex-wrap">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Нэр, утас эсвэл хаягаар хайх…"
          className="flex-1 min-w-[200px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />

        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand min-w-[190px]"
        >
          <option value="">Бүх статус</option>
          {DELIVERY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {DELIVERY_STATUS_LABELS_MN[s]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
        >
          Хайх
        </button>

        {hasFilters && (
          <Link
            href="/dashboard/super-admin/deliveries"
            className="shrink-0 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-ink-3 hover:text-ink transition-colors text-center"
          >
            Цэвэрлэх
          </Link>
        )}
      </form>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <svg
              className="size-10 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm text-ink-3">
              {hasFilters
                ? "Хайлтын нөхцөлд тохирох хүргэлт олдсонгүй"
                : "Одоогоор хүргэлт бүртгэгдээгүй байна"}
            </p>
            {hasFilters && (
              <Link
                href="/dashboard/super-admin/deliveries"
                className="text-sm text-brand hover:underline"
              >
                Шүүлтүүр цэвэрлэх
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Хүлээн авагч
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Утас
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Хаяг
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Хүргэгч
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-ink-3 whitespace-nowrap">
                    Үнэ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Огноо
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((delivery) => {
                  const addressParts = [delivery.district, delivery.city].filter(Boolean);
                  const addressLine = addressParts.length > 0 ? addressParts.join(", ") : null;

                  return (
                    <tr
                      key={delivery.id}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      {/* Хүлээн авагч */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/super-admin/deliveries/${delivery.id}`}
                          className="font-medium text-ink hover:text-brand transition-colors"
                        >
                          {delivery.recipientName ?? (
                            <span className="text-ink-3 font-normal">—</span>
                          )}
                        </Link>
                      </td>

                      {/* Утас */}
                      <td className="px-4 py-3 text-ink-2 whitespace-nowrap">
                        {delivery.recipientPhone ?? <span className="text-ink-3">—</span>}
                      </td>

                      {/* Хаяг */}
                      <td className="px-4 py-3 max-w-[200px]">
                        {addressLine ? (
                          <span className="text-ink-2 text-xs">{addressLine}</span>
                        ) : (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>

                      {/* Хүргэгч */}
                      <td className="px-4 py-3 whitespace-nowrap text-ink-2 text-xs">
                        {delivery.courier?.name ?? (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>

                      {/* Статус */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <DeliveryStatusBadge status={delivery.status} />
                      </td>

                      {/* Үнэ */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {delivery.deliveryFeeAmount != null ? (
                          <span className="font-semibold text-ink">
                            {Number(delivery.deliveryFeeAmount).toLocaleString("mn-MN")}
                            <span className="text-ink-3 font-normal text-xs ml-1">₮</span>
                          </span>
                        ) : (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>

                      {/* Огноо */}
                      <td className="px-4 py-3 text-ink-3 whitespace-nowrap text-xs">
                        {new Date(delivery.createdAt).toLocaleDateString("mn-MN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-ink-3">
            {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} /{" "}
            {total.toLocaleString("mn-MN")} хүргэлт
          </span>

          <div className="flex items-center gap-1">
            {page > 1 && (
              <Link
                href={buildPageHref(page - 1)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-ink hover:bg-neutral-50 transition-colors"
              >
                ← Өмнөх
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
              )
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                  acc.push("…");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "…" ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-ink-3 select-none">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={buildPageHref(p as number)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      p === page
                        ? "border-brand bg-brand text-white"
                        : "border-neutral-200 bg-white text-ink hover:bg-neutral-50"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

            {page < totalPages && (
              <Link
                href={buildPageHref(page + 1)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-ink hover:bg-neutral-50 transition-colors"
              >
                Дараах →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
