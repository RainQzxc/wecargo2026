import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://wecargo.mn";
const SITE_NAME = "WECARGO";
const TITLE = "WECARGO | Эрээн–Улаанбаатар ухаалаг карго";
const DESCRIPTION =
  "Эрээнээс Улаанбаатар хүртэлх ачаа тээвэр, онлайн хяналтын нэгдсэн систем. 2014 оноос хойш тасралтгүй үйлчилж байна.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | WECARGO",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["карго", "Эрээн", "Улаанбаатар", "ачаа тээвэр", "cargo", "WeCargo", "ачаа хянах"],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "mn_MN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/metadata.jpg", width: 960, height: 421, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/metadata.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" className={`${geist.variable} antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
