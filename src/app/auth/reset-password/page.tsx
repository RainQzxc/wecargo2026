import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Нууц үг шинэчлэх",
  description: "WeCargo бүртгэлийн шинэ нууц үг тохируулах.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthCard
        title="Холбоос буруу байна"
        subtitle="Энэ холбоос хүчингүй эсвэл дутуу байна."
        footer={
          <Link href={ROUTES.forgotPassword} className="font-black text-[#049b96] hover:opacity-80">
            Шинэ холбоос хүсэх
          </Link>
        }
      >
        <p className="text-sm leading-6 text-[#667085]">
          Нууц үг сэргээх холбоос дутуу байна. Дахин хүсэлт илгээнэ үү.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Шинэ нууц үг" subtitle="Шинэ нууц үгээ оруулна уу.">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
