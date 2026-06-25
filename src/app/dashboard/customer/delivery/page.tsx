import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { DeliveryStatusBadge } from "@/components/dashboard/StatusBadge";
import { DeliveryRequestForm } from "@/features/customer/DeliveryRequestForm";
import type { ParcelStatus } from "@prisma/client";

const DELIVERABLE: ParcelStatus[] = ["READY_FOR_PICKUP", "ARRIVED_ULAANBAATAR", "SORTING"];

export default async function CustomerDeliveryPage() {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const [deliverable, requests] = await Promise.all([
    db.parcel.findMany({
      where: { customerId: user.id, deletedAt: null, status: { in: DELIVERABLE } },
      orderBy: { updatedAt: "desc" },
      select: { id: true, publicCode: true, trackCodeOriginal: true },
    }),
    db.deliveryRequest.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        recipientName: true,
        addressDetail: true,
        createdAt: true,
        parcel: { select: { publicCode: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Хүргэлт</h1>
        <p className="text-sm text-ink-3 mt-1">Авахад бэлэн барааг гэрт хүргүүлэх хүсэлт</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Шинэ хүргэлтийн хүсэлт</h2>
          <DeliveryRequestForm parcels={deliverable} />
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
                <li key={r.id} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-ink-2">{r.parcel.publicCode.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-ink truncate">{r.recipientName ?? "—"}</p>
                    <p className="text-xs text-ink-3 truncate">{r.addressDetail}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <DeliveryStatusBadge status={r.status} />
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
