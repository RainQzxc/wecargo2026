import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { updateProfile } from "../actions";

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";

export default async function CustomerProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const current = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const { ok } = await searchParams;

  const user = await db.user.findUnique({
    where: { id: current.id },
    include: {
      customerProfile: true,
      addresses: { orderBy: { isDefault: "desc" } },
    },
  });

  const displayName = user?.name ?? "Хэрэглэгч";
  const initial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-ink to-[#0c1413] p-6 text-white">
        <div className="grid size-16 place-items-center rounded-2xl bg-brand text-2xl font-black">
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black tracking-tight">{displayName}</h1>
          {user?.customerProfile?.customerCode && (
            <p className="mt-0.5 font-mono text-sm text-brand">{user.customerProfile.customerCode}</p>
          )}
        </div>
      </div>

      {ok && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Профайл шинэчлэгдлээ.
        </div>
      )}

      {/* Edit form */}
      <form action={updateProfile} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-ink">Хувийн мэдээлэл</h2>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">Нэр</label>
          <input id="name" name="name" defaultValue={user?.name ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">Утас</label>
          <input id="phone" name="phone" defaultValue={user?.phone ?? ""} className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Имэйл</label>
          <input
            defaultValue={user?.email ?? ""}
            disabled
            className={`${inputCls} cursor-not-allowed bg-neutral-50 text-ink-3`}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Хадгалах
        </button>
      </form>

      {/* Addresses */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-ink">Хүргэлтийн хаяг</h2>
        {!user || user.addresses.length === 0 ? (
          <p className="text-sm text-ink-3">Хадгалсан хаяг алга. Хүргэлт хүсэх үедээ хаягаа оруулна.</p>
        ) : (
          <div className="space-y-2">
            {user.addresses.map((a) => (
              <div key={a.id} className="rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">{a.label ?? "Хаяг"}</span>
                  {a.isDefault && (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                      Үндсэн
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-3">
                  {[a.city, a.district, a.khoroo, a.street, a.detail].filter(Boolean).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
