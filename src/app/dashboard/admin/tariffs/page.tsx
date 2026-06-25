import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ active?: string }>;
}) {
  await requirePermission("tariffs.read");

  const { active } = await searchParams;
  const where = active === "true" ? { isActive: true } : {};

  const tariffs = await db.tariffRule.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Тарифийн Дүрмүүд</h1>
        <p className="text-sm text-ink-3 mt-1">Нийт <span className="font-semibold text-ink">{tariffs.length}</span> дүрэм — зөвхөн харах</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {tariffs.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-3 text-sm">Тарифийн дүрэм олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Нэр</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Маршрут</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Ачааны төрөл</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">Нэгж</th>
                  <th className="px-4 py-3 text-right font-medium text-ink-3 whitespace-nowrap">Үнэ</th>
                  <th className="px-4 py-3 text-center font-medium text-ink-3 whitespace-nowrap">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tariffs.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">{t.name}</td>
                    <td className="px-4 py-3 text-ink-3">{t.routeCode ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-3">{t.cargoType ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">{t.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-ink">
                      {Number(t.priceAmount).toLocaleString("mn-MN")} <span className="text-ink-3 font-normal text-xs">{t.currency}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${t.isActive ? "bg-green-50 text-green-700" : "bg-neutral-100 text-ink-3"}`}>
                        <span className={`size-1.5 rounded-full shrink-0 ${t.isActive ? "bg-green-500" : "bg-neutral-400"}`} />
                        {t.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
