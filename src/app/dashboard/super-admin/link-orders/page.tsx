import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const PAGE_SIZE = 25;

const LINK_ORDER_STATUS_LABELS: Record<string, string> = {
  REQUESTED:          "Хүсэлт",
  REVIEWING:          "Хянаж байна",
  PAYMENT_PENDING:    "Төлбөр хүлээгдэж",
  ORDERED:            "Захиалсан",
  SELLER_SHIPPED:     "Илгээсэн",
  TRACK_CODE_ADDED:   "Код нэмсэн",
  RECEIVED_AT_EREEN:  "Эрээнд хүлээн авсан",
  LINKED_TO_PARCEL:   "Барааны холбогдсон",
  CANCELLED:          "Цуцлагдсан",
  ISSUE:              "Асуудал",
};

type BadgeVariant = "gray" | "blue" | "yellow" | "brand" | "green" | "red" | "purple";

const LINK_ORDER_STATUS_VARIANT: Record<string, BadgeVariant> = {
  REQUESTED:         "gray",
  REVIEWING:         "yellow",
  PAYMENT_PENDING:   "yellow",
  ORDERED:           "blue",
  SELLER_SHIPPED:    "blue",
  TRACK_CODE_ADDED:  "purple",
  RECEIVED_AT_EREEN: "brand",
  LINKED_TO_PARCEL:  "green",
  CANCELLED:         "red",
  ISSUE:             "red",
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  gray:   "bg-neutral-100 text-ink-3",
  blue:   "bg-blue-50 text-blue-700",
  yellow: "bg-amber-50 text-amber-700",
  brand:  "bg-brand/10 text-brand",
  green:  "bg-green-50 text-green-700",
  red:    "bg-red-50 text-red-700",
  purple: "bg-purple-50 text-purple-700",
};

function LinkOrderStatusBadge({ status }: { status: string }) {
  const variant = LINK_ORDER_STATUS_VARIANT[status] ?? "gray";
  const label = LINK_ORDER_STATUS_LABELS[status] ?? status;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${VARIANT_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requirePermission("linkOrders.read");

  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(q
      ? {
          OR: [
            { customerName: { contains: q, mode: "insensitive" as const } },
            { customerPhone: { contains: q, mode: "insensitive" as const } },
            { storeOrderNo: { contains: q, mode: "insensitive" as const } },
            { sellerTrackCodeOriginal: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status ? { status: status as never } : {}),
  };

  const [items, total] = await Promise.all([
    db.linkOrder.findMany({
      where,
      select: {
        id: true,
        customerName: true,
        customerPhone: true,
        productUrl: true,
        quantity: true,
        status: true,
        totalAmount: true,
        currency: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.linkOrder.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasFilters = !!(q || status);

  function buildPageHref(p: number): string {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    params.set("page", String(p));
    return `/dashboard/super-admin/link-orders?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Линк Захиалгууд</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт{" "}
            <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span>{" "}
            захиалга
          </p>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────── */}
      <form method="GET" className="flex flex-col sm:flex-row gap-2 flex-wrap">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Нэр, утас, захиалгын дугаар эсвэл трак кодоор хайх…"
          className="flex-1 min-w-[220px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />

        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand min-w-[200px]"
        >
          <option value="">Бүх статус</option>
          {Object.entries(LINK_ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
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
            href="/dashboard/super-admin/link-orders"
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <p className="text-sm text-ink-3">
              {hasFilters
                ? "Хайлтын нөхцөлд тохирох захиалга олдсонгүй"
                : "Одоогоор линк захиалга бүртгэгдээгүй байна"}
            </p>
            {hasFilters && (
              <Link
                href="/dashboard/super-admin/link-orders"
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
                    Хэрэглэгч
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Бүтээгдэхүүний URL
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Тоо
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-ink-3 whitespace-nowrap">
                    Дүн
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Үүсгэсэн
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((order) => {
                  const displayName =
                    order.customer?.name ?? order.customerName ?? "—";
                  const displayPhone =
                    order.customer?.phone ?? order.customerPhone ?? null;
                  const truncatedUrl =
                    order.productUrl.length > 50
                      ? order.productUrl.slice(0, 50) + "…"
                      : order.productUrl;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      {/* Хэрэглэгч */}
                      <td className="px-4 py-3 max-w-[180px]">
                        <div className="font-medium text-ink truncate">
                          {displayName}
                        </div>
                        {displayPhone && (
                          <div className="text-xs text-ink-3 mt-0.5">
                            {displayPhone}
                          </div>
                        )}
                      </td>

                      {/* Бүтээгдэхүүний URL */}
                      <td className="px-4 py-3 max-w-[280px]">
                        <Link
                          href={`/dashboard/super-admin/link-orders/${order.id}`}
                          className="text-brand hover:underline font-mono text-xs break-all"
                          title={order.productUrl}
                        >
                          {truncatedUrl}
                        </Link>
                      </td>

                      {/* Тоо */}
                      <td className="px-4 py-3 whitespace-nowrap text-ink-2">
                        {order.quantity}
                      </td>

                      {/* Статус */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <LinkOrderStatusBadge status={order.status} />
                      </td>

                      {/* Дүн */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {order.totalAmount != null ? (
                          <span className="font-semibold text-ink">
                            {Number(order.totalAmount).toLocaleString("mn-MN")}{" "}
                            <span className="text-ink-3 font-normal text-xs">
                              {order.currency}
                            </span>
                          </span>
                        ) : (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>

                      {/* Үүсгэсэн */}
                      <td className="px-4 py-3 text-ink-3 whitespace-nowrap text-xs">
                        {new Date(order.createdAt).toLocaleDateString("mn-MN", {
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
            {total.toLocaleString("mn-MN")} захиалга
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
