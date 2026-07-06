import { Badge } from "@/components/common/badge";
import type { ProductBadge } from "@/types/ui/product";
import { cn } from "@/lib/utils";

/**
 * ProductGallery (admin) — placeholder gallery for the detail screen. Renders the
 * main image slot + thumbnail rail; swap the gradient placeholders for `next/image`
 * once product media is wired.
 */
export function ProductGallery({ badge, thumbs = 4 }: { badge?: ProductBadge; thumbs?: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative grid h-[300px] place-items-center border border-border bg-gradient-to-br from-border to-surface-sunken md:h-[340px]">
        <div className="h-[110px] w-1/2 rounded-[26px_70px_16px_16px] bg-surface-black/85 shadow-[0_30px_40px_-16px_rgba(255,242,0,0.28)]" />
        {badge && (
          <span className="absolute left-3.5 top-3.5">
            <Badge intent="red">{badge}</Badge>
          </span>
        )}
        <span className="absolute bottom-3 right-3.5 font-sans text-[10px] tracking-[0.14em] text-fg-faint">
          FOTO PRODUK UTAMA
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {Array.from({ length: thumbs }, (_, i) => (
          <div
            key={i}
            className={cn(
              "grid h-[74px] place-items-center bg-gradient-to-br from-border to-surface-sunken",
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
