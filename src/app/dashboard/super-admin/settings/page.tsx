import { requirePermission } from "@/features/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

const WAREHOUSE_TYPE_LABELS: Record<string, string> = {
  EREEN:        "Эрээн",
  ULAANBAATAR:  "Улаанбаатар",
  OTHER:        "Бусад",
};

export default async function Page() {
  await requirePermission("settings.read");

  const [warehouses, branches] = await Promise.all([
    db.warehouse.findMany({
      orderBy: { name: "asc" },
      select: {
        id:       true,
        name:     true,
        type:     true,
        phone:    true,
        addressMn: true,
        isActive: true,
        _count:   { select: { staff: true } },
      },
    }),
    db.branch.findMany({
      orderBy: { name: "asc" },
      select: {
        id:       true,
        name:     true,
        phone:    true,
        address:  true,
        isActive: true,
      },
    }),
  ]);

  async function createWarehouse(formData: FormData) {
    "use server";
    const name      = (formData.get("name") as string | null)?.trim() ?? "";
    const type      = (formData.get("type") as string | null)?.trim() ?? "";
    const phone     = (formData.get("phone") as string | null)?.trim() || null;
    const addressMn = (formData.get("addressMn") as string | null)?.trim() || null;

    if (!name || !type) return;

    await db.warehouse.create({
      data: {
        name,
        type:      type as "EREEN" | "ULAANBAATAR" | "OTHER",
        phone,
        addressMn,
        isActive:  true,
      },
    });

    revalidatePath("/dashboard/super-admin/settings");
  }

  async function createBranch(formData: FormData) {
    "use server";
    const name    = (formData.get("name") as string | null)?.trim() ?? "";
    const phone   = (formData.get("phone") as string | null)?.trim() || null;
    const address = (formData.get("address") as string | null)?.trim() || null;

    if (!name) return;

    await db.branch.create({
      data: { name, phone, address, isActive: true },
    });

    revalidatePath("/dashboard/super-admin/settings");
  }

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Системийн Тохиргоо</h1>
        <p className="mt-1 text-sm text-ink-3">Агуулах болон салбарын тохиргоог удирдана уу.</p>
      </div>

      {/* ── Section 1: Warehouses ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink border-b border-neutral-200 pb-2">
          Агуулахууд
        </h2>

        {/* Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {warehouses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-ink-3">
              <p className="text-sm font-medium">Агуулах байхгүй байна</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Нэр
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Төрөл
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Утас
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Хаяг (MN)
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Идэвхтэй
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Ажилчдын тоо
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {warehouses.map((wh) => (
                    <tr key={wh.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-ink">{wh.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-ink text-xs font-medium">
                          {WAREHOUSE_TYPE_LABELS[wh.type] ?? wh.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-3">{wh.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-ink-3 max-w-[200px] truncate">
                        {wh.addressMn ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {wh.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                            <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                            Тийм
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
                            <span className="size-1.5 rounded-full bg-neutral-300 shrink-0" />
                            Үгүй
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-ink">
                        {wh._count.staff.toLocaleString("mn-MN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add warehouse form */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-ink mb-4">Шинэ агуулах нэмэх</h3>
          <form action={createWarehouse} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-3 font-medium">
                Нэр <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Агуулахын нэр"
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-3 font-medium">
                Төрөл <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                required
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              >
                <option value="">Сонгох…</option>
                <option value="EREEN">Эрээн</option>
                <option value="ULAANBAATAR">Улаанбаатар</option>
                <option value="OTHER">Бусад</option>
              </select>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-3 font-medium">Утас</label>
              <input
                type="text"
                name="phone"
                placeholder="Утасны дугаар"
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>

            {/* Address MN */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-3 font-medium">Хаяг (MN)</label>
              <input
                type="text"
                name="addressMn"
                placeholder="Хаяг монголоор"
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>

            {/* Submit */}
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
              >
                Нэмэх
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Section 2: Branches ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink border-b border-neutral-200 pb-2">
          Салбарууд
        </h2>

        {/* Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-ink-3">
              <p className="text-sm font-medium">Салбар байхгүй байна</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Нэр
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Утас
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Хаяг
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                      Идэвхтэй
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {branches.map((br) => (
                    <tr key={br.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-ink">{br.name}</td>
                      <td className="px-4 py-3 text-ink-3">{br.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-ink-3 max-w-[240px] truncate">
                        {br.address ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {br.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                            <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                            Тийм
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
                            <span className="size-1.5 rounded-full bg-neutral-300 shrink-0" />
                            Үгүй
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add branch form */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-ink mb-4">Шинэ салбар нэмэх</h3>
          <form action={createBranch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-3 font-medium">
                Нэр <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Салбарын нэр"
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-3 font-medium">Утас</label>
              <input
                type="text"
                name="phone"
                placeholder="Утасны дугаар"
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-3 font-medium">Хаяг</label>
              <input
                type="text"
                name="address"
                placeholder="Хаяг"
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>

            {/* Submit */}
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
              >
                Нэмэх
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Section 3: System info ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink border-b border-neutral-200 pb-2">
          Системийн мэдээлэл
        </h2>
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-neutral-100">
              <tr className="hover:bg-neutral-50/30 transition-colors">
                <td className="px-5 py-3.5 text-xs font-semibold text-ink-3 uppercase tracking-wide w-48">
                  Аппын нэр
                </td>
                <td className="px-5 py-3.5 font-medium text-ink">WECARGO 2026</td>
              </tr>
              <tr className="hover:bg-neutral-50/30 transition-colors">
                <td className="px-5 py-3.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Хувилбар
                </td>
                <td className="px-5 py-3.5 text-ink">1.0.0</td>
              </tr>
              <tr className="hover:bg-neutral-50/30 transition-colors">
                <td className="px-5 py-3.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Мэдээллийн сан
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                    <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                    Холбогдсон
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-neutral-50/30 transition-colors">
                <td className="px-5 py-3.5 text-xs font-semibold text-ink-3 uppercase tracking-wide">
                  Node орчин
                </td>
                <td className="px-5 py-3.5 text-ink font-mono text-xs">
                  {process.env.NODE_ENV}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
