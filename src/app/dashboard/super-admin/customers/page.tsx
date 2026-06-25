import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";

const PAGE_SIZE = 25;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission("customers.read");

  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    role: "CUSTOMER" as const,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            {
              customerProfile: {
                customerCode: { contains: q, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    db.user.findMany({
      where,
      include: { customerProfile: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Үйлчлүүлэгчид</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт {total.toLocaleString("mn-MN")} үйлчлүүлэгч
          </p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Нэр, утас, имэйл эсвэл код хайх…"
          className="flex-1 min-w-0 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
        >
          Хайх
        </button>
        {q && (
          <Link
            href="/dashboard/super-admin/customers"
            className="shrink-0 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-ink-3 hover:text-ink transition-colors"
          >
            Цэвэрлэх
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {items.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-ink-3">
            {q ? `"${q}" хайлтаар үр дүн олдсонгүй` : "Үйлчлүүлэгч байхгүй байна"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Нэр
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Утас
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Имэйл
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Код
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Үүсгэсэн
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/super-admin/customers/${user.id}`}
                        className="font-medium text-ink hover:text-brand transition-colors"
                      >
                        {user.name ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-2 whitespace-nowrap">
                      {user.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-2 max-w-[220px] truncate">
                      {user.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.customerProfile?.customerCode ? (
                        <code className="text-xs font-mono bg-neutral-100 text-ink-2 px-2 py-0.5 rounded">
                          {user.customerProfile.customerCode}
                        </code>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "Идэвхтэй" : "Хаасан"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-3 whitespace-nowrap text-xs">
                      {new Date(user.createdAt).toLocaleDateString("mn-MN")}
                    </td>
                  </tr>
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
            {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} / {total.toLocaleString("mn-MN")}
          </span>
          <div className="flex items-center gap-1">
            {page > 1 && (
              <Link
                href={`/dashboard/super-admin/customers?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page - 1) })}`}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-ink hover:bg-neutral-50 transition-colors"
              >
                ← Өмнөх
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
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
                    href={`/dashboard/super-admin/customers?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`}
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
                href={`/dashboard/super-admin/customers?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page + 1) })}`}
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
