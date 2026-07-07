import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiProductCard, ApiProductDetail } from "@/types/api/product";
import type {
  ProductBadge,
  ProductCardData,
  ProductCategory,
  ProductDetailData,
} from "@/types/ui/product";
import * as mock from "@/features/products/data";
import { PRODUCTS_PER_PAGE, type ProductFilters } from "@/features/products/data";

/**
 * PUBLIC product service (RSC). Calls the backend via apiClient and maps the
 * snake_case API JSON to UI types. Falls back to the mock catalog when the
 * backend is unreachable so public pages stay stable until the API is live.
 */

const toBadge = (b: string | null): ProductBadge | undefined => (b ? (b as ProductBadge) : undefined);

function toCard(p: ApiProductCard): ProductCardData {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category as ProductCategory,
    price: Number(p.price),
    imageUrl: p.image_url ?? "/placeholder-product-1.png",
    badge: toBadge(p.badge),
  };
}

function toDetail(p: ApiProductDetail): ProductDetailData {
  return {
    ...toCard(p),
    description: p.description,
    specs: p.specs,
    compatibility: p.compatibility,
    gallery: p.gallery,
  };
}

/**
 * Filter + sort + paginate the full catalog. The backend's pagination `total`
 * is unreliable (counts the returned page, off-by-one), so we fetch everything
 * and page here. Sort/filter option semantics:
 * - "semua" / undefined → all products, default order
 * - "terbaru"           → only BARU-labelled products
 * - "termurah"          → price ascending
 * - "termahal"          → price descending
 */
function applyCatalogFilters(cards: ProductCardData[], filters: ProductFilters) {
  const result = cards.filter((p) => {
    if (filters.category && p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    if (filters.priceMin != null && p.price < filters.priceMin) return false;
    if (filters.priceMax != null && p.price > filters.priceMax) return false;
    if (filters.sort === "terbaru" && p.badge !== "BARU") return false;
    return true;
  });

  const sorted =
    filters.sort === "termurah"
      ? [...result].sort((a, b) => a.price - b.price)
      : filters.sort === "termahal"
        ? [...result].sort((a, b) => b.price - a.price)
        : result;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  return { items: sorted.slice(start, start + PRODUCTS_PER_PAGE), total, totalPages, page };
}

async function fetchAllCards(): Promise<ProductCardData[]> {
  const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
    revalidate: 3600,
    tags: ["products"],
    query: { limit: 100 }, // fetch all; backend pagination total is unreliable
  });
  return res.items.map(toCard);
}

export function queryProducts(filters: ProductFilters) {
  return withFallback(
    async () => applyCatalogFilters(await fetchAllCards(), filters),
    () => applyCatalogFilters(mock.getAllProductCards(), filters)
  );
}

export function getProductBySlug(slug: string): Promise<ProductDetailData | undefined> {
  return withFallback(
    async () => {
      try {
        const p = await apiClient.get<ApiProductDetail>(endpoints.products.detailBySlug(slug), {
          revalidate: 3600,
          tags: ["products"],
        });
        return toDetail(p);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    () => mock.getProductBySlug(slug)
  );
}

export function getFeaturedProductCards(): Promise<ProductCardData[]> {
  return withFallback(
    async () => {
      // Backend has no dedicated `featured` param (strict whitelist) — take the
      // top of the list as featured for now; swap when BE exposes a flag.
      const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
        revalidate: 3600,
        tags: ["products"],
        query: { limit: 4 },
      });
      return res.items.map(toCard);
    },
    () => mock.getFeaturedProductCards()
  );
}

export function getRelatedProducts(
  slug: string,
  category: ProductCategory
): Promise<ProductCardData[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
        revalidate: 3600,
        tags: ["products"],
        query: { category: category.toLowerCase(), limit: 5 },
      });
      return res.items
        .map(toCard)
        .filter((p) => p.slug !== slug)
        .slice(0, 4);
    },
    () => mock.getRelatedProducts(slug, category)
  );
}

export function getAllProductSlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
        revalidate: 3600,
        tags: ["products"],
        query: { limit: 100 },
      });
      return res.items.map((p) => p.slug);
    },
    () => mock.getAllProductSlugs()
  );
}
