import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { Pagination } from "@/components/dashboard/Pagination";
import type { Prisma, NotificationChannel, NotificationStatus } from "@prisma/client";

const PAGE_SIZE = 30;

const CHANNEL_LABELS: Record<string, string> = {
  EMAIL:   "И-мэйл",
  SMS:     "SMS",
  PUSH:    "Push",
  IN_APP:  "Апп доторх",
  WEBHOOK: "Webhook",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:   "Хүлээгдэж байна",
  SENT:      "Илгээсэн",
  FAILED:    "Амжилтгүй",
  CANCELLED: "Цуцлагдсан",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700",
  SENT:      "bg-green-50 text-green-700",
  FAILED:    "bg-red-50 text-red-700",
  CANCELLED: "bg-neutral-100 text-ink-3",
};

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("mn-MN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; status?: string; search?: string; page?: string }>;
}) {
  await requirePermission("notifications.read");

  const sp      = await searchParams;
  const channel = sp.channel?.trim() ?? "";
  const status  = sp.status?.trim() ?? "";
  const search  = sp.search?.trim() ?? "";
  const page    = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip    = (page - 1) * PAGE_SIZE;

  const where: Prisma.NotificationLogWhereInput = {};
  if (channel && Object.keys(CHANNEL_LABELS).includes(channel)) where.channel = channel as NotificationChannel;
  if (status  && Object.keys(STATUS_LABELS).includes(status))   where.status  = status as NotificationStatus;
  if (search) {
    where.OR = [
      { message:   { contains: search, mode: "insensitive" } },
      { recipient: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    db.notificationLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    db.notificationLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginationParams: Record<string, string> = {};
  if (channel) paginationParams.channel = channel;
  if (status)  paginationParams.status  = status;
  if (search)  paginationParams.search  = search;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ink">Мэдэгдлийн Журнал</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-neutral-100 text-ink-3 text-sm font-semibold">
          {total.toLocaleString("mn-MN")}
        </span>
      </div>

      <form method="GET" className="flex flex-wrap items-end gap-3 bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex flex-col gap-1 min-w-[200px] flex-1">
          <label className="text-xs text-ink-3 font-medium">Хайх</label>
          <input type="text" name="search" defaultValue={search} placeholder="Мессеж, хүлээн авагч…"
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Суваг</label>
          <select name="channel" defaultValue={channel} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
            <option value="">Бүгд</option>
            {Object.entries(CHANNEL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-3 font-medium">Статус</label>
          <select name="status" defaultValue={status} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand">
            <option value="">Бүгд</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хайх</button>
        {(channel || status || search) && (
          <a href="/dashboard/super-admin/notifications" className="px-4 py-2 rounded-lg border border-neutral-200 text-ink-3 text-sm font-semibold hover:bg-neutral-50 transition-colors">Цэвэрлэх</a>
        )}
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-3">
            <svg className="size-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm font-medium">Мэдэгдэл олдсонгүй</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Огноо</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Хэрэглэгч</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Суваг</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Мессеж</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Хүлээн авагч</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Илгээсэн</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Алдаа</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((n) => (
                  <tr key={n.id} className="hover:bg-neutral-50/50 transition-colors align-top">
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{formatDate(n.createdAt)}</td>
                    <td className="px-4 py-3">
                      {n.user
                        ? <><p className="font-medium text-ink leading-tight">{n.user.name ?? "—"}</p>{n.user.email && <p className="text-xs text-ink-3 mt-0.5">{n.user.email}</p>}</>
                        : <span className="text-xs text-ink-3">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">
                        {CHANNEL_LABELS[n.channel] ?? n.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]"><p className="text-ink truncate">{n.message}</p></td>
                    <td className="px-4 py-3 max-w-[180px]"><p className="text-ink-3 truncate font-mono text-xs">{n.recipient ?? "—"}</p></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[n.status] ?? "bg-neutral-100 text-ink-3"}`}>
                        {STATUS_LABELS[n.status] ?? n.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{formatDate(n.sentAt)}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {n.errorMessage
                        ? <details><summary className="cursor-pointer text-xs text-red-600 font-semibold list-none hover:underline select-none">Харах</summary><p className="mt-1 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2 whitespace-pre-wrap break-all">{n.errorMessage}</p></details>
                        : <span className="text-xs text-ink-3">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseHref="/dashboard/super-admin/notifications" searchParams={paginationParams} />
        </div>
      )}
    </div>
  );
}
