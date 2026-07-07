/**
 * UI types for the admin panel (dashboard + manage screens).
 * These describe what admin components consume; the backend JSON will be bridged
 * by mappers in the service layer once the API is wired.
 */

import type { ProductBadge, ProductCategory, ProductSpec } from "@/types/ui/product";

/** Shared colour intents used by charts, pills and legends → mapped to design tokens. */
export type Tone = "red" | "gold" | "green" | "grey" | "muted";

/** Lead / order lifecycle statuses shown as pills. */
export type ActivityStatus =
  | "NEW"
  | "CONTACTED"
  | "PROCESSED"
  | "DONE"
  | "CANCELLED";

/** Product publish state in the manage table. */
export type ProductStatus = "Published" | "Draft";

export type AdminNavItem = {
  label: string;
  href: string;
  /** lucide icon name resolved in the sidebar component. */
  icon: AdminNavIcon;
  /** Optional counter chip; tone drives its colour. */
  count?: number;
  countTone?: Tone;
};

export type AdminNavIcon =
  | "dashboard"
  | "products"
  | "blog"
  | "leads"
  | "orders"
  | "categories"
  | "media"
  | "cms";

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export type DashboardStat = {
  label: string;
  value: string;
  /** Supporting line rendered below the value (may contain a highlighted figure). */
  hint: string;
  hintHighlight?: string;
  hintTone?: Tone;
  accent: "red" | "gold" | "gradient";
  /** Optional delta chip, e.g. "+12.5%". */
  delta?: string;
  deltaDirection?: "up" | "down";
};

export type DonutSlice = {
  label: string;
  value: number;
  tone: Tone;
};

export type BarItem = {
  label: string;
  value: number;
  /** Percentage width of the bar (0–100). */
  width: number;
};

export type ActivityItem = {
  initials: string;
  title: string;
  subtitle: string;
  status: ActivityStatus;
};

export type AdminProductRow = {
  uuid: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  badge?: ProductBadge;
  status: ProductStatus;
  /** Main product image URL, when the backend provides it. */
  imageUrl?: string;
};

/** A product image with its media uuid (for editable galleries). */
export type ProductMedia = { uuid: string; url: string };

/** Full admin-facing product record for the detail + edit screens. */
export type AdminProductDetail = {
  uuid: string;
  slug: string;
  name: string;
  /** Optional trailing substring of `name` rendered in gold on the detail hero. */
  nameAccent?: string;
  sku: string;
  category: ProductCategory;
  status: ProductStatus;
  badge?: ProductBadge;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  description: string;
  specs: ProductSpec[];
  compatibility: string[];
  /** Existing product images (uuid + url), in display order. */
  galleryMedia: ProductMedia[];
  featured: boolean;
  views: number;
  leads: number;
  preorders: number;
  createdAt: string;
  updatedAt: string;
  author: string;
};
