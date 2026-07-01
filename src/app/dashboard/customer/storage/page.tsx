import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";

const STORAGE_LABELS: Record<string, string> = {
  REQUESTED: "Хүсэлт",
  APPROVED: "Зөвшөөрсөн",
  ACTIVE: "Хадгалж байна",
  STORED: "Хадгалж байна",
  RELEASED: "Гаргасан",
  EXPIRED: "Хугацаа дууссан",
  CANCELLED: "Цуцлагдсан",
};

const STORAGE_VARIANT: Record<string, string> = {
  REQUESTED: "bg-neutral-100 text-ink-3",
  APPROVED: "bg-blue-50 text-blue-700",
  ACTIVE: "bg-brand/10 text-brand",
  STORED: "bg-brand/10 text-brand",
  RELEASED: "bg-green-50 text-green-700",
  EXPIRED: "bg-amber-50 text-amber-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function CustomerStoragePage() {
  const user = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const requests = await db.storageRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      status: true,
      days: true,
      feeAmount: true,
      currency: true,
      createdAt: true,
      parcel: { select: { publicCode: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-ink to-[#0c1413] p-6 text-white">
        <h1 className="text-2xl font-black tracking-tight">Хадгалалт</h1>
        <p className="mt-1 text-sm text-white/60">Агуулахад хадгалуулж буй бараа</p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-ink-3">Хадгалалтын хүсэлт алга</p>
          <p className="mx-auto mt-2 max-w-sm text-xs text-ink-3">
            Барааг хадгалуулах бол{" "}
            <Link href="/dashboard/customer/parcels" className="font-semibold text-brand hover:underline">
              бараа
            </Link>{" "}
            хэсгээс эсвэл агуулахтай холбогдоно уу.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-ink">
                  {r.parcel.publicCode.slice(-8).toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    STORAGE_VARIANT[r.status] ?? "bg-neutral-100 text-ink-3"
                  }`}
                >
                  {STORAGE_LABELS[r.status] ?? r.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
                {r.days != null && <span>{r.days} хоног</span>}
                {r.feeAmount != null && (
                  <span>
                    {Number(r.feeAmount).toLocaleString("mn-MN")} {r.currency}
                  </span>
                )}
                <span className="ml-auto">{new Date(r.createdAt).toLocaleDateString("mn-MN")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
