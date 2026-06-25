import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth";
import { getDashboardHomeForRole } from "@/features/dashboard/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Бүртгүүлэх",
  description: "WeCargo хэрэглэгчийн бүртгэл үүсгэх.",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(getDashboardHomeForRole(user.role));

  return (
    <AuthCard
      title="Бүртгүүлэх"
      subtitle="WeCargo бүртгэл үүсгэж ачаагаа хянаарай."
      footer={
        <span className="text-[#7b8494]">
          Бүртгэлтэй юу?{" "}
          <Link href={ROUTES.login} className="font-black text-[#049b96] hover:opacity-80">
            Нэвтрэх
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
