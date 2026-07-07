import Image from "next/image";
import { Badge } from "@/components/common/badge";
import type { ProductBadge } from "@/types/ui/product";
import { cn } from "@/lib/utils";

/**
 * ProductGallery (admin) — shows the product's real images on the detail screen;
 * falls back to labelled placeholders when a product has no media yet.
 */
export function ProductGallery({
  images = [],
  badge,
  thumbs = 4,
}: {
  images?: string[];
  badge?: ProductBadge;
  thumbs?: number;
}) {
  const hasImages = images.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative grid aspect-square place-items-center overflow-hidden border border-border bg-gradient-to-br from-border to-surface-sunken">
        {hasImages ? (
          <Image src={images[0]} alt="Foto produk" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-contain" />
        ) : (
          <div className="h-[110px] w-1/2 rounded-[26px_70px_16px_16px] bg-surface-black/85 shadow-[0_30px_40px_-16px_rgba(255,242,0,0.28)]" />
        )}
        {badge && (
          <span className="absolute left-3.5 top-3.5 z-10">
            <Badge intent="red">{badge}</Badge>
          </span>
        )}
        {!hasImages && (
          <span className="absolute bottom-3 right-3.5 font-sans text-[10px] tracking-[0.14em] text-fg-faint">
            BELUM ADA FOTO
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {hasImages
          ? images.slice(0, thumbs).map((src, i) => (
              <div
                key={src + i}
                className={cn(
                  "relative aspect-square overflow-hidden border bg-surface-sunken",
                  i === 0 ? "border-2 border-gold" : "border-border"
                )}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-contain" />
              </div>
            ))
          : Array.from({ length: thumbs }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "grid aspect-square place-items-center bg-gradient-to-br from-border to-surface-sunken",
                  i === 0 ? "border-2 border-gold" : "border border-border"
                )}
              >
                <span className="font-sans text-[8.5px] text-fg-faint">FOTO {i + 1}</span>
              </div>
            ))}
      </div>
    </div>
  );
}
