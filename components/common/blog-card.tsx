import Image from "next/image";
import Link from "next/link";
import type { BlogCardData } from "@/types/ui/blog";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: BlogCardData;
  /** Horizontal layout for the featured article (image left, text right on desktop). */
  featured?: boolean;
};

/** BlogCard — dark article card with gold category label, title, and date. */
export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col border border-border bg-surface transition-colors hover:border-gold",
        featured && "md:flex-row"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-surface to-surface-sunken",
          featured ? "aspect-[16/10] md:aspect-auto md:w-1/2" : "aspect-[16/9]"
        )}
      >
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className={cn("flex flex-col gap-2 p-4", featured && "md:justify-center md:p-8")}>
        <span className="font-display text-[9.5px] font-bold uppercase tracking-[0.12em] text-gold">
          {post.category}
        </span>
        <h3
          className={cn(
            "font-sans font-semibold leading-snug text-fg",
            featured ? "text-xl md:text-2xl" : "text-[13px]"
          )}
        >
          {post.title}
        </h3>
        {featured ? (
          <p className="mt-1 font-sans text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
        ) : null}
        <span className="mt-1 font-sans text-[10.5px] text-fg-subtle">
          {formatDate(post.publishedAt)} · {post.readingMinutes} menit baca
        </span>
      </div>
    </Link>
  );
}
