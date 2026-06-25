import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("customers.read");
  const { id } = await params;

  const customer = await db.user.findUnique({
    where: { id },
    include: {
      parcels: { orderBy: { createdAt:"desc" }, take: 20 },
      linkOrders: { orderBy: { createdAt:"desc" }, take: 10, select: { id:true, productUrl:true, sellerTrackCodeOriginal:true, status:true, createdAt:true } },
    },
  });

  if (!customer || customer.role !== "CUSTOMER") notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/customers" className="text-sm text-brand hover:underline">← Буцах</Link>
        <h1 className="text-2xl font-bold text-ink">{customer.name ?? "Нэргүй"}</h1>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${customer.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-ink-3"}`}>
          <span className={`size-1.5 rounded-full ${customer.status === "ACTIVE" ? "bg-green-500" : "bg-neutral-400"}`} />
          {customer.status === "ACTIVE" ? "Идэвхтэй" : "Идэвхгүй"}
        </span>
      </div>

      {/* Info card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:"И-мэйл", value: customer.email },
          { label:"Утас",   value: customer.phone ?? "—" },
          { label:"Бүртгэсэн", value: customer.createdAt.toLocaleDateString("mn-MN") },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-ink-3 font-medium mb-1">{label}</p>
            <p className="font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Parcels */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Ачааны жагсаалт</h2>
          <span className="text-xs text-ink-3">{customer.parcels.length} ачаа</span>
        </div>
        {customer.parcels.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-ink-3 text-sm">Ачаа байхгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Трак код</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Төлөв</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Жин</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Огноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customer.parcels.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/admin/parcels/${p.id}`} className="font-mono text-sm font-semibold text-brand hover:underline">{p.trackCodeOriginal ?? p.publicCode}</Link>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-ink-3">{p.weightKg != null ? `${Number(p.weightKg).toFixed(2)} кг` : "—"}</td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{p.createdAt.toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Link orders */}
      {customer.linkOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="font-semibold text-ink">Линк захиалгууд</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Трак код</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Бүтээгдэхүүн</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">Огноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customer.linkOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/admin/link-orders/${o.id}`} className="font-mono text-xs text-brand hover:underline">{o.sellerTrackCodeOriginal ?? o.id.slice(-8)}</Link>
                    </td>
                    <td className="px-4 py-3 text-ink-3 max-w-[200px] truncate">{o.productUrl ?? "—"}</td>
                    <td className="px-4 py-3 text-xs font-mono text-ink-3">{o.status}</td>
                    <td className="px-4 py-3 text-xs text-ink-3 whitespace-nowrap">{o.createdAt.toLocaleDateString("mn-MN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
