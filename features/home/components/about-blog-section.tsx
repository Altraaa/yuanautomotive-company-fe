import Link from "next/link";
import { Eyebrow } from "@/components/common/eyebrow";
import { SectionHeading } from "@/components/common/section-heading";
import { BlogCard } from "@/components/common/blog-card";
import { getAllBlogCards } from "@/services/blogs";
import { site } from "@/lib/site";

export async function AboutBlogSection() {
  const posts = (await getAllBlogCards()).slice(0, 3);

  return (
    <section id="company" className="bg-surface-raised">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_1.4fr] md:px-8 md:py-14">
        {/* Tentang */}
        <div className="flex flex-col justify-center gap-4">
          <Eyebrow>Tentang Kami</Eyebrow>
          <p className="font-sans text-lg leading-relaxed text-fg-soft md:text-[19px]">
            {site.name} — pusat sparepart &amp; aksesoris mobil listrik untuk komunitas EV,
            bengkel, dan jaringan dealer di Indonesia.
          </p>
          <Link
            href="/tentang"
            className="w-fit font-display text-sm font-bold uppercase tracking-[0.1em] text-red transition-colors hover:text-red-soft"
          >
            Profil Perusahaan →
          </Link>
        </div>

        {/* Blog */}
        <div id="blog">
          <SectionHeading title="Blog &" accent="Update" actionLabel="Semua" actionHref="/blog" />
          <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
