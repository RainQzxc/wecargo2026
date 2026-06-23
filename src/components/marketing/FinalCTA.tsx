import TrackingSearch from "./TrackingSearch";

export default function FinalCTA() {
  return (
    <section className="relative bg-[#f7f7f7] min-h-[60vh] lg:min-h-[70vh] flex items-center py-20 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(90% 90% at 50% 0%, rgba(6,187,180,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#111111] tracking-tight mb-3">
            Ачаагаа хянах уу?
          </h2>
          <p className="text-[#666666] text-lg mb-10">
            Track code эсвэл утасны дугаараа оруулаад ачааныхаа төлөвийг шууд
            шалгаарай.
          </p>
          <div className="text-left">
            <TrackingSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
