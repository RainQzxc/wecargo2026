import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { Pagination } from "@/components/dashboard/Pagination";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 30;

const ENTITY_TYPES = [
  "User",
  "Parcel",
  "ShipmentBatch",
  "LinkOrder",
  "DeliveryRequest",
  "TariffRule",
  "Banner",
] as const;

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function truncateId(id: string | null | undefined): string {
  if (!id) return "—";
  if (id.length <= 12) return id;
  return id.slice(0, 8) + "…" + id.slice(-4);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    action?: string;
    entityType?: string;
    actorId?: string;
    page?: string;
  }>;
}) {
  await requirePermission("auditLogs.read");

  const sp = await searchParams;
  const actionFilter = sp.action?.trim() ?? "";
  const entityTypeFilter = sp.entityType?.trim() ?? "";
  const actorIdFilter = sp.actorId?.trim() ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.AuditLogWhereInput = {};

  if (actionFilter) {
    where.action = { contains: actionFilter, mode: "insensitive" };
  }

  if (entityTypeFilter && ENTITY_TYPES.includes(entityTypeFilter as typeof ENTITY_TYPES[number])) {
    where.entityType = entityTypeFilter;
  }

  if (actorIdFilter) {
    where.actorId = { contains: actorIdFilter, mode: "insensitive" };
  }

  const [items, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        actor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    db.auditLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const paginationParams: Record<string, string> = {};
  if (actionFilter)     paginationParams.action     = actionFilter;
  if (entityTypeFilter) paginationParams.entityType = entityTypeFilter;
  if (actorIdFilter)    paginationParams.actorId    = actorIdFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ink">Аудитын Журнал</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-neutral-100 text-ink-3 text-sm font-semibold">
          {total}
        </span>
      </div>

      {/* Filter bar */}
      <form
        method="GET"
        className="flex flex-wrap items-end gap-3 bg-white border border-neutral-200 rounded-xl p-4"
      >
        {/* Action search */}
        <div className="flex flex-col gap-1 min-w-[180px] flex-1">
          <label className="text-xs text-ink-3 font-medium">Үйлдэл</label>
          <input
            type="text"
            name="action"
            defaultValue={actionFilter}
            placeholder="Үйлдлийн нэр…"
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>

        {/* Entity type select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Объектын төрөл</label>
          <select
            name="entityType"
            defaultValue={entityTypeFilter}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          >
            <option value="">Бүгд</option>
            {ENTITY_TYPES.map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>
        </div>

        {/* Actor ID search */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs text-ink-3 font-medium">Жүжигчний ID</label>
          <input
            type="text"
            name="actorId"
            defaultValue={actorIdFilter}
            placeholder="Хэрэглэгчийн ID…"
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
        >
          Хайх
        </button>

        {(actionFilter || entityTypeFilter || actorIdFilter) && (
          <a
            href="/dashboard/super-admin/audit-logs"
            className="px-4 py-2 rounded-lg border border-neutral-200 text-ink-3 text-sm font-semibold hover:bg-neutral-50 transition-colors"
          >
            Цэвэрлэх
          </a>
        )}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium">Аудитын бичлэг олдсонгүй</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">
                    Огноо
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">
                    Жүжигчин
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">
                    Үйлдэл
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">
                    Объектын төрөл
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">
                    Объектын ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">
                    IP хаяг
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">
                    Дэлгэрэнгүй
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors align-top">
                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3">
                      {log.actor ? (
                        <>
                          <p className="font-medium text-ink leading-tight">
                            {log.actor.name ?? "—"}
                          </p>
                          {log.actor.email && (
                            <p className="text-xs text-ink-3 mt-0.5">{log.actor.email}</p>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-ink-3">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-brand/10 text-brand text-xs font-mono font-medium">
                        {log.action}
                      </span>
                    </td>

                    {/* Entity type */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">
                        {log.entityType ?? "—"}
                      </span>
                    </td>

                    {/* Entity ID */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs text-ink-3 font-mono"
                        title={log.entityId ?? undefined}
                      >
                        {truncateId(log.entityId)}
                      </span>
                    </td>

                    {/* IP address */}
                    <td className="px-4 py-3 text-xs text-ink-3 font-mono whitespace-nowrap">
                      {log.ipAddress ?? "—"}
                    </td>

                    {/* Collapsible diff */}
                    <td className="px-4 py-3 max-w-xs">
                      {(log.beforeJson !== null || log.afterJson !== null) ? (
                        <details className="group">
                          <summary className="cursor-pointer text-xs text-brand font-semibold list-none hover:underline select-none">
                            Дэлгэрэнгүй
                          </summary>
                          <div className="mt-2 space-y-2">
                            {log.beforeJson !== null && (
                              <div>
                                <p className="text-xs font-semibold text-ink-3 mb-1">Өмнө:</p>
                                <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap break-all max-w-sm">
                                  {JSON.stringify(log.beforeJson, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.afterJson !== null && (
                              <div>
                                <p className="text-xs font-semibold text-ink-3 mb-1">Дараа:</p>
                                <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap break-all max-w-sm">
                                  {JSON.stringify(log.afterJson, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </details>
                      ) : (
                        <span className="text-xs text-ink-3">—</span>
                      )}
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
            baseHref="/dashboard/super-admin/audit-logs"
            searchParams={paginationParams}
          />
        </div>
      )}
    </div>
  );
}
