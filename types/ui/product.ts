/**
 * UI product types — what components consume (price already a number, media flattened).
 * API types (types/api/) mirror the backend JSON; a mapper bridges the two in the service layer.
 */

export type ProductBadge = "BARU" | "HOT" | "TERLARIS" | "PRE-ORDER";

export type ProductCategory = "Sparepart" | "Body Part" | "Aksesoris";

export type ProductCardData = {
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  imageUrl: string;
  badge?: ProductBadge;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductDetailData = ProductCardData & {
  description: string;
  specs: ProductSpec[];
  compatibility: string[];
  gallery: string[];
};

/** Window (days) after creation where a product is auto-flagged "BARU". */
export const PRODUCT_NEW_WINDOW_DAYS = 14;

/**
 * True when `createdAt` (ISO) falls within the last PRODUCT_NEW_WINDOW_DAYS.
 * The backend sends `created_at` instead of a "BARU" badge; the recency rule
 * lives here (mirrors the News module's date-based "Baru" label).
 */
export function isRecentlyAdded(createdAt?: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  const ageDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return ageDays >= 0 && ageDays <= PRODUCT_NEW_WINDOW_DAYS;
}
