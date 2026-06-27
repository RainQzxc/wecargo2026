"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Б. Энхжин",
    role: "Онлайн худалдаа эрхлэгч",
    quote:
      "Захиалгын дугаар, ирсэн ачаа, төлбөрөө нэг дор харахад маш амар болсон. Утасдаж лавлах зүйл багассан.",
    initials: "ЭЖ",
  },
  {
    name: "Г. Мөнх-Оргил",
    role: "Тогтмол үйлчлүүлэгч",
    quote:
      "Эрээнээс ирж байгаа ачаагаа алхам бүрээр нь шалгадаг болсон. Хэзээ авах нь тодорхой байдаг нь хамгийн хэрэгтэй.",
    initials: "МО",
  },
  {
    name: "С. Номин",
    role: "Жижиг бизнес",
    quote:
      "Link order өгөөд явцыг нь dashboard дээрээсээ харах нь цаг их хэмнэдэг. Интерфэйс нь ойлгомжтой.",
    initials: "Н",
  },
];

export function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const testimonial = testimonials[active];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const goNext = () => setActive((current) => (current + 1) % testimonials.length);
  const goPrev = () =>
    setActive((current) => (current === 0 ? testimonials.length - 1 : current - 1));

  const finishDrag = (clientX: number) => {
    if (dragStart === null) return;
    const delta = clientX - dragStart;
    if (Math.abs(delta) > 42) {
      if (delta < 0) goNext();
      else goPrev();
    }
    setDragStart(null);
  };

  return (
    <section
      aria-label="Хэрэглэгчдийн сэтгэгдэл"
      onPointerDown={(event) => setDragStart(event.clientX)}
      onPointerUp={(event) => finishDrag(event.clientX)}
      onPointerCancel={() => setDragStart(null)}
      className="relative flex min-h-[520px] cursor-grab touch-pan-y select-none flex-col justify-center overflow-hidden rounded-[28px] border border-[#0f2d2b]/10 bg-[#101515] p-6 text-white shadow-[0_28px_90px_rgba(8,24,24,0.16)] active:cursor-grabbing sm:p-10 lg:min-h-full"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(6,187,180,0.22),transparent_34%),radial-gradient(circle_at_90%_90%,rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-[560px]">
        <div className="text-[92px] font-semibold leading-none text-white/10 sm:text-[128px]">
          “
        </div>
        <p className="-mt-10 text-3xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-4xl">
          {testimonial.quote}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-full bg-[#06bbb4] text-sm font-semibold text-[#071414]">
            {testimonial.initials}
          </div>
          <div>
            <h3 className="font-semibold tracking-[-0.02em]">{testimonial.name}</h3>
            <p className="mt-1 text-sm font-semibold text-white/55">
              {testimonial.role}
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <div className="flex gap-2" aria-label="Сэтгэгдэл сонгох">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-label={`${index + 1}-р сэтгэгдэл`}
                aria-current={active === index}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-[#06bbb4]/30 ${
                  active === index ? "w-9 bg-[#06bbb4]" : "w-2.5 bg-white/25"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-white/35">
            Drag
          </p>
        </div>
      </div>
    </section>
  );
}
