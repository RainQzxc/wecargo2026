import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { createLinkOrder } from "../../actions";

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";

export default async function CustomerNewLinkOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/dashboard/customer/link-orders" className="text-[13px] text-ink-3 hover:text-brand">
          ← Линк захиалга
        </Link>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-ink">Шинэ захиалга</h1>
        <p className="mt-1 text-sm text-ink-3">
          Хятад дэлгүүрийн барааны линкийг оруулна уу. Бид хянаад холбогдоно.
        </p>
      </div>

      {error === "url" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Барааны линк (URL) заавал шаардлагатай.
        </div>
      )}

      <form action={createLinkOrder} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <div>
          <label htmlFor="productUrl" className="mb-1.5 block text-sm font-medium text-ink">
            Барааны линк <span className="text-red-500">*</span>
          </label>
          <input id="productUrl" name="productUrl" required placeholder="https://..." className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="storeName" className="mb-1.5 block text-sm font-medium text-ink">Дэлгүүр</label>
            <input id="storeName" name="storeName" placeholder="Taobao, Pinduoduo…" className={inputCls} />
          </div>
          <div>
            <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium text-ink">Тоо ширхэг</label>
            <input id="quantity" name="quantity" type="number" min={1} defaultValue={1} className={inputCls} />
          </div>
          <div>
            <label htmlFor="color" className="mb-1.5 block text-sm font-medium text-ink">Өнгө</label>
            <input id="color" name="color" placeholder="Заавал биш" className={inputCls} />
          </div>
          <div>
            <label htmlFor="size" className="mb-1.5 block text-sm font-medium text-ink">Хэмжээ</label>
            <input id="size" name="size" placeholder="Заавал биш" className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-ink">Нэмэлт тайлбар</label>
          <textarea id="notes" name="notes" rows={3} placeholder="Заавал биш" className={`${inputCls} resize-y`} />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Захиалга илгээх
        </button>
      </form>
    </div>
  );
}
