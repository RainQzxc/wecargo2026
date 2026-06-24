import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth";
import { getDashboardHomeForRole } from "@/features/dashboard/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(getDashboardHomeForRole(user.role));

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(6,187,180,0.12),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7f7f7_100%)]" />

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[1440px] grid-cols-1 px-5 py-6 sm:px-6 lg:grid-cols-[1fr_480px] lg:gap-16 lg:px-16 lg:py-10">
        <section className="hidden flex-col justify-between py-6 lg:flex">
          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30"
          >
            <span className="text-2xl font-black tracking-[-0.03em] text-[#111111]">
              WE<span className="text-[#06bbb4]">CARGO</span>
            </span>
          </Link>

          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3.5 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#06bbb4]" />
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
                Аюулгүй нэвтрэлт
              </span>
            </div>
            <h1 className="text-6xl font-black leading-[0.98] tracking-[-0.04em] text-[#111111]">
              WECARGO нэвтрэх
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-[#333333]">
              Ачаа, захиалга, хүргэлтийн мэдээллээ нэг дороос удирдаарай.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 overflow-hidden rounded-[20px] border border-[#e5e5e5] bg-white shadow-sm">
            {[
              ["24/7", "хяналт"],
              ["Эрээн–УБ", "тээвэр"],
              ["2014", "оноос хойш"],
            ].map(([value, label], index) => (
              <div
                key={value}
                className={`p-5 ${index > 0 ? "border-l border-[#e5e5e5]" : ""}`}
              >
                <p className="text-lg font-black text-[#111111]">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#666666]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[calc(100svh-48px)] items-center justify-center lg:min-h-0">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 lg:hidden"
            >
              <span className="text-xl font-black tracking-[-0.03em] text-[#111111]">
                WE<span className="text-[#06bbb4]">CARGO</span>
              </span>
            </Link>

            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-8">
              <div className="mb-7">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
                  Нэвтрэх
                </p>
                <h2 className="text-3xl font-black tracking-[-0.03em] text-[#111111] sm:text-4xl">
                  Тавтай морил
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Бүртгэлтэй имэйл эсвэл утасны дугаараа ашиглан нэвтэрнэ үү.
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
