import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { StorageRequestForm } from "@/features/customer/StorageRequestForm";
import type { ParcelStatus } from "@prisma/client";

const STORABLE: ParcelStatus[] = ["READY_FOR_PICKUP", "ARRIVED_ULAANBAATAR", "SORTING"];

const STORAGE_LABELS: Record<string, string> = {
  REQUESTED: "Хүсэлт",
  APPROVED: "Зөвшөөрсөн",
  ACTIVE: "Идэвхтэй",
  COMPLETED: "Дууссан",
  CANCELLED: "Цуцалсан",
};
const STORAGE_CLASS: Record<string, string> = {
  REQUESTED: "bg-neutral-100 text-ink-3",
  APPROVED: "bg-blue-50 text-blue-700",
  ACTIVE: "bg-brand/10 text-brand",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function CustomerStoragePage() {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const [storable, requests] = await Promise.all([
    db.parcel.findMany({
      where: { customerId: user.id, deletedAt: null, status: { in: STORABLE } },
      orderBy: { updatedAt: "desc" },
      select: { id: true, publicCode: true, trackCodeOriginal: true },
    }),
    db.storageRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        days: true,
        createdAt: true,
        parcel: { select: { publicCode: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Хадгалалт</h1>
        <p className="text-sm text-ink-3 mt-1">Барааг агуулахад хадгалуулах хүсэлт</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Шинэ хадгалалтын хүсэлт</h2>
          <StorageRequestForm parcels={storable} />
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-ink">Миний хүсэлтүүд</h2>
          </div>
          {requests.length === 0 ? (
            <div className="px-5 py-12 text-center text-ink-3 text-sm">Хүсэлт алга байна</div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {requests.map((r) => (
                <li key={r.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-ink-2">{r.parcel.publicCode.slice(-8).toUpperCase()}</p>
                    {r.days != null && <p className="text-xs text-ink-3">{r.days} хоног</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${STORAGE_CLASS[r.status] ?? "bg-neutral-100 text-ink-3"}`}>
                      {STORAGE_LABELS[r.status] ?? r.status}
                    </span>
                    <time className="text-[11px] text-ink-3">{new Date(r.createdAt).toLocaleDateString("mn-MN")}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
