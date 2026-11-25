import type { Metadata } from "next";
import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Banzai 2026 | PWO Landing Base",
  description:
    "Banzai 2026 — Principal Warfare Officer E-References, sekolah lanjutan TNI Angkatan Laut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#071321" />
      </head>
      <body>
        <Script
          src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"
          strategy="afterInteractive"
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
