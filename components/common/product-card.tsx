import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/types/ui/product";
import { Badge } from "@/components/common/badge";
import { formatIDR } from "@/lib/utils";

type ProductCardProps = {
  product: ProductCardData;
};

/**
 * ProductCard — gold-top-bordered card from the comp: image well, optional corner
 * badge, uppercase category, product name, gold price.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex h-full flex-col border border-border border-t-[3px] border-t-gold bg-surface transition-colors hover:border-gold"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-surface to-surface-sunken">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 70vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute left-2.5 top-2.5">
            <Badge intent="red">{product.badge}</Badge>
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.12em] text-fg-subtle">
          {product.category}
        </span>
        <h3 className="font-sans text-sm font-semibold leading-snug text-fg">{product.name}</h3>
        <span className="mt-auto pt-1 font-display text-[15px] font-bold text-gold">
          {formatIDR(product.price)}
        </span>
      </div>
    </Link>
  );
}
