import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth";
import { getDashboardHomeForRole } from "@/features/dashboard/navigation";
import { AuthPortalPage } from "@/components/auth/AuthPortalPage";

export default async function ProductionLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(getDashboardHomeForRole(user.role));

  return (
    <AuthPortalPage
      variant="super-admin"
      eyebrow="Production access"
      title="Super admin control room"
      description="Системийн тохиргоо, эрх, тариф, audit trail зэрэг production түвшний нэвтрэлт."
      badge="Restricted"
      stats={[
        ["ROOT", "scope"],
        ["AUDIT", "logs"],
        ["SYS", "config"],
      ]}
    />
  );
}
