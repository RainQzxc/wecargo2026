import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { toggleTariff, deleteTariff } from "./actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ active?: string }>;
}) {
  await requirePermission("tariffs.read");

  const sp = await searchParams;
  const activeFilter = sp.active === "true";

  const where = activeFilter ? { isActive: true } : {};

  const items = await db.tariffRule.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      routeCode: true,
      cargoType: true,
      unit: true,
      priceAmount: true,
      currency: true,
      minFeeAmount: true,
      isActive: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Тарифийн Дүрмүүд</h1>
          <p className="text-sm text-ink-3 mt-1">
            Нийт{" "}
            <span className="font-semibold text-ink">{items.length.toLocaleString("mn-MN")}</span>{" "}
            дүрэм
          </p>
        </div>
        <Link
          href="/dashboard/super-admin/tariffs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Шинэ дүрэм
        </Link>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────── */}
      <div className="flex gap-1.5">
        <Link
          href="/dashboard/super-admin/tariffs"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            !activeFilter
              ? "bg-brand text-white"
              : "bg-white border border-neutral-200 text-ink-3 hover:text-ink hover:border-neutral-300"
          }`}
        >
          Бүгд
        </Link>
        <Link
          href="/dashboard/super-admin/tariffs?active=true"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeFilter
              ? "bg-brand text-white"
              : "bg-white border border-neutral-200 text-ink-3 hover:text-ink hover:border-neutral-300"
          }`}
        >
          Идэвхтэй
        </Link>
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
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-ink-3">
              {activeFilter
                ? "Идэвхтэй тарифийн дүрэм олдсонгүй"
                : "Одоогоор тарифийн дүрэм бүртгэгдээгүй байна"}
            </p>
            {activeFilter && (
              <Link
                href="/dashboard/super-admin/tariffs"
                className="text-sm text-brand hover:underline"
              >
                Бүх дүрмийг харах
              </Link>
            )}
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
                    Маршрут
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Ачааны төрөл
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Нэгж
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-ink-3 whitespace-nowrap">
                    Үнэ
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-ink-3 whitespace-nowrap">
                    Хамгийн бага үнэ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-ink-3 whitespace-nowrap">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((rule) => (
                  <tr
                    key={rule.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >
                    {/* Нэр */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="font-medium text-ink">{rule.name}</span>
                    </td>

                    {/* Маршрут */}
                    <td className="px-4 py-3 whitespace-nowrap text-ink-2">
                      {rule.routeCode ?? <span className="text-ink-3">—</span>}
                    </td>

                    {/* Ачааны төрөл */}
                    <td className="px-4 py-3 whitespace-nowrap text-ink-2">
                      {rule.cargoType ?? <span className="text-ink-3">—</span>}
                    </td>

                    {/* Нэгж */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">
                        {rule.unit}
                      </span>
                    </td>

                    {/* Үнэ */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-semibold text-ink">
                        {Number(rule.priceAmount).toLocaleString("mn-MN")}{" "}
                        <span className="text-ink-3 font-normal text-xs">
                          {rule.currency}
                        </span>
                      </span>
                    </td>

                    {/* Хамгийн бага үнэ */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {rule.minFeeAmount != null ? (
                        <span className="font-semibold text-ink">
                          {Number(rule.minFeeAmount).toLocaleString("mn-MN")}{" "}
                          <span className="text-ink-3 font-normal text-xs">
                            {rule.currency}
                          </span>
                        </span>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </td>

                    {/* Статус */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <form
                        action={async () => {
                          "use server";
                          await toggleTariff(rule.id, !rule.isActive);
                        }}
                      >
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                            rule.isActive
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-neutral-100 text-ink-3 hover:bg-neutral-200"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full shrink-0 ${
                              rule.isActive ? "bg-green-500" : "bg-neutral-400"
                            }`}
                          />
                          {rule.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                        </button>
                      </form>
                    </td>

                    {/* Үйлдэл */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <form
                        action={async () => {
                          "use server";
                          await deleteTariff(rule.id);
                        }}
                      >
                        <button
                          type="submit"
                          title="Устгахдаа итгэлтэй байна уу?"
                          className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline transition-colors"
                        >
                          Устгах
                        </button>
                      </form>
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
