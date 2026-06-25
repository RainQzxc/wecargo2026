import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { Pagination } from "@/components/dashboard/Pagination";

const PAGE_SIZE = 25;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission("customers.read");

  const sp   = await searchParams;
  const q    = sp.q?.trim() ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    role: "CUSTOMER" as const,
    ...(q ? { OR: [
      { name:  { contains: q, mode: "insensitive" as const } },
      { email: { contains: q, mode: "insensitive" as const } },
      { phone: { contains: q, mode: "insensitive" as const } },
    ] } : {}),
  };

  const [customers, total] = await Promise.all([
    db.user.findMany({ where, orderBy: { createdAt:"desc" }, skip, take: PAGE_SIZE, select: { id:true, name:true, email:true, phone:true, status:true, createdAt:true, _count: { select: { parcels:true } } } }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pp: Record<string, string> = {};
  if (q) pp.q = q;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Хэрэглэгчид</h1>
        <p className="text-sm text-ink-3 mt-1">Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> хэрэглэгч</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 items-end bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs text-ink-3 font-medium">Хайх</label>
          <input type="text" name="q" defaultValue={q} placeholder="Нэр, и-мэйл, утас…" className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хайх</button>
        {q && <Link href="/dashboard/admin/customers" className="px-4 py-2 rounded-lg border border-neutral-200 text-ink-3 text-sm font-semibold hover:bg-neutral-50 transition-colors">Цэвэрлэх</Link>}
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {customers.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-3 text-sm">Хэрэглэгч олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Нэр</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Холбоо барих</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Ачааны тоо</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Бүртгэсэн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/admin/customers/${c.id}`} className="font-semibold text-ink hover:text-brand transition-colors">{c.name ?? "—"}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink-3 text-xs">{c.email}</p>
                      {c.phone && <p className="text-ink-3 text-xs mt-0.5">{c.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-ink">{c._count.parcels}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-ink-3"}`}>
                        <span className={`size-1.5 rounded-full shrink-0 ${c.status === "ACTIVE" ? "bg-green-500" : "bg-neutral-400"}`} />
                        {c.status === "ACTIVE" ? "Идэвхтэй" : "Идэвхгүй"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{c.createdAt.toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseHref="/dashboard/admin/customers" searchParams={pp} />
        </div>
      )}
    </div>
  );
}
