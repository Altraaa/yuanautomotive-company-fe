import { SectionHeading } from "@/components/common/section-heading";
import { ProductCard } from "@/components/common/product-card";
import { getFeaturedProductCards } from "@/services/products";

export async function FeaturedProductsSection() {
  const products = await getFeaturedProductCards();

  return (
    <section id="product" className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-14">
        <SectionHeading
          title="Produk"
          accent="Unggulan"
          actionLabel="Semua"
          actionHref="/produk"
        />

        {/* horizontal scroll on mobile → 4-col grid on desktop */}
        <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-[18px] md:overflow-visible md:pb-0">
          {products.map((product) => (
            <div
              key={product.slug}
              className="w-[62%] flex-shrink-0 snap-start sm:w-[42%] md:w-auto"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
