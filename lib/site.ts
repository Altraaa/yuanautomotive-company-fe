/**
 * SITE CONSTANTS — brand identity + contact channels.
 * Sourced from the approved design comp (Yuan Dewata Automotive).
 * Keep copy/contact details here so components stay presentational.
 */

export const site = {
  name: "Yuan Dewata Automotive",
  shortName: "Yuan Dewata",
  tagline: "AUTOMOTIVE",
  description:
    "Sparepart dan aksesoris mobil listrik dengan spesifikasi teknis lengkap untuk komunitas EV, bengkel, dealer, dan reseller di Indonesia.",
  url: "https://automotive.yuandewatatimur.com",
  locale: "id_ID",
  email: "info@yuandewata.id",
  location: "Denpasar, Bali — Indonesia",
  whatsapp: {
    // International format, digits only (for wa.me links)
    number: "6289680854445",
    display: "0896-8085-4445",
    defaultMessage: "Halo Yuan Dewata Automotive, saya ingin bertanya tentang produk EV.",
  },
} as const;

/**
 * UNIVERSAL keywords — brand + core categories, inherited by every page via the
 * root layout. Page-level metadata can append its own cluster (see SEO-KEYWORDS.md).
 * Note: Google ignores <meta keywords>; kept for Bing/other engines + consistency.
 */
export const siteKeywords: string[] = [
  "Yuan Dewata Automotive",
  "Yuan Dewata Timur",
  "sparepart mobil listrik",
  "aksesoris mobil listrik",
  "sparepart mobil China",
  "aksesoris mobil China",
  "body part mobil listrik",
  "importir sparepart mobil listrik",
  "jual sparepart EV",
  "toko sparepart mobil listrik",
  "distributor aksesoris mobil China",
  "pre-order sparepart mobil China",
  "sparepart EV original",
  "sparepart mobil listrik Bali",
  "sparepart mobil listrik Denpasar",
];

export function waLink(message?: string): string {
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tentang", label: "Company" },
  { href: "/produk", label: "Product" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/kontak", label: "Contact" },
] as const;
