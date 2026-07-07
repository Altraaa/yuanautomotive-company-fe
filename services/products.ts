import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
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

export function queryProducts(filters: ProductFilters) {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
        revalidate: 3600,
        tags: ["products"],
        query: {
          page: filters.page ?? 1,
          limit: PRODUCTS_PER_PAGE,
          category: filters.category,
          price_min: filters.priceMin,
          price_max: filters.priceMax,
          sort: filters.sort,
        },
      });
      return flattenPage(res, toCard);
    },
    () => mock.queryProducts(filters)
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
      const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
        revalidate: 3600,
        tags: ["products"],
        query: { featured: true, limit: 4 },
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
        query: { limit: 200 },
      });
      return res.items.map((p) => p.slug);
    },
    () => mock.getAllProductSlugs()
  );
}
