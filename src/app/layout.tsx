import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WECARGO | Эрээн–Улаанбаатар ухаалаг карго",
  description:
    "Эрээнээс Улаанбаатар хүртэлх ачаа тээвэр, онлайн хяналтын нэгдсэн систем. 2014 оноос хойш тасралтгүй үйлчилж байна.",
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
