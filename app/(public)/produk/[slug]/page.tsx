import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Badge } from "@/components/common/badge";
import { CtaButton } from "@/components/common/cta-button";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductCard } from "@/components/common/product-card";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductTabs } from "@/features/products/components/product-tabs";
import { AddToCartButton } from "@/features/preorder/components/add-to-cart-button";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/services/products";
import { formatIDR } from "@/lib/utils";
import { site, waLink } from "@/lib/site";
import { withBrand } from "@/lib/seo-keywords";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: `${product.name} — ${product.category}`,
    description: product.description,
    keywords: withBrand([
      product.name,
      `${product.category} ${product.name}`,
      ...product.compatibility.map((brand) => `sparepart ${brand}`),
    ]),
    alternates: { canonical: `${site.url}/produk/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl }],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, product.category);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.gallery,
    category: product.category,
    keywords: [
      product.name,
      `${product.category} ${product.name}`,
      ...product.compatibility.map((brand) => `sparepart ${brand}`),
      "sparepart mobil Cina",
      "aksesoris mobil Cina",
    ].join(", "),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `${site.url}/produk/${product.slug}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Produk", item: `${site.url}/produk` },
      { "@type": "ListItem", position: 3, name: product.name },
    ],
  };

  const orderMessage = `Halo ${site.name}, saya tertarik memesan produk "${product.name}" (${formatIDR(
    product.price
  )}). Apakah stok tersedia?`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Produk", href: "/produk" },
            { label: product.name },
          ]}
        />
      </div>

      <article className="mx-auto max-w-6xl px-4 pb-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <ProductGallery images={product.gallery} alt={product.name} />

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs uppercase tracking-[0.12em] text-fg-subtle">
                {product.category}
              </span>
              {product.badge ? <Badge intent="red">{product.badge}</Badge> : null}
            </div>

            <h1 className="font-display text-2xl font-bold italic uppercase leading-tight text-fg md:text-4xl">
              {product.name}
            </h1>

            <span className="font-display text-3xl font-bold text-gold">
              {formatIDR(product.price)}
            </span>

            <p className="font-sans text-base leading-relaxed text-fg-muted">
              {product.description}
            </p>

            <div className="mt-2 flex flex-col gap-3">
              <AddToCartButton
                product={{
                  slug: product.slug,
                  name: product.name,
                  category: product.category,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  badge: product.badge,
                }}
              />
              <CtaButton
                href={waLink(orderMessage)}
                target="_blank"
                rel="noopener"
                variant="whatsapp"
                size="lg"
                className="w-full sm:w-fit"
              >
                Pesan via WhatsApp
              </CtaButton>
            </div>

            <div className="mt-6">
              <ProductTabs specs={product.specs} compatibility={product.compatibility} />
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16">
            <SectionHeading title="Produk" accent="Terkait" />
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
