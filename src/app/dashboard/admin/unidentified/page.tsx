import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/dashboard/Pagination";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 25;

const CLAIM_STATUS_LABELS: Record<string, string> = { PENDING:"Хүлээгдэж байна", APPROVED:"Зөвшөөрсөн", REJECTED:"Татгалзсан" };
const CLAIM_STATUS_CLASSES: Record<string, string> = { PENDING:"bg-amber-50 text-amber-700", APPROVED:"bg-green-50 text-green-700", REJECTED:"bg-red-50 text-red-700" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission("unidentified.read");

  const sp   = await searchParams;
  const q    = sp.q?.trim() ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.ParcelWhereInput = { ownerStatus: "UNIDENTIFIED", deletedAt: null };
  if (q) where.OR = [
    { trackCodeOriginal: { contains: q, mode:"insensitive" } },
    { customerName: { contains: q, mode:"insensitive" } },
    { customerPhone: { contains: q, mode:"insensitive" } },
  ];

  const [parcels, total] = await Promise.all([
    db.parcel.findMany({
      where, orderBy: { createdAt:"desc" }, skip, take: PAGE_SIZE,
      include: { ownershipClaims: { orderBy: { createdAt:"desc" }, take: 1, select: { id:true, status:true, claimantName:true } } },
    }),
    db.parcel.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pp: Record<string, string> = {};
  if (q) pp.q = q;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Тодорхойгүй Ачаа</h1>
        <p className="text-sm text-ink-3 mt-1">Нийт <span className="font-semibold text-ink">{total.toLocaleString("mn-MN")}</span> тодорхойгүй ачаа</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 items-end bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs text-ink-3 font-medium">Хайх</label>
          <input type="text" name="q" defaultValue={q} placeholder="Трак код, нэр, утас…" className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Хайх</button>
        {q && <Link href="/dashboard/admin/unidentified" className="px-4 py-2 rounded-lg border border-neutral-200 text-ink-3 text-sm font-semibold hover:bg-neutral-50 transition-colors">Цэвэрлэх</Link>}
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {parcels.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-3 text-sm">Тодорхойгүй ачаа олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Трак код</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Хэрэглэгч</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Төлөв</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Нэхэмжлэл</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide whitespace-nowrap">Огноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {parcels.map((p) => {
                  const claim = p.ownershipClaims[0];
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/admin/parcels/${p.id}`} className="font-mono text-sm font-semibold text-brand hover:underline">{p.trackCodeOriginal ?? p.publicCode}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{p.customerName ?? "—"}</p>
                        {p.customerPhone && <p className="text-xs text-ink-3">{p.customerPhone}</p>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        {claim ? (
                          <div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${CLAIM_STATUS_CLASSES[claim.status] ?? "bg-neutral-100 text-ink"}`}>
                              {CLAIM_STATUS_LABELS[claim.status] ?? claim.status}
                            </span>
                            {claim.claimantName && <p className="text-xs text-ink-3 mt-0.5">{claim.claimantName}</p>}
                          </div>
                        ) : <span className="text-xs text-ink-3">Нэхэмжлэл байхгүй</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{p.createdAt.toLocaleDateString("mn-MN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseHref="/dashboard/admin/unidentified" searchParams={pp} />
        </div>
      )}
    </div>
  );
}
