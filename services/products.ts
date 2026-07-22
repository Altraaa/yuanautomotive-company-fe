import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
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

/**
 * Backend max page size (`@Max(100)` on the list DTO). We fetch the whole
 * filtered set at this ceiling and paginate in the RSC — see `queryProducts`.
 */
const CATALOG_FETCH_LIMIT = 100;

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
 * Filter + sort + paginate the catalog. Category filter + sort still run
 * server-side (DB level), but pagination is done here in the RSC.
 *
 * Why not server-side paging: the backend's paginated `meta.total` /
 * `meta.total_pages` is unreliable for small limits — it varies by `page`/`limit`
 * (e.g. `limit=10` reports `total: 7` on page 1 and `total: 17` on page 2 for the
 * same 36-item catalog), so the FE saw a truncated list with no pager. The count
 * IS correct at the DTO max (`limit=100`), so we fetch the full filtered set once
 * and slice it here with a correct total. Revert to `flattenPage` + server paging
 * once the backend count query is fixed. Ceiling: a single filtered result set
 * over 100 items would be capped — fine for the current catalog, revisit if it
 * grows past that. The mock fallback mirrors this in memory when the backend is down.
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
          limit: CATALOG_FETCH_LIMIT,
        },
      });
      const all = res.items.map(toCard);
      const total = all.length;
      const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
      const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
      const start = (page - 1) * PRODUCTS_PER_PAGE;
      return { items: all.slice(start, start + PRODUCTS_PER_PAGE), total, totalPages, page };
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
      // Fetch the category set at the reliable ceiling (small limits under-fill
      // due to the backend list bug — see `queryProducts`) and slice 4 here.
      const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
        revalidate: 3600,
        tags: ["products"],
        query: { category: category.toLowerCase(), limit: CATALOG_FETCH_LIMIT },
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
