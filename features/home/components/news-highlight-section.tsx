import { Camera } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { NewsCard } from "@/components/common/news-card";
import { CtaButton } from "@/components/common/cta-button";
import { getAllNewsCards } from "@/services/news";
import { instagramUrl, site } from "@/lib/site";

/**
 * NewsHighlightSection — home strip surfacing the latest Instagram content
 * (Reels & Posters). Newest first; the NewsCard flags "Baru" items automatically.
 * Data comes from `getAllNewsCards` (live API with mock fallback). Two CTAs: the
 * full News page, and the brand Instagram (disabled "Segera Hadir" until the
 * account URL is set in `site.ts` — see instagramUrl).
 */
export async function NewsHighlightSection() {
  const all = await getAllNewsCards();
  const items = [...all]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  if (items.length === 0) return null;

  // ItemList schema — helps search engines understand this as a curated list of
  // the latest Instagram content, each linking to its /news/[slug] detail.
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Konten Instagram Terbaru — ${site.name}`,
    description:
      "Video Reels dan poster terbaru seputar sparepart, body parts, dan aksesoris mobil Cina serta mobil listrik.",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/news/${item.slug}`,
      name: item.title,
    })),
  };

  return (
    <section id="news" aria-label="Konten Instagram terbaru" className="bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-14">
        <SectionHeading
          title="Konten Instagram"
          accent="Terbaru"
          actionLabel="Semua"
          actionHref="/news"
        />

        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-fg-muted">
          Video Reels dan poster terbaru dari Instagram kami — tips, rilis produk, dan info
          seputar sparepart, body parts, dan aksesoris mobil Cina serta mobil listrik.
        </p>

        {/* horizontal scroll on mobile → 4-col grid on desktop */}
        <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-[18px] md:overflow-visible md:pb-0">
          {items.map((item) => (
            <div
              key={item.slug}
              className="w-[52%] flex-shrink-0 snap-start sm:w-[36%] md:w-auto"
            >
              <NewsCard item={item} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <CtaButton href="/news" variant="gold" size="lg">
            Lihat Semua Konten
          </CtaButton>

          {instagramUrl ? (
            <CtaButton
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
            >
              <Camera className="h-4 w-4" />
              Kunjungi Instagram
            </CtaButton>
          ) : (
            <CtaButton
              variant="outline"
              size="lg"
              disabled
              aria-disabled
              title="Segera hadir"
            >
              <Camera className="h-4 w-4" />
              Instagram — Segera Hadir
            </CtaButton>
          )}
        </div>
      </div>
    </section>
  );
}
