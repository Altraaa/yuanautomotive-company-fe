import type {
  ActivityItem,
  AdminNavGroup,
  AdminProductDetail,
  AdminProductRow,
  BarItem,
  DashboardStat,
  DonutSlice,
} from "@/types/ui/admin";

/**
 * MOCK admin dataset — stands in for the authenticated `await service()` / hook
 * fetches until the NestJS backend is wired. Swap these for `services/*` calls
 * (same return shapes) with no change to the components.
 */

export const adminBasePath = "/dashboard";

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Utama",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Produk", href: "/dashboard/produk", icon: "products", count: 42, countTone: "gold" },
      { label: "Blog", href: "/dashboard/blog", icon: "blog", count: 12, countTone: "grey" },
      { label: "News", href: "/dashboard/news", icon: "news", count: 6, countTone: "grey" },
    ],
  },
  {
    label: "Transaksi",
    items: [
      { label: "Leads", href: "/dashboard/leads", icon: "leads", count: 8, countTone: "red" },
      { label: "Pre-Order", href: "/dashboard/pre-order", icon: "orders", count: 5, countTone: "red" },
    ],
  },
  {
    label: "Konten",
    items: [
      { label: "FAQ", href: "/dashboard/faq", icon: "faq" },
      { label: "Kategori", href: "/dashboard/kategori", icon: "categories" },
      { label: "Media", href: "/dashboard/media", icon: "media" },
      { label: "CMS", href: "/dashboard/cms", icon: "cms" },
    ],
  },
];

export const dashboardStats: DashboardStat[] = [
  {
    label: "Produk",
    value: "42",
    hint: "published · 4 draft",
    hintHighlight: "38",
    hintTone: "green",
    accent: "gold",
  },
  {
    label: "Blog",
    value: "12",
    hint: "published · 2 draft",
    hintHighlight: "10",
    hintTone: "green",
    accent: "gold",
  },
  {
    label: "Leads",
    value: "130",
    hint: "baru belum ditangani",
    hintHighlight: "8",
    hintTone: "gold",
    accent: "red",
    delta: "12.5%",
    deltaDirection: "up",
  },
  {
    label: "Pre-Order",
    value: "76",
    hint: "· 5 baru",
    hintHighlight: "Est. Rp 154 jt",
    hintTone: "gold",
    accent: "gradient",
    delta: "3.2%",
    deltaDirection: "down",
  },
];

/** 30-day trend series for the two line charts. */
export const leadsTrend: number[] = [4, 6, 5, 7, 6, 9, 8, 7, 10, 9, 11, 10, 8, 11, 10, 12, 11, 13];
export const ordersTrend: number[] = [2, 3, 2, 4, 3, 5, 4, 3, 5, 4, 6, 5, 4, 3, 5, 4, 6, 5];

export const productsByCategory: DonutSlice[] = [
  { label: "Sparepart", value: 18, tone: "red" },
  { label: "Aksesoris", value: 15, tone: "gold" },
  { label: "Body Part", value: 9, tone: "grey" },
];

export const orderStatusBreakdown: DonutSlice[] = [
  { label: "New", value: 5, tone: "gold" },
  { label: "Processed", value: 18, tone: "muted" },
  { label: "Done", value: 40, tone: "green" },
  { label: "Cancelled", value: 13, tone: "red" },
];

export const topProducts: BarItem[] = [
  { label: "Charger Portable 7kW Type 2", value: 24, width: 100 },
  { label: 'Velg Aero 18" Gunmetal', value: 19, width: 79 },
  { label: "Kabel Charging Type 2 — 5 m", value: 15, width: 63 },
  { label: "Karpet Premium Full-Set EV", value: 11, width: 46 },
  { label: "Kampas Rem Regeneratif EV", value: 8, width: 33 },
];

export const recentLeads: ActivityItem[] = [
  { initials: "BS", title: "Bagus Santoso", subtitle: "Wuling Air EV", status: "NEW" },
  { initials: "KE", title: "Komunitas EV Nusantara", subtitle: "Hyundai Ioniq 5", status: "NEW" },
  { initials: "DP", title: "Dewi Pratama", subtitle: "BYD Atto 3", status: "CONTACTED" },
  { initials: "RW", title: "Bengkel Rama Watts", subtitle: "MG 4 EV", status: "CONTACTED" },
];

export const recentOrders: ActivityItem[] = [
  { initials: "AW", title: "Ari Wibowo", subtitle: "2 item · 6 Jul", status: "NEW" },
  { initials: "PV", title: "PT Volt Mandiri", subtitle: "5 item · 5 Jul", status: "PROCESSED" },
  { initials: "SL", title: "Sinta Larasati", subtitle: "1 item · 5 Jul", status: "DONE" },
  { initials: "GE", title: "Garasi Elektrik BSD", subtitle: "3 item · 4 Jul", status: "PROCESSED" },
];

export const adminProductRows: AdminProductRow[] = [
  { uuid: "yd-chg-7k2", name: "Charger Portable 7kW Type 2", sku: "YD-CHG-7K2", category: "Sparepart", price: 8450000, badge: "BARU", status: "Published" },
  { uuid: "yd-chg-22w", name: "Charger 22kW Wallbox", sku: "YD-CHG-22W", category: "Sparepart", price: 15900000, badge: "PRE-ORDER", status: "Published" },
  { uuid: "yd-vlg-18g", name: 'Velg Aero 18" Gunmetal', sku: "YD-VLG-18G", category: "Body Part", price: 12900000, badge: "HOT", status: "Published" },
  { uuid: "yd-brk-rgn", name: "Kampas Rem Regeneratif EV", sku: "YD-BRK-RGN", category: "Sparepart", price: 1250000, status: "Published" },
  { uuid: "yd-cbl-t2", name: "Kabel Charging Type 2 — 5 m", sku: "YD-CBL-T2", category: "Sparepart", price: 2150000, badge: "TERLARIS", status: "Published" },
  { uuid: "yd-int-krp", name: "Karpet Premium Full-Set EV", sku: "YD-INT-KRP", category: "Aksesoris", price: 950000, status: "Draft" },
  { uuid: "yd-acc-wbr", name: "Wall Bracket Charger Portable", sku: "YD-ACC-WBR", category: "Aksesoris", price: 450000, status: "Published" },
];

export const ADMIN_PRODUCTS_TOTAL = 42;

/** Full detail record for the flagship product (matches the design comp). */
const chargerDetail: AdminProductDetail = {
  uuid: "yd-chg-7k2",
  slug: "charger-portable-7kw",
  name: "Charger Portable 7kW Type 2",
  nameAccent: "7kW Type 2",
  sku: "YD-CHG-7K2",
  category: "Sparepart",
  status: "Published",
  badge: "BARU",
  retailPrice: 8450000,
  wholesalePrice: 7900000,
  stock: 24,
  description:
    "Charger portable 7 kW dengan konektor Type 2 standar IEC — solusi charging di rumah tanpa instalasi wallbox. Proteksi lengkap, tas penyimpanan termasuk.",
  specs: [
    { label: "Daya output", value: "7 kW (32 A, 1 fasa)" },
    { label: "Konektor", value: "Type 2 (IEC 62196-2)" },
    { label: "Input", value: "220–240 V AC" },
    { label: "Panjang kabel", value: "5 meter" },
    { label: "Proteksi", value: "IP65, over-current, over-heat" },
    { label: "Garansi", value: "12 bulan resmi distributor" },
  ],
  compatibility: ["BYD Atto 3", "Wuling Air EV", "Hyundai Ioniq 5", "MG 4 EV", "Universal Type 2"],
  galleryMedia: [],
  featured: true,
  views: 1240,
  leads: 18,
  preorders: 24,
  createdAt: "12 Jun 2026 · 09.24",
  updatedAt: "5 Jul 2026 · 14.02",
  author: "Admin Utama",
};

const detailOverrides: Record<string, AdminProductDetail> = {
  [chargerDetail.uuid]: chargerDetail,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Resolve an admin product detail by uuid. Returns the rich flagship record when
 * available, otherwise synthesises one from the list row so every detail/edit
 * route works against the mock catalog. Swap for `services/products.getAdminDetail`.
 */
export function getAdminProductDetail(uuid: string): AdminProductDetail | undefined {
  if (detailOverrides[uuid]) return detailOverrides[uuid];

  const row = adminProductRows.find((r) => r.uuid === uuid);
  if (!row) return undefined;

  return {
    uuid: row.uuid,
    slug: slugify(row.name),
    name: row.name,
    sku: row.sku,
    category: row.category,
    status: row.status,
    badge: row.badge,
    retailPrice: row.price,
    wholesalePrice: Math.round(row.price * 0.93),
    stock: 12,
    description: "Deskripsi produk belum dilengkapi. Perbarui melalui halaman edit produk.",
    specs: [
      { label: "Kategori", value: row.category },
      { label: "SKU", value: row.sku },
    ],
    compatibility: ["Universal EV"],
    galleryMedia: [],
    featured: false,
    views: 0,
    leads: 0,
    preorders: 0,
    createdAt: "—",
    updatedAt: "—",
    author: "Admin Utama",
  };
}

export function getAdminProductUuids(): string[] {
  return adminProductRows.map((r) => r.uuid);
}
