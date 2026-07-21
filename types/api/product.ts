export type ApiProductSpec = { label: string; value: string };

/** A single compatible vehicle. `years` is an optional free-form range. */
export type ApiVehicleFitment = { brand: string; model: string; years?: string | null };

export type ApiProductCard = {
  slug: string;
  name: string;
  category: string;
  price: string;
  image_url: string | null;
  /** Manual promo badge (HOT / TERLARIS / PRE-ORDER). "BARU" is NOT sent here —
   *  the FE derives it from `created_at` recency (see isRecentlyAdded). */
  badge: string | null;
  /** ISO timestamp; powers the date-based "BARU" flag on the FE. */
  created_at: string;
};

export type ApiProductDetail = ApiProductCard & {
  description: string;
  specs: ApiProductSpec[];
  compatibility: ApiVehicleFitment[];
  gallery: string[];
};

export type ApiAdminProductRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  badge: string | null;
  status: "Published" | "Draft";
  /** Main product image (foto utama). Optional until the backend adds it. */
  image_url?: string | null;
};

export type ApiAdminProductDetail = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  category_id: string;
  price: string;
  price_wholesale: string | null;
  stock: number;
  badge: string | null;
  is_published: boolean;
  is_featured: boolean;
  description: string;
  specs: ApiProductSpec[];
  compatibility: ApiVehicleFitment[];
  gallery: string[];
  /** Same images/order as `gallery`, but each item carries its media uuid. */
  gallery_media?: { uuid: string; url: string }[];
  view_count: number;
  lead_count: number;
  preorder_count: number;
  author: string;
  created_at: string;
  updated_at: string;
};
