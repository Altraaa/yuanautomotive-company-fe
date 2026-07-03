import { CtaButton } from "@/components/common/cta-button";
import type { ProductCategory } from "@/types/ui/product";

type CategoryStripProps = {
  categories: readonly ProductCategory[];
  /** Category to render as the active (red) pill. */
  active?: ProductCategory;
  /** Builds the href for each category pill. */
  hrefFor?: (category: ProductCategory) => string;
};

/**
 * CategoryStrip — the skewed category pills row from the comp
 * (active = red, rest = gold outline).
 */
export function CategoryStrip({
  categories,
  active,
  hrefFor = (c) => `/produk?kategori=${encodeURIComponent(c.toLowerCase())}`,
}: CategoryStripProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <CtaButton
          key={category}
          href={hrefFor(category)}
          size="sm"
          variant={active === category ? "primary" : "outline"}
        >
          {category}
        </CtaButton>
      ))}
    </div>
  );
}
