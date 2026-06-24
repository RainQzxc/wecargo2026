import TrackingSearch from "./TrackingSearch";

export default function FinalCTA() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden border-t border-[#e5e5e5] bg-[#f7f7f7] py-20 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,187,180,0.12),transparent_45%),linear-gradient(180deg,#ffffff_0%,#f7f7f7_100%)]" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-[24px] border border-[#e5e5e5] bg-white p-5 text-center shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
          <h2 className="text-4xl font-black tracking-[-0.03em] text-[#111111] sm:text-5xl">
            Ачаагаа хянах уу?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#666666] sm:text-lg">
            Track code эсвэл утасны дугаараа оруулаад ачааныхаа төлөвийг шууд
            шалгаарай.
          </p>
          <div className="mt-8 text-left">
            <TrackingSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
