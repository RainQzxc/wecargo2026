import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Нууц үг сэргээх",
  description: "WeCargo бүртгэлийн нууц үгээ сэргээх.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Нууц үг сэргээх"
      subtitle="Имэйл хаягаа оруулна уу. Бид сэргээх холбоос илгээнэ."
      footer={
        <Link href={ROUTES.login} className="font-black text-[#049b96] hover:opacity-80">
          ← Нэвтрэх хуудас руу буцах
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
