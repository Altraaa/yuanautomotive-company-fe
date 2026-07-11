import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { NewsCard } from "@/components/common/news-card";
import { NewsTypeTabs } from "@/features/news/components/news-type-tabs";
import { getAllNewsCards } from "@/services/news";
import { site } from "@/lib/site";
import { keywordsFor } from "@/lib/seo-keywords";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News — Konten & Update Instagram Yuan Dewata Automotive",
  description:
    "Kumpulan konten Instagram Yuan Dewata Automotive — video Reels dan poster seputar sparepart, body parts, dan aksesoris mobil Cina serta kendaraan listrik.",
  keywords: keywordsFor("news"),
  alternates: { canonical: `${site.url}/news` },
};

type SearchParams = Promise<{ tipe?: string }>;

export default async function NewsListPage({ searchParams }: { searchParams: SearchParams }) {
  const { tipe } = await searchParams;
  const all = await getAllNewsCards();
  const items = tipe ? all.filter((n) => n.type.toLowerCase() === tipe.toLowerCase()) : all;

  const [featured, ...rest] = items;

  return (
    <>
      <PageHero
        eyebrow="Sorotan Instagram"
        title="News &"
        accent="Konten"
        description="Video Reels dan poster terbaru dari Instagram kami — tips, rilis sparepart & aksesoris mobil Cina, dan momen komunitas EV."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
        <NewsTypeTabs active={tipe} />

        {items.length === 0 ? (
          <div className="mt-8 border border-border bg-surface p-10 text-center">
            <p className="font-sans text-fg-muted">Belum ada konten pada kategori ini.</p>
          </div>
        ) : (
          <>
            {featured ? (
              <div className="mt-8">
                <NewsCard item={featured} featured />
              </div>
            ) : null}

            {rest.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
                {rest.map((item) => (
                  <NewsCard key={item.slug} item={item} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
