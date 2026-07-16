import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { BlogCard } from "@/components/common/blog-card";
import { BlogCategoryTabs } from "@/features/blog/components/blog-category-tabs";
import { getAllBlogCards } from "@/services/blogs";
import { site } from "@/lib/site";
import { keywordsFor } from "@/lib/seo-keywords";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog Otomotif & Update — Tips & Panduan Mobil Cina & Listrik",
  description:
    "Tips perawatan, panduan teknis, dan kabar rilis terbaru seputar sparepart, body parts, dan aksesoris otomotif mobil Cina serta mobil listrik dari Yuan Dewata Automotive.",
  keywords: keywordsFor("blog"),
  alternates: { canonical: `${site.url}/blog` },
};

type SearchParams = Promise<{ kategori?: string }>;

export default async function BlogListPage({ searchParams }: { searchParams: SearchParams }) {
  const { kategori } = await searchParams;
  const posts = await getAllBlogCards(kategori);

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Wawasan"
        title="Blog Otomotif &"
        accent="Update"
        description="Tips perawatan, panduan teknis, dan kabar rilis terbaru seputar sparepart & aksesoris otomotif mobil Cina dan kendaraan listrik."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
        <BlogCategoryTabs active={kategori} />

        {posts.length === 0 ? (
          <div className="mt-8 border border-border bg-surface p-10 text-center">
            <p className="font-sans text-fg-muted">Belum ada artikel pada kategori ini.</p>
          </div>
        ) : (
          <>
            {featured ? (
              <div className="mt-8">
                <BlogCard post={featured} featured />
              </div>
            ) : null}

            {rest.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
