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
