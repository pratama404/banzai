import type { Metadata } from "next";
import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://e-librarypwo2026.com"),
  title: {
    default: "Banzai 2026 | Principal Warfare Officer E-References",
    template: "%s | PWO Banzai 2026",
  },
  description:
    "Principal Warfare Officer (PWO) Class of 2026 — Digital E-References library, tactical curricula, and naval warfare doctrine.",
  icons: {
    icon: "/assets/logo/logo-pwo.png",
    apple: "/assets/logo/logo-pwo.png",
  },
  openGraph: {
    type: "website",
    title: "Banzai 2026 | Principal Warfare Officer E-References",
    description:
      "Tactical naval warfare E-References library for Principal Warfare Officer Class of 2026 — Kihaku · Seigeki · Hisshou.",
    images: [
      {
        url: "/assets/banzai-cover.jpg",
        width: 1200,
        height: 630,
        alt: "PWO Banzai 2026 Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Banzai 2026 | Principal Warfare Officer E-References",
    description:
      "Tactical naval warfare E-References library for Principal Warfare Officer Class of 2026.",
    images: ["/assets/banzai-cover.jpg"],
  },
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
