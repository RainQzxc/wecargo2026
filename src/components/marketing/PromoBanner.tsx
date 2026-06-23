import Link from "next/link";

export interface BannerData {
  imageUrl?: string;
  alt?: string;
  href?: string;
}

const defaultBanner: BannerData = {
  imageUrl: "",
  alt: "WECARGO зар",
  href: "/link-order",
};

export default function PromoBanner({
  banner = defaultBanner,
}: {
  banner?: BannerData;
}) {
  // Image only. Fixed aspect 955:273. No text overlay.
  const inner = banner.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={banner.imageUrl}
      alt={banner.alt ?? ""}
      className="block w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
      <span className="text-[#999999] text-sm font-medium">955 × 273</span>
    </div>
  );

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[955/273] w-full overflow-hidden rounded-3xl">
          {banner.href ? (
            <Link href={banner.href} className="block w-full h-full">
              {inner}
            </Link>
          ) : (
            inner
          )}
        </div>
      </div>
    </section>
  );
}
