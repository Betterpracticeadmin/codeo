import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "CODAIX — Studio de création de sites web premium",
    template: "%s — CODAIX",
  },
  description: SITE.description,
  keywords: [
    "création site web",
    "agence web",
    "site vitrine",
    "site restaurant",
    "site artisan",
    "landing page",
    "développeur web",
    "Aix-en-Provence",
  ],
  authors: [{ name: "CODAIX" }],
  openGraph: {
    title: "CODAIX — Studio de création de sites web premium",
    description: SITE.description,
    url: SITE.url,
    siteName: "CODAIX",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CODAIX",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#16402b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased bg-green text-cream"
        suppressHydrationWarning
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
