import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Barlow, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "./providers";
import { site } from "@/lib/site";
import { brandCore } from "@/lib/seo-keywords";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-chakra",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Sparepart & Aksesoris Mobil Cina & Listrik`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: brandCore,
  openGraph: {
    title: `${site.name} — Sparepart & Aksesoris Mobil Cina & Listrik`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Sparepart & Aksesoris Mobil Cina & Listrik`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: site.url },
  other: {
    "geo.region": site.geo.region,
    "geo.placename": site.geo.placename,
    "geo.position": `${site.geo.latitude};${site.geo.longitude}`,
    ICBM: `${site.geo.latitude}, ${site.geo.longitude}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#141416",
};

/**
 * GA4 measurement ID. Di-inline saat build (NEXT_PUBLIC_*), jadi wajib ada
 * sebagai build ARG di Dockerfile/compose — bukan sekadar env runtime.
 * Kosong = tag tidak dirender sama sekali (perilaku default di lokal/dev,
 * supaya traffic development tidak mengotori laporan produksi).
 */
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${chakra.variable} ${barlow.variable} ${barlowCondensed.variable} scroll-smooth`}
    >
      <body className="bg-bg font-sans text-fg antialiased">
        <Providers>{children}</Providers>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
