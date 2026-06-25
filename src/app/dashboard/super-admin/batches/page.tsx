import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const PAGE_SIZE = 20;

type BatchStatus =
  | "DRAFT"
  | "LOADING"
  | "LOADED"
  | "DEPARTED"
  | "ARRIVED_ULAANBAATAR"
  | "CLOSED"
  | "CANCELLED";

const BATCH_STATUS_LABELS: Record<BatchStatus, string> = {
  DRAFT:               "Ноорог",
  LOADING:             "Ачилж байна",
  LOADED:              "Ачигдсан",
  DEPARTED:            "Гарсан",
  ARRIVED_ULAANBAATAR: "УБ-д ирсэн",
  CLOSED:              "Хаагдсан",
  CANCELLED:           "Цуцлагдсан",
};

const BATCH_STATUS_LIST: BatchStatus[] = [
  "DRAFT",
  "LOADING",
  "LOADED",
  "DEPARTED",
  "ARRIVED_ULAANBAATAR",
  "CLOSED",
  "CANCELLED",
];

type BadgeVariant = "gray" | "blue" | "yellow" | "brand" | "green" | "red" | "purple";

const BATCH_STATUS_VARIANT: Record<BatchStatus, BadgeVariant> = {
  DRAFT:               "gray",
  LOADING:             "yellow",
  LOADED:              "yellow",
  DEPARTED:            "blue",
  ARRIVED_ULAANBAATAR: "brand",
  CLOSED:              "green",
  CANCELLED:           "red",
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

function BatchStatusBadge({ status }: { status: string }) {
  const variant = BATCH_STATUS_VARIANT[status as BatchStatus] ?? "gray";
  const label = BATCH_STATUS_LABELS[status as BatchStatus] ?? status;
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
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requirePermission("batches.read");

  const { status, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(status ? { status: status as never } : {}),
  };

  const [items, total] = await Promise.all([
    db.shipmentBatch.findMany({
      where,
      select: {
        id: true,
        batchNo: true,
        status: true,
        vehiclePlate: true,
        driverName: true,
        createdAt: true,
        originWarehouse: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.shipmentBatch.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildHref(p: number, s?: string): string {
    const params = new URLSearchParams();
    if (s) params.set("status", s);
    params.set("page", String(p));
    return `/dashboard/super-admin/batches?${params.toString()}`;
  }

  function buildStatusHref(s: string | undefined): string {
    const params = new URLSearchParams();
    if (s) params.set("status", s);
    return `/dashboard/super-admin/batches?${params.toString()}`;
  }

  function buildPageHref(p: number): string {
    return buildHref(p, status);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Ачааны Бүлгүүд</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт{" "}
            <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span>{" "}
            бүлэг
          </p>
        </div>
        <Link
          href="/dashboard/super-admin/batches/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Шинэ бүлэг
        </Link>
      </div>

      {/* ── Status filter tabs ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        <Link
          href={buildStatusHref(undefined)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            !status
              ? "bg-brand text-white"
              : "bg-white border border-neutral-200 text-ink-3 hover:text-ink hover:border-neutral-300"
          }`}
        >
          Бүгд
        </Link>
        {BATCH_STATUS_LIST.map((s) => (
          <Link
            key={s}
            href={buildStatusHref(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              status === s
                ? "bg-brand text-white"
                : "bg-white border border-neutral-200 text-ink-3 hover:text-ink hover:border-neutral-300"
            }`}
          >
            {BATCH_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="text-sm text-ink-3">
              {status
                ? "Энэ статустай бүлэг олдсонгүй"
                : "Одоогоор бүлэг бүртгэгдээгүй байна"}
            </p>
            {status && (
              <Link
                href="/dashboard/super-admin/batches"
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
                    Бүлгийн дугаар
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Гарал
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Жолооч
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Хавтан дугаар
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-ink-3 whitespace-nowrap">
                    Ачаа тоо
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Үүсгэсэн
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >
                    {/* Бүлгийн дугаар */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/super-admin/batches/${batch.id}`}
                        className="font-mono text-xs font-semibold text-brand hover:underline"
                      >
                        {batch.batchNo}
                      </Link>
                    </td>

                    {/* Статус */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <BatchStatusBadge status={batch.status} />
                    </td>

                    {/* Гарал */}
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ink-2">
                      {batch.originWarehouse?.name ?? (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>

                    {/* Жолооч */}
                    <td className="px-4 py-3 max-w-[160px] truncate text-ink-2">
                      {batch.driverName ?? <span className="text-ink-3">—</span>}
                    </td>

                    {/* Хавтан дугаар */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {batch.vehiclePlate ? (
                        <code className="text-xs font-mono bg-neutral-100 text-ink-2 px-1.5 py-0.5 rounded">
                          {batch.vehiclePlate}
                        </code>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>

                    {/* Ачаа тоо */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-semibold text-ink">
                        {batch._count.items.toLocaleString("mn-MN")}
                      </span>
                    </td>

                    {/* Үүсгэсэн */}
                    <td className="px-4 py-3 text-ink-3 whitespace-nowrap text-xs">
                      {new Date(batch.createdAt).toLocaleDateString("mn-MN", {
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
            {total.toLocaleString("mn-MN")} бүлэг
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
