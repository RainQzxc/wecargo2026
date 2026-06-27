"use client";

import { motion } from "motion/react";

const steps = [
  {
    num: 1,
    title: "Бараагаа захиалах",
    desc: "Онлайн дэлгүүрээс өөрөө захиалж хаяглах эсвэл манай линк захиалгаар дамжуулан авна.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "трак кодоо бүртгүүлэх",
    desc: "Худалдагчаас илгээсэн барааны трак кодыг өөрийн бүртгэлд хадгалаарай.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h1.5v15h-1.5v-15zm3 0h.75v15h-.75v-15zm2.25 0h1.5v15h-1.5v-15zm3 0h.75v15h-.75v-15zm2.25 0h1.5v15h-1.5v-15zm3 0h.75v15h-.75v-15z" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Төлөвөө хянах",
    desc: "трак кодоо манай цахим хуудсанд оруулан, ачаа хаана явааг шууд хянана.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Салбараас авах эсвэл хүргүүлэх",
    desc: "Бараа ирсэн мэдэгдэл авмагц салбараас өөрөө авах эсвэл хаяг дээрээ хүргүүлнэ.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    last: true,
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-[#f7f7f7] py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 bg-[#06bbb4]/10 text-[#06bbb4] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06bbb4]" />
            Зааварчилгаа
          </span>
        </div>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1d1d1f] tracking-tight">
            Ачаагаа хүлээн авахад ердөө{" "}
            <span className="text-[#06bbb4]">дөрвөн алхам.</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {/* Desktop dashed flow line */}
          <div
            className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px -z-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #06bbb4 0%, #06bbb4 75%, #fe0000 100%)",
              opacity: 0.35,
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Mobile vertical connector */}
              {!step.last && (
                <div className="sm:hidden absolute left-7 top-14 bottom-[-20px] w-px bg-[#06bbb4]/25" />
              )}

              <div className="relative flex sm:block gap-4 bg-white rounded-2xl p-6 border border-[#e5e5e5] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#06bbb4]/40 transition-all duration-300 h-full">
                <div className="relative shrink-0 sm:mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      step.last
                        ? "bg-[#fe0000] shadow-[#fe0000]/30"
                        : "bg-[#06bbb4] shadow-[#06bbb4]/30"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center text-[11px] font-bold ${
                      step.last
                        ? "border-[#fe0000] text-[#fe0000]"
                        : "border-[#06bbb4] text-[#06bbb4]"
                    }`}
                  >
                    {step.num}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1d1d1f] mb-1.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[#6e6e73] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
