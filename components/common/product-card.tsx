import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProductCardData } from "@/types/ui/product";
import { Badge } from "@/components/common/badge";
import { formatIDR } from "@/lib/utils";

type ProductCardProps = {
  product: ProductCardData;
  /** Optional interactive affordance (e.g. quick-add) overlaid on the image.
   * Kept as a slot so this card stays presentational and free of hooks. */
  action?: ReactNode;
};

/**
 * ProductCard — gold-top-bordered card from the comp: image well, optional corner
 * badge, uppercase category, product name, gold price. Uses the stretched-link
 * pattern so the whole card navigates while an `action` slot stays clickable.
 */
export function ProductCard({ product, action }: ProductCardProps) {
  return (
    <div className="group relative flex h-full flex-col border border-border border-t-[3px] border-t-gold bg-surface transition-[transform,border-color,box-shadow] duration-300 ease-sport hover:-translate-y-1 hover:border-gold hover:shadow-xl hover:shadow-black/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-surface to-surface-sunken">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 70vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute left-2.5 top-2.5 z-20">
            <Badge intent="red">{product.badge}</Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.12em] text-fg-subtle">
          {product.category}
        </span>
        <h3 className="font-sans text-sm font-semibold leading-snug text-fg">
          <Link
            href={`/produk/${product.slug}`}
            className="transition-colors hover:text-gold after:absolute after:inset-0 after:z-10 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <span className="mt-auto pt-1 font-display text-[15px] font-bold text-gold">
          {formatIDR(product.price)}
        </span>
        {action ? <div className="relative z-20 pt-3">{action}</div> : null}
      </div>
    </div>
  );
}
