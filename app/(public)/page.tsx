import type { Metadata } from "next";
import { HeroSection } from "@/features/home/components/hero-section";
import { CategorySection } from "@/features/home/components/category-section";
import { FeaturedProductsSection } from "@/features/home/components/featured-products-section";
import { NewsHighlightSection } from "@/features/home/components/news-highlight-section";
import { WhyUsSection } from "@/features/home/components/why-us-section";
import { AboutBlogSection } from "@/features/home/components/about-blog-section";
import { SocialProofSection } from "@/features/home/components/social-proof-section";
import { Reveal } from "@/components/common/reveal";
import { site } from "@/lib/site";
import { brandCore, keywordsFor } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title: `${site.name} — Sparepart & Aksesoris Mobil Cina & Listrik`,
  description: site.description,
  keywords: keywordsFor("home"),
  alternates: { canonical: site.url },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "AutoPartsStore"],
  name: site.name,
  // Ejaan "Otomotif" — padanan Indonesia dari "Automotive". Nama resmi tetap
  // site.name; alternateName memberi tahu mesin pencari keduanya satu entitas.
  alternateName: ["Yuan Dewata Otomotif", "Yuan Dewata Timur", site.shortName],
  url: site.url,
  description: site.description,
  slogan: "Spare part, body parts, dan aksesoris otomotif mobil Cina & mobil listrik original.",
  email: site.email,
  telephone: `+${site.whatsapp.number}`,
  // Sinyal topikal untuk mesin pencari — cerminan brandCore (sumber tunggal keyword).
  keywords: brandCore.join(", "),
  knowsAbout: [
    "otomotif",
    "sparepart otomotif",
    "aksesoris otomotif",
    "sparepart mobil Cina",
    "body parts mobil Cina",
    "aksesoris mobil Cina",
    "sparepart mobil listrik",
    "aksesoris mobil listrik",
    "importir sparepart mobil Cina",
    "pre-order sparepart mobil Cina langka",
    "Wuling",
    "BYD",
    "Chery",
    "MG",
    "Neta",
    "Hyundai",
  ],
  areaServed: { "@type": "Country", name: "Indonesia" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sanur, Denpasar Selatan",
    addressLocality: "Denpasar",
    addressRegion: "Bali",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.latitude,
    longitude: site.geo.longitude,
  },
  hasMap: `https://www.google.com/maps?q=${site.geo.latitude},${site.geo.longitude}`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: `+${site.whatsapp.number}`,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <HeroSection />
      <Reveal>
        <CategorySection />
      </Reveal>
      <Reveal>
        <FeaturedProductsSection />
      </Reveal>
      <Reveal>
        <NewsHighlightSection />
      </Reveal>
      <Reveal>
        <WhyUsSection />
      </Reveal>
      <Reveal>
        <AboutBlogSection />
      </Reveal>
      <Reveal>
        <SocialProofSection />
      </Reveal>
    </>
  );
}
