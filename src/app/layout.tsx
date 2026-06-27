import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  // The site is Mongolian (Cyrillic); without this subset every word falls back
  // to Arial. `swap` avoids invisible text while the font loads.
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Set NEXT_PUBLIC_SITE_URL to the production domain in Vercel for correct
// absolute URLs in Open Graph / canonical / sitemap.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wecargo2026.vercel.app";

const title = "WECARGO | Эрээн–Улаанбаатар ухаалаг карго";
const description =
  "Эрээнээс Улаанбаатар хүртэлх ачаа тээвэр, онлайн хяналтын нэгдсэн систем. 2014 оноос хойш тасралтгүй үйлчилж байна.";
const ogImage = "/logo wecargo for black bg.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | WECARGO" },
  description,
  applicationName: "WECARGO",
  keywords: [
    "WECARGO",
    "карго",
    "Эрээн",
    "Улаанбаатар",
    "ачаа тээвэр",
    "ачаа хянах",
    "линк захиалга",
    "track code",
    "Хятадаас ачаа",
  ],
  authors: [{ name: "WECARGO" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "WECARGO",
    locale: "mn_MN",
    url: siteUrl,
    title,
    description,
    images: [{ url: ogImage, alt: "WECARGO" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WECARGO",
  url: siteUrl,
  logo: `${siteUrl}/logo wecargo for white bg.png`,
  foundingDate: "2014",
  areaServed: ["MN", "CN"],
  description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" className={`${geist.variable} antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-screen">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
