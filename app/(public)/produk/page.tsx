import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { ProductCard } from "@/components/common/product-card";
import { Pagination } from "@/components/common/pagination";
import { ProductFilter } from "@/features/products/components/product-filter";
import { ProductSort } from "@/features/products/components/product-sort";
import { queryProducts } from "@/features/products/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Produk — Katalog Sparepart & Aksesoris EV",
  description:
    "Jelajahi katalog lengkap sparepart dan aksesoris mobil listrik: charger, kampas rem, velg, interior, dan eksterior — dengan spesifikasi teknis lengkap.",
  alternates: { canonical: `${site.url}/produk` },
};

// Public catalog — RSC + ISR.
export const revalidate = 3600;

type SearchParams = Promise<{
  kategori?: string;
  harga?: string;
  urut?: string;
  page?: string;
}>;

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const { items, total, totalPages, page } = queryProducts({
    category: sp.kategori,
    price: sp.harga,
    sort: sp.urut,
    page: sp.page ? Number(sp.page) : 1,
  });

  return (
    <>
      <PageHero
        eyebrow="Katalog"
        title="Semua"
        accent="Produk"
        description="Sparepart & aksesoris mobil listrik dengan spesifikasi teknis lengkap. Saring berdasarkan kategori dan rentang harga."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          {/* Filter — sidebar (desktop) / sheet trigger (mobile) */}
          <div className="md:sticky md:top-24 md:self-start">
            <ProductFilter />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <span className="font-sans text-sm text-fg-muted">
                {total} produk ditemukan
              </span>
              <ProductSort />
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="border border-border bg-surface p-10 text-center">
                <p className="font-sans text-fg-muted">
                  Tidak ada produk yang cocok dengan filter ini.
                </p>
              </div>
            )}

            <div className="pt-2">
              <Pagination
                basePath="/produk"
                params={{ kategori: sp.kategori, harga: sp.harga, urut: sp.urut }}
                page={page}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
