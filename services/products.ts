import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import { flattenPage } from "@/lib/paginate";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiProductCard, ApiProductDetail, ApiVehicleFitment } from "@/types/api/product";
import type {
  ProductBadge,
  ProductCardData,
  ProductCategory,
  ProductDetailData,
  VehicleFitment,
} from "@/types/ui/product";
import { fitmentBrands, isRecentlyAdded } from "@/types/ui/product";
import * as mock from "@/features/products/data";
import { PRODUCTS_PER_PAGE, type ProductFilters } from "@/features/products/data";

/**
 * PUBLIC product service (RSC). Calls the backend via apiClient and maps the
 * snake_case API JSON to UI types. Filtering, sorting, and pagination are done
 * server-side (query params below) — the backend returns a correct `meta.total`.
 * Falls back to the in-memory mock catalog when the backend is unreachable so
 * public pages stay stable.
 */

/** Sort tokens the backend accepts (`@IsIn` there → invalid values 400). */
const ALLOWED_SORTS = new Set(["terbaru", "termurah", "termahal"]);

const toBadge = (b: string | null): ProductBadge | undefined => (b ? (b as ProductBadge) : undefined);

/**
 * Map API fitments → UI fitments. Tolerant of the legacy `string[]` shape (a
 * bare vehicle name) so older backend records / cached payloads still render.
 */
export function toFitments(raw: ApiVehicleFitment[] | string[] | null | undefined): VehicleFitment[] {
  if (!raw) return [];
  return raw
    .map((f): VehicleFitment => {
      if (typeof f === "string") return { brand: f.trim(), model: "" };
      return { brand: f.brand.trim(), model: f.model.trim(), years: f.years?.trim() || undefined };
    })
    .filter((f) => f.brand || f.model);
}

function toCard(p: ApiProductCard): ProductCardData {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category as ProductCategory,
    price: Number(p.price),
    imageUrl: p.image_url ?? "/placeholder-product-1.png",
    // Manual promo badge wins; otherwise flag recently-added items as "BARU"
    // (backend derives no BARU badge — it sends created_at for exactly this).
    badge: toBadge(p.badge) ?? (isRecentlyAdded(p.created_at) ? "BARU" : undefined),
    // Deduped compatible-vehicle brands for the card "Untuk …" chip. Absent
    // until the backend adds `fitment_brands` to the list projection → chip hides.
    fitmentBrands: p.fitment_brands
      ? fitmentBrands(p.fitment_brands.map((brand) => ({ brand, model: "" })))
      : undefined,
  };
}

function toDetail(p: ApiProductDetail): ProductDetailData {
  return {
    ...toCard(p),
    description: p.description,
    specs: p.specs,
    compatibility: toFitments(p.compatibility),
    gallery: p.gallery,
  };
}

/**
 * Filter + sort + paginate the catalog — all server-side. Search params from
 * the URL (category, price range, sort, page) are forwarded as query params;
 * the backend filters at the DB level and returns the correct `meta.total`.
 * An unrecognised `sort` is dropped (the backend would 400 on it). The mock
 * fallback mirrors this in memory when the backend is down.
 */
export function queryProducts(filters: ProductFilters) {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
        revalidate: 3600,
        tags: ["products"],
        query: {
          category: filters.category || undefined,
          price_min: filters.priceMin,
          price_max: filters.priceMax,
          sort: filters.sort && ALLOWED_SORTS.has(filters.sort) ? filters.sort : undefined,
          page: filters.page ?? 1,
          limit: PRODUCTS_PER_PAGE,
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
