import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { Pagination } from "@/components/dashboard/Pagination";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 20;

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN:     "Супер Админ",
  ADMIN:           "Админ",
  WAREHOUSE_STAFF: "Агуулах",
  CUSTOMER:        "Хэрэглэгч",
  COURIER:         "Хүргэлт",
};

const ALL_ROLES = ["SUPER_ADMIN", "ADMIN", "WAREHOUSE_STAFF", "CUSTOMER", "COURIER"] as const;

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string }>;
}) {
  await requirePermission("users.read");

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const roleFilter = sp.role ?? "";
  const statusFilter = sp.status ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [
      { name:  { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (roleFilter && ALL_ROLES.includes(roleFilter as typeof ALL_ROLES[number])) {
    where.role = roleFilter as Prisma.EnumRoleFilter["equals"];
  }

  if (statusFilter === "ACTIVE" || statusFilter === "DISABLED") {
    where.status = statusFilter;
  }

  const [items, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id:          true,
        name:        true,
        email:       true,
        phone:       true,
        role:        true,
        status:      true,
        lastLoginAt: true,
        createdAt:   true,
      },
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Build searchParams object for Pagination (excluding page)
  const paginationParams: Record<string, string> = {};
  if (q)            paginationParams.q      = q;
  if (roleFilter)   paginationParams.role   = roleFilter;
  if (statusFilter) paginationParams.status = statusFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ink">Хэрэглэгчид</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-neutral-100 text-ink-3 text-sm font-semibold">
          {total}
        </span>
      </div>

      {/* Filter bar */}
      <form
        method="GET"
        className="flex flex-wrap items-end gap-3 bg-white border border-neutral-200 rounded-xl p-4"
      >
        {/* Text search */}
        <div className="flex flex-col gap-1 min-w-[200px] flex-1">
          <label className="text-xs text-ink-3 font-medium">Хайх</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Нэр, утас, имэйл…"
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>

        {/* Role filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Дүр</label>
          <select
            name="role"
            defaultValue={roleFilter}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          >
            <option value="">Бүгд</option>
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Төлөв</label>
          <select
            name="status"
            defaultValue={statusFilter}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          >
            <option value="">Бүгд</option>
            <option value="ACTIVE">Идэвхтэй</option>
            <option value="DISABLED">Хаагдсан</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
        >
          Хайх
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-3">
            <svg
              className="size-12 mb-3 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm font-medium">Хэрэглэгч олдсонгүй</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                    Нэр / Имэйл
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                    Утас
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                    Дүр
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                    Төлөв
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                    Сүүлд нэвтэрсэн
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                    Үүсгэсэн огноо
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Name / Email */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink leading-tight">
                        {user.name ?? "—"}
                      </p>
                      {user.email && (
                        <p className="text-xs text-ink-3 mt-0.5">{user.email}</p>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-ink-3">
                      {user.phone ?? "—"}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {user.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                          <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                          Идэвхтэй
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                          <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                          Хаагдсан
                        </span>
                      )}
                    </td>

                    {/* Last login */}
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">
                      {formatDate(user.lastLoginAt)}
                    </td>

                    {/* Created at */}
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/super-admin/users/${user.id}`}
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        Харах
                      </Link>
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
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseHref="/dashboard/super-admin/users"
            searchParams={paginationParams}
          />
        </div>
      )}
    </div>
  );
}
