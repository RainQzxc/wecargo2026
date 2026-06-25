import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PARCEL_STATUS, PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";

const PAGE_SIZE = 25;

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  NOT_REQUIRED: "Шаардлагагүй",
  UNPAID:       "Төлөөгүй",
  PARTIAL:      "Хэсэгчлэн",
  PAID:         "Төлсөн",
  REFUNDED:     "Буцаасан",
};

const PAYMENT_VARIANT: Record<string, { bg: string; text: string }> = {
  NOT_REQUIRED: { bg: "bg-neutral-100", text: "text-ink-3"     },
  UNPAID:       { bg: "bg-red-50",      text: "text-red-700"   },
  PARTIAL:      { bg: "bg-amber-50",    text: "text-amber-700" },
  PAID:         { bg: "bg-green-50",    text: "text-green-700" },
  REFUNDED:     { bg: "bg-blue-50",     text: "text-blue-700"  },
};

function PaymentBadge({ status }: { status: string }) {
  const variant = PAYMENT_VARIANT[status] ?? { bg: "bg-neutral-100", text: "text-ink-3" };
  const label = PAYMENT_STATUS_LABELS[status] ?? status;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${variant.bg} ${variant.text}`}
    >
      {label}
    </span>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string; page?: string }>;
}) {
  await requirePermission("parcels.read");

  const { q, status, payment, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { trackCodeOriginal: { contains: q, mode: "insensitive" as const } },
            { customerName: { contains: q, mode: "insensitive" as const } },
            { customerPhone: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status ? { status: status as never } : {}),
    ...(payment ? { paymentStatus: payment as never } : {}),
  };

  const [items, total] = await Promise.all([
    db.parcel.findMany({
      where,
      select: {
        id: true,
        publicCode: true,
        trackCodeOriginal: true,
        customerName: true,
        customerPhone: true,
        status: true,
        paymentStatus: true,
        priceAmount: true,
        currency: true,
        createdAt: true,
        currentWarehouse: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.parcel.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasFilters = !!(q || status || payment);

  function buildPageHref(p: number): string {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (payment) params.set("payment", payment);
    params.set("page", String(p));
    return `/dashboard/super-admin/parcels?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Ачаанууд</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт{" "}
            <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span>{" "}
            ачаан
          </p>
        </div>
        <Link
          href="/dashboard/super-admin/parcels/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Шинэ бараа
        </Link>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────── */}
      <form method="GET" className="flex flex-col sm:flex-row gap-2 flex-wrap">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Трак код, нэр эсвэл утасаар хайх…"
          className="flex-1 min-w-[200px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />

        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand min-w-[190px]"
        >
          <option value="">Бүх статус</option>
          {Object.values(PARCEL_STATUS).map((s) => (
            <option key={s} value={s}>
              {PARCEL_STATUS_LABELS_MN[s]}
            </option>
          ))}
        </select>

        <select
          name="payment"
          defaultValue={payment ?? ""}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand min-w-[160px]"
        >
          <option value="">Бүх төлбөр</option>
          {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
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
            href="/dashboard/super-admin/parcels"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm text-ink-3">
              {hasFilters
                ? "Хайлтын нөхцөлд тохирох ачаан олдсонгүй"
                : "Одоогоор ачаан бүртгэгдээгүй байна"}
            </p>
            {hasFilters && (
              <Link
                href="/dashboard/super-admin/parcels"
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
                    Трак код
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Оригинал код
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Хэрэглэгч
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Утас
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Агуулах
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-ink-3 whitespace-nowrap">
                    Үнэ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Төлбөр
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Огноо
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((parcel) => (
                  <tr
                    key={parcel.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >
                    {/* Трак код — last 8 chars of publicCode */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/super-admin/parcels/${parcel.id}`}
                        className="font-mono text-xs font-semibold text-brand hover:underline"
                      >
                        {parcel.publicCode.slice(-8).toUpperCase()}
                      </Link>
                    </td>

                    {/* Оригинал код */}
                    <td className="px-4 py-3 max-w-[160px] truncate">
                      {parcel.trackCodeOriginal ? (
                        <code className="text-xs font-mono bg-neutral-100 text-ink-2 px-1.5 py-0.5 rounded">
                          {parcel.trackCodeOriginal}
                        </code>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>

                    {/* Хэрэглэгч */}
                    <td className="px-4 py-3 max-w-[160px] truncate">
                      <span className="font-medium text-ink">
                        {parcel.customerName ?? <span className="text-ink-3 font-normal">—</span>}
                      </span>
                    </td>

                    {/* Утас */}
                    <td className="px-4 py-3 text-ink-2 whitespace-nowrap">
                      {parcel.customerPhone ?? <span className="text-ink-3">—</span>}
                    </td>

                    {/* Статус */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={parcel.status} />
                    </td>

                    {/* Агуулах */}
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ink-2">
                      {parcel.currentWarehouse?.name ?? (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>

                    {/* Үнэ */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {parcel.priceAmount != null ? (
                        <span className="font-semibold text-ink">
                          {Number(parcel.priceAmount).toLocaleString("mn-MN")}{" "}
                          <span className="text-ink-3 font-normal text-xs">
                            {parcel.currency}
                          </span>
                        </span>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>

                    {/* Төлбөр */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <PaymentBadge status={parcel.paymentStatus} />
                    </td>

                    {/* Огноо */}
                    <td className="px-4 py-3 text-ink-3 whitespace-nowrap text-xs">
                      {new Date(parcel.createdAt).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
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
            {total.toLocaleString("mn-MN")} ачаан
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
