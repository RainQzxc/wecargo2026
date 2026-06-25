import Link from "next/link";
import { requireRole } from "@/features/auth";
import { ROLES } from "@/constants/roles";
import { LinkOrderForm } from "@/features/customer/LinkOrderForm";
import { ROUTES } from "@/constants/routes";

export default async function CustomerNewLinkOrderPage() {
  await requireRole(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN);
  const base = `${ROUTES.dashboard.customer}/link-orders`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href={base} className="text-[13px] text-ink-3 hover:text-brand transition-colors">Линк захиалга</Link>
          <span className="text-ink-3 text-[13px]">/</span>
          <span className="text-[13px] text-ink">Шинэ</span>
        </div>
        <h1 className="text-2xl font-bold text-ink">Шинэ линк захиалга</h1>
        <p className="text-sm text-ink-3 mt-1">Хятад дэлгүүрийн линкээ оруулбал бид захиалж, тээвэрлэнэ.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <LinkOrderForm />
      </div>
    </div>
  );
}
