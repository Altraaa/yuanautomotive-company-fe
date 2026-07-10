import { SectionHeading } from "@/components/common/section-heading";
import { NewsCard } from "@/components/common/news-card";
import { getAllNewsCards } from "@/services/news";

/**
 * NewsHighlightSection — home strip surfacing the latest Instagram content
 * (Reels & Posters). Newest first; the NewsCard flags "Baru" items automatically.
 */
export async function NewsHighlightSection() {
  const all = await getAllNewsCards();
  const items = [...all]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section id="news" className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-14">
        <SectionHeading
          title="Sorotan"
          accent="Instagram"
          actionLabel="Semua"
          actionHref="/news"
        />

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
      </div>
    </section>
  );
}
