import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { CtaBanner } from "@/components/common/cta-banner";
import { FaqAccordion } from "@/features/faq/components/faq-accordion";
import { getAllFaqs } from "@/services/faqs";
import { site } from "@/lib/site";
import { keywordsFor } from "@/lib/seo-keywords";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan Umum Yuan Dewata Automotive",
  description:
    "Jawaban atas pertanyaan yang sering diajukan seputar pembelian, pengiriman, garansi, dan produk sparepart, body parts, serta aksesoris mobil Cina dan mobil listrik di Yuan Dewata Automotive.",
  keywords: keywordsFor("faq"),
  alternates: { canonical: `${site.url}/faq` },
};

export default async function FaqPage() {
  const items = await getAllFaqs();

  // FAQPage structured data — lets Google render the rich Q&A result.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="Pusat Bantuan"
        title="Pertanyaan"
        accent="Umum"
        description="Hal-hal yang paling sering ditanyakan pelanggan — mulai dari cara pemesanan, pembayaran, pengiriman, hingga garansi. Tidak menemukan jawabannya? Hubungi kami langsung."
      />

      <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        {items.length === 0 ? (
          <div className="border border-border bg-surface p-10 text-center">
            <p className="font-sans text-fg-muted">Belum ada pertanyaan yang ditambahkan.</p>
          </div>
        ) : (
          <>
            <FaqAccordion items={items} />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
          </>
        )}
      </div>

      <CtaBanner
        title="Masih Ada"
        accent="Pertanyaan?"
        description="Tim kami siap membantu memilih sparepart & aksesoris yang tepat untuk kendaraan Anda."
        ctaLabel="Hubungi Kami"
        ctaHref="/kontak"
      />
    </>
  );
}
