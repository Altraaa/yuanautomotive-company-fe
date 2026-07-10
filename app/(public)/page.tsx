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
import { keywordsFor } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title: `${site.name} — Sparepart & Aksesoris Mobil Listrik`,
  description: site.description,
  keywords: keywordsFor("home"),
  alternates: { canonical: site.url },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "AutoPartsStore"],
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: `+${site.whatsapp.number}`,
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
