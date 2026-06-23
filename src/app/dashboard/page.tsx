import { redirect } from "next/navigation";
import { requireAuth } from "@/features/auth";
import { getDashboardHomeForRole } from "@/features/dashboard/navigation";

/**
 * Dashboard entry point. Sends each authenticated user to the dashboard root
 * for their role.
 */
export default async function DashboardRedirectPage() {
  const user = await requireAuth();
  redirect(getDashboardHomeForRole(user.role));
}
