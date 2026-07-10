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
  location: "Sanur, Denpasar Selatan, Bali — Indonesia",
  // Physical coordinates (Sanur, Denpasar Selatan, Bali) — powers local SEO:
  // JSON-LD GeoCoordinates/PostalAddress + geo meta tags. Region ID-BA (ISO 3166-2 Bali).
  geo: {
    latitude: -8.704196391273282,
    longitude: 115.25126783844071,
    region: "ID-BA",
    placename: "Sanur, Denpasar Selatan",
    area: "Sanur",
    district: "Denpasar Selatan",
    city: "Denpasar",
  },
  whatsapp: {
    // International format, digits only (for wa.me links)
    number: "6289680854445",
    display: "0896-8085-4445",
    defaultMessage: "Halo Yuan Dewata Automotive, saya ingin bertanya tentang produk EV.",
  },
} as const;

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
