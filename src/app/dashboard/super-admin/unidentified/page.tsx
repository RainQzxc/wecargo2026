import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const PAGE_SIZE = 20;

const CLAIM_STATUS_LABELS: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  APPROVED: "Зөвшөөрсөн",
  REJECTED: "Татгалзсан",
};

const CLAIM_STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requirePermission("unidentified.read");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    deletedAt: null,
    OR: [
      { ownerStatus: "UNIDENTIFIED" as const },
      { status: "UNIDENTIFIED" as const },
    ],
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [items, totalCount, pendingClaimsCount, approvedTodayCount] =
    await Promise.all([
      db.parcel.findMany({
        where,
        include: {
          currentWarehouse: { select: { name: true } },
          ownershipClaims: {
            select: {
              id: true,
              status: true,
              claimantName: true,
              claimantPhone: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      db.parcel.count({ where }),
      db.ownershipClaim.count({ where: { status: "PENDING" } }),
      db.ownershipClaim.count({
        where: {
          status: "APPROVED",
          reviewedAt: { gte: today, lt: tomorrow },
        },
      }),
    ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Тодорхойгүй Ачаа</h1>
        <p className="text-sm text-ink-3 mt-1">
          Эзэмшигч тодорхойгүй болон нэхэмжлэл хүлээгдэж буй ачаанууд
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Нийт тодорхойгүй"
          value={totalCount}
          hint="Эзэмшигч тодорхойгүй ачаа"
          color="danger"
        />
        <StatCard
          label="Хүлээгдэж буй нэхэмжлэл"
          value={pendingClaimsCount}
          hint="Шийдвэрлэгдэх хүлээж буй"
          color="warning"
        />
        <StatCard
          label="Өнөөдөр зөвшөөрсөн"
          value={approvedTodayCount}
          hint="Өнөөдөр батлагдсан нэхэмжлэл"
          color="success"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {items.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-ink-3">
            Тодорхойгүй ачаа байхгүй байна
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Код
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Трак код
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Хэмжээ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Агуулах
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Нэхэмжлэлийн тоо
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Үүсгэсэн
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((parcel) => (
                  <>
                    <tr
                      key={parcel.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/super-admin/parcels/${parcel.id}`}
                          className="font-mono text-xs font-semibold text-brand hover:underline"
                        >
                          {parcel.publicCode}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-ink-2 whitespace-nowrap">
                        {parcel.trackCodeOriginal ? (
                          <code className="text-xs font-mono bg-neutral-100 text-ink-2 px-2 py-0.5 rounded">
                            {parcel.trackCodeOriginal}
                          </code>
                        ) : (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={parcel.status} />
                      </td>
                      <td className="px-4 py-3 text-ink-2 whitespace-nowrap text-xs">
                        {parcel.weightKg != null ? (
                          <span>{Number(parcel.weightKg).toFixed(2)} кг</span>
                        ) : parcel.volumeM3 != null ? (
                          <span>{Number(parcel.volumeM3).toFixed(4)} м³</span>
                        ) : (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-2 whitespace-nowrap text-xs">
                        {parcel.currentWarehouse?.name ?? (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {parcel.ownershipClaims.length > 0 ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
                              {parcel.ownershipClaims.length}
                            </span>
                            <span className="text-xs text-ink-3">
                              {
                                parcel.ownershipClaims.filter(
                                  (c) => c.status === "PENDING"
                                ).length
                              }{" "}
                              хүлээгдэж байна
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-ink-3">Нэхэмжлэлгүй</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-3 whitespace-nowrap text-xs">
                        {new Date(parcel.createdAt).toLocaleDateString("mn-MN")}
                      </td>
                    </tr>

                    {/* Inline ownership claims sub-rows */}
                    {parcel.ownershipClaims.length > 0 && (
                      <tr key={`${parcel.id}-claims`} className="bg-amber-50/40">
                        <td colSpan={7} className="px-8 py-3">
                          <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-2">
                            Эзэмшлийн нэхэмжлэлүүд
                          </p>
                          <div className="space-y-1.5">
                            {parcel.ownershipClaims.map((claim) => (
                              <div
                                key={claim.id}
                                className="flex flex-wrap items-center gap-3 text-xs text-ink-2 bg-white rounded-lg border border-neutral-200 px-3 py-2"
                              >
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                    CLAIM_STATUS_CLASSES[claim.status] ??
                                    "bg-neutral-100 text-ink-3"
                                  }`}
                                >
                                  {CLAIM_STATUS_LABELS[claim.status] ?? claim.status}
                                </span>
                                <span className="font-medium text-ink">
                                  {claim.claimantName ?? "Нэргүй"}
                                </span>
                                {claim.claimantPhone && (
                                  <span className="text-ink-3">
                                    {claim.claimantPhone}
                                  </span>
                                )}
                                <span className="text-ink-3 ml-auto">
                                  {new Date(claim.createdAt).toLocaleDateString(
                                    "mn-MN"
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-ink-3">
            {skip + 1}–{Math.min(skip + PAGE_SIZE, totalCount)} /{" "}
            {totalCount.toLocaleString("mn-MN")}
          </span>
          <div className="flex items-center gap-1">
            {page > 1 && (
              <Link
                href={`/dashboard/super-admin/unidentified?${new URLSearchParams({ page: String(page - 1) })}`}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-ink hover:bg-neutral-50 transition-colors"
              >
                ← Өмнөх
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - page) <= 2
              )
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                  acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-ink-3 select-none"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/dashboard/super-admin/unidentified?${new URLSearchParams({ page: String(p) })}`}
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
                href={`/dashboard/super-admin/unidentified?${new URLSearchParams({ page: String(page + 1) })}`}
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
