/**
 * Query Key Factory for TanStack Query.
 * Centralized, typed query keys to prevent inconsistencies.
 * Pattern: domain → sub-feature → params
 */

export const qk = {
  // ═══════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },

  // ═══════════════════════════════════════════════════════════
  // PRODUCTS (PUBLIC + ADMIN)
  // ═══════════════════════════════════════════════════════════
  products: {
    all: ["products"] as const,
    lists: () => [["products", "list"]] as const,
    list: (params: { page?: number; limit?: number; categoryId?: string }) =>
      ["products", "list", params] as const,
    bySlug: (slug: string) => ["products", "slug", slug] as const,
    adminLists: () => [["products", "admin", "list"]] as const,
    adminList: (params: { page?: number; limit?: number }) =>
      ["products", "admin", "list", params] as const,
    adminDetail: (uuid: string) => ["products", "admin", uuid] as const,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════════════════
  categories: {
    all: ["categories"] as const,
    lists: () => [["categories", "list"]] as const,
    list: () => ["categories", "list"] as const,
  },

  // ═══════════════════════════════════════════════════════════
  // BLOGS (PUBLIC + ADMIN)
  // ═══════════════════════════════════════════════════════════
  blogs: {
    all: ["blogs"] as const,
    lists: () => [["blogs", "list"]] as const,
    list: (params: { page?: number; limit?: number }) =>
      ["blogs", "list", params] as const,
    bySlug: (slug: string) => ["blogs", "slug", slug] as const,
    adminLists: () => [["blogs", "admin", "list"]] as const,
    adminList: (params: { page?: number; limit?: number }) =>
      ["blogs", "admin", "list", params] as const,
    adminDetail: (uuid: string) => ["blogs", "admin", uuid] as const,
  },

  // ═══════════════════════════════════════════════════════════
  // CONTACTS (LEADS)
  // ═══════════════════════════════════════════════════════════
  contacts: {
    all: ["contacts"] as const,
    lists: () => [["contacts", "list"]] as const,
    list: (params: { page?: number; limit?: number; status?: string }) =>
      ["contacts", "list", params] as const,
  },

  // ═══════════════════════════════════════════════════════════
  // ORDERS (PRE-ORDER)
  // ═══════════════════════════════════════════════════════════
  orders: {
    all: ["orders"] as const,
    lists: () => [["orders", "list"]] as const,
    list: (params: { page?: number; limit?: number; status?: string }) =>
      ["orders", "list", params] as const,
  },

  // ═══════════════════════════════════════════════════════════
  // CMS (DYNAMIC CONTENT)
  // ═══════════════════════════════════════════════════════════
  cms: {
    all: ["cms"] as const,
    section: (key: string) => ["cms", "section", key] as const,
  },

  // ═══════════════════════════════════════════════════════════
  // MEDIA
  // ═══════════════════════════════════════════════════════════
  media: {
    all: ["media"] as const,
    uploads: () => [["media", "uploads"]] as const,
  },
} as const;
