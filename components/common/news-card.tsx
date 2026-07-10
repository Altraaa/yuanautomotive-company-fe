import Image from "next/image";
import Link from "next/link";
import { Images, Play } from "lucide-react";
import { cva } from "class-variance-authority";
import type { NewsCardData } from "@/types/ui/news";
import { isNews } from "@/types/ui/news";
import { Badge } from "@/components/common/badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NewsCardProps = {
  item: NewsCardData;
  /** Horizontal layout for the featured/highlight item (image left, text right on desktop). */
  featured?: boolean;
};

const mediaVariants = cva(
  "relative overflow-hidden bg-gradient-to-br from-surface to-surface-sunken",
  {
    variants: {
      featured: {
        true: "aspect-[4/5] md:aspect-auto md:w-2/5",
        // Reels/Poster IG content reads best in portrait; keep a tall crop.
        false: "aspect-[4/5]",
      },
    },
    defaultVariants: { featured: false },
  }
);

/**
 * NewsCard — Instagram content card (Reels or Poster) with type badge, an
 * optional "Baru" flag, portrait thumbnail, title, and date. Links to the
 * `/news/[slug]` detail page.
 */
export function NewsCard({ item, featured = false }: NewsCardProps) {
  const isReels = item.type === "Reels";
  const showNew = isNews(item);

  return (
    <Link
      href={`/news/${item.slug}`}
      className={cn(
        "group flex flex-col border border-border bg-surface transition-colors hover:border-gold",
        featured && "md:flex-row"
      )}
    >
      <div className={cn(mediaVariants({ featured }))}>
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          sizes={featured ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Type badge */}
        <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 bg-surface-black/70 px-2 py-1 font-display text-[9.5px] font-bold uppercase tracking-[0.1em] text-fg backdrop-blur-sm">
          {isReels ? <Play className="h-3 w-3 fill-current" /> : <Images className="h-3 w-3" />}
          {item.type}
        </span>

        {/* "Baru" flag */}
        {showNew ? (
          <Badge intent="red" skew className="absolute right-2.5 top-2.5">
            Baru
          </Badge>
        ) : null}

        {/* Reels play affordance */}
        {isReels ? (
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-black/55 text-fg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play className="h-5 w-5 translate-x-0.5 fill-current" />
            </span>
          </span>
        ) : null}
      </div>

      <div className={cn("flex flex-col gap-2 p-4", featured && "md:justify-center md:p-8")}>
        <span className="font-display text-[9.5px] font-bold uppercase tracking-[0.12em] text-gold">
          {isReels ? "Video Reels" : "Konten Poster"}
        </span>
        <h3
          className={cn(
            "font-sans font-semibold leading-snug text-fg",
            featured ? "text-xl md:text-2xl" : "text-[13px]"
          )}
        >
          {item.title}
        </h3>
        <span className="mt-1 font-sans text-[10.5px] text-fg-subtle">
          {formatDate(item.publishedAt)}
        </span>
      </div>
    </Link>
  );
}
