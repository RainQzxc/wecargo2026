"use client";

import { useState } from "react";

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#06bbb4]/10 text-[#06bbb4] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
          {label}
        </p>
        <div className="space-y-0.5">{children}</div>
      </div>
    </div>
  );
}

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="bg-[#f7f7f7] py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 bg-[#06bbb4]/10 text-[#06bbb4] text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06bbb4]" />
            Холбоо барих
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight">
            Бидэнтэй <span className="text-[#06bbb4]">холбогдоорой</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-7 lg:p-8 border border-[#e5e5e5]">
              <h3 className="text-lg font-bold text-[#111111] mb-6">
                Улаанбаатар
              </h3>
              <div className="space-y-6">
                <Row icon={<PhoneIcon />} label="Утас">
                  <a
                    href="tel:88104640"
                    className="block text-[#111111] font-medium hover:text-[#06bbb4] transition-colors"
                  >
                    8810 4640
                  </a>
                </Row>
                <Row icon={<MailIcon />} label="Имэйл">
                  <a
                    href="mailto:info@cargoo.mn"
                    className="block text-[#111111] font-medium hover:text-[#06bbb4] transition-colors"
                  >
                    info@cargoo.mn
                  </a>
                </Row>
                <Row icon={<PinIcon />} label="Хаяг">
                  <p className="text-[#333333] leading-relaxed">
                    Улаанбаатар, Монгол
                  </p>
                </Row>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 lg:p-8 border border-[#e5e5e5]">
              <h3 className="text-lg font-bold text-[#111111] mb-6">Эрээн</h3>
              <div className="space-y-6">
                <Row icon={<PhoneIcon />} label="Утас">
                  <a
                    href="tel:15148615407"
                    className="block text-[#111111] font-medium hover:text-[#06bbb4] transition-colors"
                  >
                    15148615407
                  </a>
                </Row>
                <Row icon={<PinIcon />} label="Хаяг">
                  <p className="text-[#333333] leading-relaxed">
                    内蒙古锡林郭勒盟二连浩特市环宇商贸城五号楼125号
                    业顺额尔敦商贸有限公司
                  </p>
                </Row>
              </div>
            </div>
          </div>

          {/* Message form */}
          <div className="bg-white rounded-3xl p-7 lg:p-8 border border-[#e5e5e5]">
            <h3 className="text-xl font-bold text-[#111111] mb-6">
              Мессеж илгээх
            </h3>

            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-[#06bbb4]/10 text-[#06bbb4] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-[#111111] font-semibold">
                  Таны мессеж илгээгдлээ.
                </p>
                <p className="text-[#666666] text-sm mt-1">
                  Бид тантай удахгүй холбогдоно.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="ct-name" className="sr-only">
                    Таны нэр
                  </label>
                  <input
                    id="ct-name"
                    type="text"
                    required
                    placeholder="Таны нэр"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f7f7f7] border border-[#e5e5e5] text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20 transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ct-phone" className="sr-only">
                    Утасны дугаар
                  </label>
                  <input
                    id="ct-phone"
                    type="tel"
                    required
                    placeholder="Утасны дугаар"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f7f7f7] border border-[#e5e5e5] text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20 transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ct-msg" className="sr-only">
                    Таны асуулт, санал
                  </label>
                  <textarea
                    id="ct-msg"
                    required
                    rows={4}
                    placeholder="Таны асуулт, санал..."
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f7f7f7] border border-[#e5e5e5] text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20 transition-all text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[48px] px-6 py-3.5 bg-[#fe0000] hover:bg-[#fe0000]/90 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Илгээх
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
