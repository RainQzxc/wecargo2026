import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { requestDelivery } from "../actions";

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";

export default async function CustomerDeliveryPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const { ok, error } = await searchParams;

  const [requests, readyParcels] = await Promise.all([
    db.deliveryRequest.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        status: true,
        addressDetail: true,
        city: true,
        district: true,
        createdAt: true,
        parcel: { select: { publicCode: true } },
      },
    }),
    db.parcel.findMany({
      where: { customerId: user.id, deletedAt: null, status: "READY_FOR_PICKUP" },
      orderBy: { updatedAt: "desc" },
      select: { id: true, publicCode: true, description: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-ink to-[#0c1413] p-6 text-white">
        <h1 className="text-2xl font-black tracking-tight">Хүргэлт</h1>
        <p className="mt-1 text-sm text-white/60">Бэлэн болсон бараагаа гэрт хүргүүлэх</p>
      </div>

      {ok && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Хүргэлтийн хүсэлт амжилттай илгээгдлээ.
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Хүсэлт илгээхэд алдаа гарлаа. Бараа болон хаягаа шалгана уу.
        </div>
      )}

      {/* Request form */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink">Хүргэлт хүсэх</h2>
        {readyParcels.length === 0 ? (
          <p className="text-sm text-ink-3">Хүргүүлэхэд бэлэн бараа алга байна.</p>
        ) : (
          <form action={requestDelivery} className="space-y-4">
            <div>
              <label htmlFor="parcelId" className="mb-1.5 block text-sm font-medium text-ink">Бараа сонгох</label>
              <select id="parcelId" name="parcelId" required className={inputCls}>
                {readyParcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.publicCode.slice(-8).toUpperCase()}
                    {p.description ? ` — ${p.description}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-ink">Хот/Аймаг</label>
                <input id="city" name="city" placeholder="Улаанбаатар" className={inputCls} />
              </div>
              <div>
                <label htmlFor="district" className="mb-1.5 block text-sm font-medium text-ink">Дүүрэг</label>
                <input id="district" name="district" placeholder="Хан-Уул" className={inputCls} />
              </div>
            </div>
            <div>
              <label htmlFor="addressDetail" className="mb-1.5 block text-sm font-medium text-ink">
                Дэлгэрэнгүй хаяг <span className="text-red-500">*</span>
              </label>
              <input id="addressDetail" name="addressDetail" required placeholder="Хороо, байр, тоот…" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="recipientPhone" className="mb-1.5 block text-sm font-medium text-ink">Утас</label>
                <input id="recipientPhone" name="recipientPhone" defaultValue={user.phone ?? ""} className={inputCls} />
              </div>
              <div>
                <label htmlFor="preferredTime" className="mb-1.5 block text-sm font-medium text-ink">Тохирох цаг</label>
                <input id="preferredTime" name="preferredTime" placeholder="Заавал биш" className={inputCls} />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
            >
              Хүргэлт хүсэх
            </button>
          </form>
        )}
      </div>

      {/* Requests list */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Миний хүсэлтүүд</h2>
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white py-12 text-center text-sm text-ink-3">
            Хүсэлт алга
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-ink">
                    {r.parcel.publicCode.slice(-8).toUpperCase()}
                  </span>
                  <DeliveryStatusBadge status={r.status} />
                </div>
                <p className="mt-2 text-sm text-ink-2">
                  {[r.city, r.district, r.addressDetail].filter(Boolean).join(", ")}
                </p>
                <p className="mt-1 text-xs text-ink-3">
                  {new Date(r.createdAt).toLocaleString("mn-MN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
