import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiAdminProductDetail, ApiAdminProductRow } from "@/types/api/product";
import type { AdminProductDetail, AdminProductRow } from "@/types/ui/admin";
import type { ProductBadge, ProductCategory } from "@/types/ui/product";
import type { ProductFormValues } from "@/features/admin/product-schema";
import type { CategoryOption } from "@/services/categories";
import * as mock from "@/features/admin/data";

/**
 * ADMIN product service — server-side reads (RSC) + mappers + payload builder.
 * Mutations live in `features/admin/actions.ts` (server actions callable from
 * client components). All calls send the admin JWT via `auth: true`; the cookie
 * is read by apiClient. Falls back to the mock admin catalog when unreachable.
 */

const toBadge = (b: string | null): ProductBadge | undefined => (b ? (b as ProductBadge) : undefined);

function toRow(r: ApiAdminProductRow): AdminProductRow {
  return {
    uuid: r.id,
    name: r.name,
    sku: r.sku,
    category: r.category as ProductCategory,
    price: Number(r.price),
    badge: toBadge(r.badge),
    status: r.status,
  };
}

function toDetail(d: ApiAdminProductDetail): AdminProductDetail {
  return {
    uuid: d.id,
    slug: d.slug,
    name: d.name,
    sku: d.sku,
    category: d.category as ProductCategory,
    status: d.is_published ? "Published" : "Draft",
    badge: toBadge(d.badge),
    retailPrice: Number(d.price),
    wholesalePrice: Number(d.price_wholesale ?? 0),
    stock: d.stock,
    description: d.description,
    specs: d.specs,
    compatibility: d.compatibility,
    featured: d.is_featured,
    views: d.view_count,
    leads: d.lead_count,
    preorders: d.preorder_count,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    author: d.author,
  };
}

export function listAdminProducts(params: { page?: number; limit?: number; category?: string }) {
  const limit = params.limit ?? 10;
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiAdminProductRow>>(endpoints.products.adminList, {
        auth: true,
        query: { page: params.page ?? 1, limit, category: params.category },
      });
      return flattenPage(res, toRow);
    },
    () => ({
      items: mock.adminProductRows,
      total: mock.ADMIN_PRODUCTS_TOTAL,
      totalPages: Math.max(1, Math.ceil(mock.ADMIN_PRODUCTS_TOTAL / limit)),
      page: params.page ?? 1,
    }),
    { alwaysFallback: true }
  );
}

export function getAdminProduct(uuid: string): Promise<AdminProductDetail | undefined> {
  return withFallback(
    async () => {
      try {
        const d = await apiClient.get<ApiAdminProductDetail>(endpoints.products.adminDetail(uuid), {
          auth: true,
        });
        return toDetail(d);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    () => mock.getAdminProductDetail(uuid),
    { alwaysFallback: true }
  );
}

const digits = (s: string) => s.replace(/[^\d]/g, "");

/** Map the form values → backend create/update payload (name→category_id, clean price, enum). */
export function toProductPayload(
  v: ProductFormValues,
  categories: CategoryOption[],
  imageUuids: string[] = []
) {
  const cat = categories.find((c) => c.name === v.category);
  return {
    name: v.name,
    sku: v.sku,
    slug: v.slug,
    category_id: cat?.uuid,
    price: digits(v.retailPrice),
    price_wholesale: v.wholesalePrice ? digits(v.wholesalePrice) : undefined,
    stock: Number(digits(v.stock) || "0"),
    badge: v.badge ? v.badge.replace("-", "_") : undefined, // "PRE-ORDER" → "PRE_ORDER"
    description: v.description,
    compatibility: v.compatibility,
    specs: v.specs
      .filter((s) => s.label && s.value)
      .map((s, i) => ({ label: s.label, value: s.value, sort_order: i })),
    image_uuids: imageUuids.length ? imageUuids : undefined,
    is_featured: v.featured,
    is_published: v.status === "Published",
  };
}
