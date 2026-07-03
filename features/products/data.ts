import type {
  ProductCardData,
  ProductCategory,
  ProductDetailData,
} from "@/types/ui/product";

/**
 * MOCK product catalog — stands in for the RSC `await service()` fetch until the
 * NestJS backend is wired. Swap these helpers for `services/products.ts` calls
 * (same return shapes) with no change to the pages.
 */

export const productCategories: ProductCategory[] = [
  "Sparepart",
  "Aksesoris",
  "Interior",
  "Eksterior",
];

export const products: ProductDetailData[] = [
  {
    slug: "charger-portable-7kw-type-2",
    name: "Charger Portable 7kW Type 2",
    category: "Sparepart",
    price: 8450000,
    imageUrl: "/placeholder-product-1.png",
    badge: "BARU",
    description:
      "Charger portabel 7kW dengan konektor Type 2, cocok untuk pengisian harian di rumah maupun perjalanan. Dilengkapi proteksi arus, suhu, dan tegangan berlebih.",
    specs: [
      { label: "Daya Output", value: "7 kW (32A)" },
      { label: "Konektor", value: "Type 2 (IEC 62196)" },
      { label: "Input", value: "AC 220V Single Phase" },
      { label: "Panjang Kabel", value: "5 meter" },
      { label: "Proteksi", value: "OVP / OCP / OTP / Leakage" },
      { label: "Sertifikasi", value: "CE, TUV" },
    ],
    compatibility: ["Wuling", "Hyundai", "BYD", "Neta", "MG"],
    gallery: [
      "/placeholder-product-1.png",
      "/placeholder-product-3.png",
      "/placeholder-product-5.png",
    ],
  },
  {
    slug: "kampas-rem-regeneratif-ev",
    name: "Kampas Rem Regeneratif EV",
    category: "Sparepart",
    price: 1250000,
    imageUrl: "/placeholder-product-2.png",
    description:
      "Kampas rem low-dust khusus kendaraan listrik dengan regenerative braking. Umur pakai lebih panjang berkat beban pengereman yang lebih ringan.",
    specs: [
      { label: "Material", value: "Ceramic Composite" },
      { label: "Posisi", value: "Depan (sepasang)" },
      { label: "Suhu Kerja", value: "-40°C s/d 650°C" },
      { label: "Low Dust", value: "Ya" },
    ],
    compatibility: ["Wuling Air EV", "Hyundai Ioniq 5", "Ioniq 6"],
    gallery: ["/placeholder-product-2.png", "/placeholder-product-4.png"],
  },
  {
    slug: "velg-aero-18-gunmetal",
    name: 'Velg Aero 18" Gunmetal',
    category: "Eksterior",
    price: 12900000,
    imageUrl: "/placeholder-product-3.png",
    badge: "HOT",
    description:
      "Velg aerodinamis 18 inci finishing gunmetal, dirancang untuk mengurangi drag dan menambah jarak tempuh EV. Ringan namun kokoh (flow-formed).",
    specs: [
      { label: "Ukuran", value: '18" x 7.5J' },
      { label: "PCD", value: "5x114.3" },
      { label: "Offset", value: "ET40" },
      { label: "Finishing", value: "Gunmetal Matte" },
      { label: "Konstruksi", value: "Flow-Formed" },
    ],
    compatibility: ["Hyundai Ioniq 5", "Kia EV6", "BYD Atto 3"],
    gallery: [
      "/placeholder-product-3.png",
      "/placeholder-product-1.png",
      "/placeholder-product-6.png",
    ],
  },
  {
    slug: "karpet-premium-full-set-ev",
    name: "Karpet Premium Full-Set EV",
    category: "Interior",
    price: 950000,
    imageUrl: "/placeholder-product-4.png",
    description:
      "Karpet 3D full-set anti air dengan bibir tinggi, melindungi lantai kabin dari lumpur dan tumpahan. Pas presisi mengikuti kontur lantai EV.",
    specs: [
      { label: "Material", value: "TPE Food-Grade" },
      { label: "Model", value: "3D Full Coverage" },
      { label: "Anti Air", value: "Ya" },
      { label: "Isi", value: "Depan + Belakang + Bagasi" },
    ],
    compatibility: ["Wuling Air EV", "Wuling BinguoEV", "Seres"],
    gallery: ["/placeholder-product-4.png", "/placeholder-product-2.png"],
  },
  {
    slug: "fast-charger-dc-22kw",
    name: "Fast Charger DC 22kW Wallbox",
    category: "Sparepart",
    price: 24500000,
    imageUrl: "/placeholder-product-5.png",
    badge: "PRE-ORDER",
    description:
      "Wallbox DC 22kW untuk pengisian cepat di bengkel atau showroom. Layar sentuh, RFID, dan pemantauan energi terintegrasi.",
    specs: [
      { label: "Daya Output", value: "22 kW DC" },
      { label: "Konektor", value: "CCS2" },
      { label: "Layar", value: "7\" Touchscreen" },
      { label: "Konektivitas", value: "WiFi / RS485 / OCPP 1.6" },
    ],
    compatibility: ["Universal CCS2"],
    gallery: ["/placeholder-product-5.png", "/placeholder-product-3.png"],
  },
  {
    slug: "cover-jok-kulit-sintetis-ev",
    name: "Cover Jok Kulit Sintetis EV",
    category: "Interior",
    price: 1750000,
    imageUrl: "/placeholder-product-6.png",
    description:
      "Sarung jok kulit sintetis premium jahitan presisi, tahan lama dan mudah dibersihkan. Kompatibel dengan sensor airbag samping.",
    specs: [
      { label: "Material", value: "PU Leather Grade A" },
      { label: "Jahitan", value: "Double Stitch" },
      { label: "Airbag Ready", value: "Ya" },
      { label: "Isi", value: "Full-Set 5 Kursi" },
    ],
    compatibility: ["Wuling", "Hyundai", "MG", "Chery"],
    gallery: ["/placeholder-product-6.png", "/placeholder-product-4.png"],
  },
  {
    slug: "spoiler-belakang-carbon-look",
    name: "Spoiler Belakang Carbon Look",
    category: "Eksterior",
    price: 2200000,
    imageUrl: "/placeholder-product-1.png",
    badge: "HOT",
    description:
      "Spoiler ducktail bermotif serat karbon, menambah kesan sporty sekaligus kestabilan aerodinamis di kecepatan tinggi.",
    specs: [
      { label: "Material", value: "ABS Carbon Print" },
      { label: "Pemasangan", value: "3M Tape + Bracket" },
      { label: "Warna", value: "Carbon Gloss" },
    ],
    compatibility: ["Hyundai Ioniq 5", "BYD Seal"],
    gallery: ["/placeholder-product-1.png", "/placeholder-product-5.png"],
  },
  {
    slug: "kabel-charging-mode-3-universal",
    name: "Kabel Charging Mode 3 Universal",
    category: "Aksesoris",
    price: 1650000,
    imageUrl: "/placeholder-product-2.png",
    badge: "TERLARIS",
    description:
      "Kabel charging Mode 3 Type 2 ke Type 2, 32A. Fleksibel di suhu rendah, jaket tebal tahan gesekan untuk penggunaan publik.",
    specs: [
      { label: "Arus", value: "32A" },
      { label: "Konektor", value: "Type 2 ↔ Type 2" },
      { label: "Panjang", value: "5 meter" },
      { label: "Rating", value: "IP54" },
    ],
    compatibility: ["Universal Type 2"],
    gallery: ["/placeholder-product-2.png", "/placeholder-product-6.png"],
  },
];

export const featuredSlugs = [
  "charger-portable-7kw-type-2",
  "kampas-rem-regeneratif-ev",
  "velg-aero-18-gunmetal",
  "karpet-premium-full-set-ev",
];

function toCard(p: ProductDetailData): ProductCardData {
  const { slug, name, category, price, imageUrl, badge } = p;
  return { slug, name, category, price, imageUrl, badge };
}

export function getAllProductCards(): ProductCardData[] {
  return products.map(toCard);
}

export function getFeaturedProductCards(): ProductCardData[] {
  return featuredSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is ProductDetailData => Boolean(p))
    .map(toCard);
}

export function getProductBySlug(slug: string): ProductDetailData | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, category: ProductCategory): ProductCardData[] {
  return products
    .filter((p) => p.slug !== slug && p.category === category)
    .map(toCard)
    .slice(0, 4);
}

export type PriceRangeKey = "under-1" | "1-5" | "5-15" | "over-15";

export const priceRanges: { key: PriceRangeKey; label: string; min: number; max: number }[] = [
  { key: "under-1", label: "< Rp 1 jt", min: 0, max: 1_000_000 },
  { key: "1-5", label: "Rp 1 – 5 jt", min: 1_000_000, max: 5_000_000 },
  { key: "5-15", label: "Rp 5 – 15 jt", min: 5_000_000, max: 15_000_000 },
  { key: "over-15", label: "> Rp 15 jt", min: 15_000_000, max: Number.POSITIVE_INFINITY },
];

export type ProductSort = "terbaru" | "termurah" | "termahal";

export type ProductFilters = {
  category?: string;
  price?: string;
  sort?: string;
  page?: number;
};

export const PRODUCTS_PER_PAGE = 6;

function matchesCategory(p: ProductCardData, category?: string): boolean {
  if (!category) return true;
  return p.category.toLowerCase() === category.toLowerCase();
}

function matchesPrice(p: ProductCardData, priceKey?: string): boolean {
  if (!priceKey) return true;
  const range = priceRanges.find((r) => r.key === priceKey);
  if (!range) return true;
  return p.price >= range.min && p.price < range.max;
}

/** Filter + sort + paginate the mock catalog (mirrors what the list service will do). */
export function queryProducts(filters: ProductFilters): {
  items: ProductCardData[];
  total: number;
  totalPages: number;
  page: number;
} {
  const all = getAllProductCards().filter(
    (p) => matchesCategory(p, filters.category) && matchesPrice(p, filters.price)
  );

  const sorted = [...all];
  if (filters.sort === "termurah") sorted.sort((a, b) => a.price - b.price);
  else if (filters.sort === "termahal") sorted.sort((a, b) => b.price - a.price);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const items = sorted.slice(start, start + PRODUCTS_PER_PAGE);

  return { items, total, totalPages, page };
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
