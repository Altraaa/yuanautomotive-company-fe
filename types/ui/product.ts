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
  /** Compact, deduped compatible-vehicle brands for the card "Untuk …" chip. */
  fitmentBrands?: string[];
};

export type ProductSpec = {
  label: string;
  value: string;
};

/**
 * A single vehicle this product fits. `years` is an optional free-form range
 * (e.g. "2022–2024"); brand + model are always present.
 */
export type VehicleFitment = {
  brand: string;
  model: string;
  years?: string;
};

/** One-line human label for a fitment — used for chips, keywords, JSON-LD. */
export function fitmentLabel(f: VehicleFitment): string {
  const head = `${f.brand} ${f.model}`.trim();
  return f.years ? `${head} (${f.years})` : head;
}

/**
 * Unique compatible-vehicle brands in first-seen order — powers the compact
 * "Untuk BYD, Wuling …" chip on product cards (dedupes multiple models of the
 * same brand). Case-insensitive de-dup, keeps the admin's original ordering.
 */
export function fitmentBrands(fitments: VehicleFitment[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const f of fitments) {
    const brand = f.brand.trim();
    const key = brand.toLowerCase();
    if (brand && !seen.has(key)) {
      seen.add(key);
      out.push(brand);
    }
  }
  return out;
}

export type ProductDetailData = ProductCardData & {
  description: string;
  specs: ProductSpec[];
  compatibility: VehicleFitment[];
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
