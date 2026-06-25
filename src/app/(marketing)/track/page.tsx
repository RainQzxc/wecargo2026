import { db } from "@/server/db";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";

const STATUS_COLORS: Record<string, string> = {
  REGISTERED:"bg-neutral-100 text-neutral-600",
  RECEIVED_AT_EREEN:"bg-blue-50 text-blue-700",
  MEASURED:"bg-blue-50 text-blue-700",
  PRICED:"bg-indigo-50 text-indigo-700",
  READY_FOR_LOADING:"bg-amber-50 text-amber-700",
  LOADED:"bg-amber-50 text-amber-700",
  DEPARTED_EREEN:"bg-orange-50 text-orange-700",
  IN_TRANSIT:"bg-orange-50 text-orange-700",
  ARRIVED_ULAANBAATAR:"bg-teal-50 text-teal-700",
  SORTING:"bg-teal-50 text-teal-700",
  READY_FOR_PICKUP:"bg-green-50 text-green-700",
  DELIVERY_REQUESTED:"bg-purple-50 text-purple-700",
  OUT_FOR_DELIVERY:"bg-purple-50 text-purple-700",
  DELIVERED:"bg-green-50 text-green-700",
  UNIDENTIFIED:"bg-red-50 text-red-700",
  ISSUE:"bg-red-50 text-red-700",
  CANCELLED:"bg-red-50 text-red-700",
};

export default async function PublicTrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const query = code?.trim().toUpperCase();

  const parcel = query
    ? await db.parcel.findFirst({
        where: {
          OR: [
            { trackCodeOriginal: query },
            { publicCode: query },
          ],
          deletedAt: null,
        },
        include: {
          events: { orderBy: { createdAt:"desc" }, take: 15 },
        },
      })
    : null;

  const statusClass = parcel ? (STATUS_COLORS[parcel.status] ?? "bg-neutral-100 text-neutral-600") : "";

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Hero / Search */}
      <section className="relative overflow-hidden border-b border-[#e5e5e5] bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,187,180,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-flex rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">Бараа хянах</span>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-[#111111] sm:text-5xl">
            Ачаагаа хянаарай
          </h1>
          <p className="mt-3 text-base text-[#666666]">Трак код эсвэл нийтийн код оруулна уу.</p>

          <form method="GET" className="mt-8 flex gap-2">
            <input
              type="text"
              name="code"
              defaultValue={query ?? ""}
              placeholder="Трак код…"
              className="flex-1 rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-3 text-sm text-[#111111] placeholder-[#aaa] outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20"
            />
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-[#06bbb4] px-6 text-sm font-black text-white transition-colors hover:bg-[#06bbb4]/90">
              Хайх
            </button>
          </form>
        </div>
      </section>

      {/* Result */}
      {query && (
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {!parcel ? (
              <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#f7f7f7]">
                  <svg className="size-7 text-[#bbb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="font-black text-[#111111]">Бараа олдсонгүй</h2>
                <p className="mt-2 text-sm text-[#666666]"><span className="font-bold text-[#111111]">&ldquo;{query}&rdquo;</span> кодтой бараа системд байхгүй байна.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status card */}
                <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[#aaa]">Трак код</p>
                      <p className="mt-0.5 font-mono text-xl font-black text-[#111111]">{parcel.publicCode ?? parcel.trackCodeOriginal}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${statusClass}`}>
                      {PARCEL_STATUS_LABELS_MN[parcel.status] ?? parcel.status}
                    </span>
                  </div>
                  {(parcel.customerName || parcel.customerPhone) && (
                    <div className="mt-4 border-t border-[#f0f0f0] pt-4 text-sm text-[#666666]">
                      {parcel.customerName && <p><span className="font-semibold text-[#333]">Нэр:</span> {parcel.customerName}</p>}
                      {parcel.customerPhone && <p className="mt-0.5"><span className="font-semibold text-[#333]">Утас:</span> {parcel.customerPhone}</p>}
                    </div>
                  )}
                </div>

                {/* Events */}
                {parcel.events.length > 0 && (
                  <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-6">
                    <h2 className="mb-4 font-black text-[#111111]">Хөдөлгөөний түүх</h2>
                    <ul className="space-y-4">
                      {parcel.events.map((ev: { id:string; status:string; messageMn?:string|null; locationText?:string|null; createdAt:Date }, i: number) => (
                        <li key={ev.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`size-2.5 rounded-full mt-1.5 shrink-0 ${i === 0 ? "bg-[#06bbb4]" : "bg-[#ddd]"}`} />
                            {i < parcel.events.length - 1 && <div className="mt-1 w-px flex-1 bg-[#e5e5e5]" />}
                          </div>
                          <div className="pb-4">
                            <p className="text-xs font-black uppercase tracking-widest text-[#aaa]">{new Date(ev.createdAt).toLocaleString("mn-MN")}</p>
                            {ev.messageMn && <p className="mt-0.5 text-sm font-semibold text-[#111111]">{ev.messageMn}</p>}
                            {ev.locationText && <p className="text-xs text-[#666666] mt-0.5">{ev.locationText}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
