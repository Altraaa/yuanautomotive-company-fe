import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { BlogCard } from "@/components/common/blog-card";
import { getAllBlogSlugs, getBlogBySlug, getRelatedBlogs } from "@/services/blogs";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { withBrand } from "@/lib/seo-keywords";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: withBrand([post.title, post.category, "tips mobil listrik"]),
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.imageUrl }],
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogs(post.slug);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.imageUrl],
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-12 md:px-8">
        <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-gold">
          {post.category}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold italic uppercase leading-tight text-fg md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2 font-sans text-sm text-fg-subtle">
          <span>{post.author}</span>
          <span className="text-fg-faint">·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="text-fg-faint">·</span>
          <span>{post.readingMinutes} menit baca</span>
        </div>

        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden border border-gold/35 bg-surface-sunken">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>

        <div
          className="mt-8 font-sans [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:italic [&_h2]:text-fg [&_li]:mb-1.5 [&_li]:text-fg-muted [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-fg-muted [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface-raised">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
            <SectionHeading title="Artikel" accent="Lainnya" actionLabel="Semua" actionHref="/blog" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
