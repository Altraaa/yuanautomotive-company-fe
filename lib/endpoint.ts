/**
 * ENDPOINT REGISTRY
 * 
 * Single source of truth for all backend API paths.
 * - No `/api` prefix
 * - No `/admin` segment (role separation is by JWT)
 * - Public detail endpoints use SLUG (SEO)
 * - Admin endpoints use UUID (internal)
 * 
 * Usage: endpoints.products.list, endpoints.products.detailBySlug(slug)
 */

export const endpoints = {
  // ═══════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════
  auth: {
    login: "/auth/login",
    me: "/auth/me",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },

  // ═══════════════════════════════════════════════════════════
  // PRODUCTS — Public (by slug) + Admin (by uuid)
  // ═══════════════════════════════════════════════════════════
  products: {
    // Public
    list: "/products",
    detailBySlug: (slug: string) => `/products/slug/${slug}`,

    // Admin
    adminList: "/products",
    adminDetail: (uuid: string) => `/products/${uuid}`,
    adminCreate: "/products",
    adminUpdate: (uuid: string) => `/products/${uuid}`,
    adminDelete: (uuid: string) => `/products/${uuid}`,
    adminBulkDelete: "/products/bulk/delete",
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════════════════
  categories: {
    list: "/categories",
    detail: (uuid: string) => `/categories/${uuid}`,
    create: "/categories",
    update: (uuid: string) => `/categories/${uuid}`,
    delete: (uuid: string) => `/categories/${uuid}`,
  },

  // ═══════════════════════════════════════════════════════════
  // BLOGS — Public (by slug) + Admin (by uuid)
  // ═══════════════════════════════════════════════════════════
  blogs: {
    // Public
    list: "/blogs",
    detailBySlug: (slug: string) => `/blogs/slug/${slug}`,

    // Admin
    adminList: "/blogs",
    adminDetail: (uuid: string) => `/blogs/${uuid}`,
    adminCreate: "/blogs",
    adminUpdate: (uuid: string) => `/blogs/${uuid}`,
    adminDelete: (uuid: string) => `/blogs/${uuid}`,
    adminBulkDelete: "/blogs/bulk/delete",
  },

  // ═══════════════════════════════════════════════════════════
  // NEWS — Instagram content (Reels / Poster). Public (by slug) + Admin (by uuid)
  // ═══════════════════════════════════════════════════════════
  news: {
    // Public
    list: "/news",
    detailBySlug: (slug: string) => `/news/slug/${slug}`,

    // Admin
    adminList: "/news",
    adminDetail: (uuid: string) => `/news/${uuid}`,
    adminCreate: "/news",
    adminUpdate: (uuid: string) => `/news/${uuid}`,
    adminDelete: (uuid: string) => `/news/${uuid}`,
    adminBulkDelete: "/news/bulk/delete",
  },

  // ═══════════════════════════════════════════════════════════
  // FAQ — "Pertanyaan Umum". One `/faqs` path; shape depends on auth.
  // ═══════════════════════════════════════════════════════════
  faqs: {
    // Public (published only) + Admin (all rows with Bearer token)
    list: "/faqs",

    // Admin (by uuid)
    adminList: "/faqs",
    adminDetail: (uuid: string) => `/faqs/${uuid}`,
    adminCreate: "/faqs",
    adminUpdate: (uuid: string) => `/faqs/${uuid}`,
    adminDelete: (uuid: string) => `/faqs/${uuid}`,
    adminBulkDelete: "/faqs/bulk/delete",
  },

  // ═══════════════════════════════════════════════════════════
  // CONTACTS (LEAD GENERATION)
  // ═══════════════════════════════════════════════════════════
  contacts: {
    create: "/contacts", // Public
    adminList: "/contacts",
    adminDetail: (uuid: string) => `/contacts/${uuid}`,
    adminUpdate: (uuid: string) => `/contacts/${uuid}`,
    adminDelete: (uuid: string) => `/contacts/${uuid}`,
    adminBulkDelete: "/contacts/bulk/delete",
  },

  // ═══════════════════════════════════════════════════════════
  // ORDERS (PRE-ORDER)
  // ═══════════════════════════════════════════════════════════
  orders: {
    create: "/orders", // Public
    adminList: "/orders",
    adminDetail: (uuid: string) => `/orders/${uuid}`,
    adminUpdate: (uuid: string) => `/orders/${uuid}`,
    adminDelete: (uuid: string) => `/orders/${uuid}`,
    adminBulkDelete: "/orders/bulk/delete",
  },

  // ═══════════════════════════════════════════════════════════
  // MEDIA (UPLOAD)
  // ═══════════════════════════════════════════════════════════
  media: {
    upload: "/media/upload", // multipart/form-data, field `file`
    uploadMany: "/media/upload-many", // multipart/form-data, field `files` (max 20)
    delete: (uuid: string) => `/media/${uuid}`,
  },

  // ═══════════════════════════════════════════════════════════
  // CMS (DYNAMIC CONTENT)
  // ═══════════════════════════════════════════════════════════
  cms: {
    bySection: (key: string) => `/cms/${key}`,
    update: (key: string) => `/cms/${key}`,
  },

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD / ANALYTICS (admin aggregation)
  // ═══════════════════════════════════════════════════════════
  dashboard: {
    summary: "/dashboard/summary",
    timeseries: "/dashboard/timeseries",
    productsByCategory: "/dashboard/products-by-category",
    topProducts: "/dashboard/top-products",
    statusBreakdown: "/dashboard/status-breakdown",
    recent: "/dashboard/recent",
  },
} as const;
