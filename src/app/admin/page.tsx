import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth";
import { getDashboardHomeForRole } from "@/features/dashboard/navigation";
import { AuthPortalPage } from "@/components/auth/AuthPortalPage";

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(getDashboardHomeForRole(user.role));

  return (
    <AuthPortalPage
      variant="admin"
      eyebrow="Admin console"
      title="Өдөр тутмын карго удирдлага"
      description="Ачаа, batch, delivery, link order-уудыг нэг console-оос хянах ажилтны нэвтрэлт."
      badge="Operations access"
      stats={[
        ["OPS", "console"],
        ["LIVE", "queues"],
        ["UB", "handoff"],
      ]}
    />
  );
}
