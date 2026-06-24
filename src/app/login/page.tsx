import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth";
import { getDashboardHomeForRole } from "@/features/dashboard/navigation";
import { AuthPortalPage } from "@/components/auth/AuthPortalPage";

export default async function CustomerLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(getDashboardHomeForRole(user.role));

  return (
    <AuthPortalPage
      variant="customer"
      eyebrow="Customer login"
      title="WECARGO хэрэглэгч"
      description="Баталгаажсан бүртгэлээ ашиглан нэвтэрнэ үү."
      badge="Customer portal"
      stats={[
        ["24/7", "tracking"],
        ["E-U", "route"],
        ["ID", "profile"],
      ]}
      showRegister
    />
  );
}
