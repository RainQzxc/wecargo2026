import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth";
import { getDashboardHomeForRole } from "@/features/dashboard/navigation";
import { AuthPortalPage } from "@/components/auth/AuthPortalPage";

export default async function CourierLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(getDashboardHomeForRole(user.role));

  return (
    <AuthPortalPage
      variant="courier"
      eyebrow="Courier app"
      title="Хүргэлтийн маршрут"
      description="Өдрийн хүргэлт, дууссан даалгавар, хүлээлгэн өгөлтийн мэдээлэлд нэвтрэх хэсэг."
      badge="Field access"
      stats={[
        ["RUN", "route"],
        ["SCAN", "handoff"],
        ["DONE", "proof"],
      ]}
    />
  );
}
