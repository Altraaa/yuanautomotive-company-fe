import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Camera, Play } from "lucide-react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { NewsCard } from "@/components/common/news-card";
import { getAllNewsSlugs, getNewsBySlug, getRelatedNews } from "@/services/news";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Konten Tidak Ditemukan" };

  return {
    title: item.title,
    description: item.caption,
    alternates: { canonical: `${site.url}/news/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.caption,
      images: [{ url: item.thumbnailUrl }],
      type: "article",
      publishedTime: item.publishedAt,
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const related = await getRelatedNews(item.slug);
  const isReels = item.type === "Reels";

  const postingLd = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline: item.title,
    articleBody: item.caption,
    image: [item.thumbnailUrl],
    datePublished: item.publishedAt,
    url: item.instagramUrl,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/news/${item.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postingLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "News", href: "/news" },
            { label: item.title },
          ]}
        />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-12 md:px-8">
        <span className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-gold">
          {isReels ? <Play className="h-3.5 w-3.5 fill-current" /> : <Camera className="h-3.5 w-3.5" />}
          {isReels ? "Video Reels" : "Konten Poster"}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold italic uppercase leading-tight text-fg md:text-4xl">
          {item.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2 font-sans text-sm text-fg-subtle">
          <span>Instagram</span>
          <span className="text-fg-faint">·</span>
          <span>{formatDate(item.publishedAt)}</span>
        </div>

        <div className="relative mt-6 aspect-[4/5] w-full max-w-md overflow-hidden border border-gold/35 bg-surface-sunken">
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            priority
            sizes="(min-width: 768px) 448px, 100vw"
            className="object-cover"
          />
          {isReels ? (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-black/55 text-fg backdrop-blur-sm">
                <Play className="h-7 w-7 translate-x-0.5 fill-current" />
              </span>
            </span>
          ) : null}
        </div>

        <p className="mt-8 whitespace-pre-line font-sans text-[15px] leading-relaxed text-fg-muted">
          {item.caption}
        </p>

        <a
          href={item.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 -skew-x-[8deg] bg-gradient-to-r from-red to-red-soft px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] text-fg transition-opacity hover:opacity-90"
        >
          <span className="flex skew-x-[8deg] items-center gap-2">
            <Camera className="h-4 w-4" />
            {isReels ? "Tonton di Instagram" : "Lihat di Instagram"}
          </span>
        </a>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface-raised">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
            <SectionHeading title="Konten" accent="Lainnya" actionLabel="Semua" actionHref="/news" />
            <div className="mt-6 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
              {related.map((n) => (
                <NewsCard key={n.slug} item={n} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
