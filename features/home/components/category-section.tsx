import { CategoryStrip } from "@/components/common/category-strip";
import { productCategories } from "@/features/products/data";

export function CategorySection() {
  return (
    <section className="border-t-2 border-t-gold bg-surface-raised">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <h2 className="font-display text-xl font-bold italic uppercase text-fg md:text-[22px]">
          Kategori Sparepart &amp; Aksesoris Otomotif
        </h2>
        <CategoryStrip categories={productCategories} />
      </div>
    </section>
  );
}
