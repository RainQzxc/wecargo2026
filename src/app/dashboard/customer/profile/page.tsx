import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { db } from "@/server/db";
import { ProfileForm } from "@/features/customer/ProfileForm";

export default async function CustomerProfilePage() {
  const sessionUser = await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

  const user = await db.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      name: true,
      phone: true,
      email: true,
      createdAt: true,
      customerProfile: { select: { customerCode: true } },
      addresses: {
        orderBy: { isDefault: "desc" },
        select: { id: true, label: true, city: true, district: true, detail: true, isDefault: true },
      },
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Профайл</h1>
        <p className="text-sm text-ink-3 mt-1">Хувийн мэдээллээ шинэчлэх</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Мэдээлэл</h2>
          <ProfileForm
            defaultName={user.name ?? ""}
            defaultPhone={user.phone ?? ""}
            email={user.email ?? ""}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-ink mb-3">Бүртгэл</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-3">Хэрэглэгчийн код</dt>
                <dd className="font-mono text-ink font-medium">{user.customerProfile?.customerCode ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-3">Бүртгүүлсэн</dt>
                <dd className="text-ink font-medium">{new Date(user.createdAt).toLocaleDateString("mn-MN")}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-ink mb-3">Хаягууд</h2>
            {user.addresses.length === 0 ? (
              <p className="text-sm text-ink-3">Хадгалсан хаяг алга. Хүргэлт хүсэх үед хаягаа оруулна.</p>
            ) : (
              <ul className="space-y-2">
                {user.addresses.map((a) => (
                  <li key={a.id} className="rounded-lg border border-neutral-100 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-medium">{a.label ?? "Хаяг"}</span>
                      {a.isDefault && <span className="text-[10px] bg-brand/10 text-brand rounded px-1.5 py-0.5 font-semibold">Үндсэн</span>}
                    </div>
                    <p className="text-xs text-ink-3 mt-0.5">
                      {[a.city, a.district, a.detail].filter(Boolean).join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
