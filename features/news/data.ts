import type { NewsCardData, NewsDetailData, NewsType } from "@/types/ui/news";

/**
 * MOCK news content — Instagram Reels & Posters. Placeholder for the RSC news
 * service until the backend is wired. `uuid` maps to `slug` in the admin fallback.
 */

export const newsTypes: NewsType[] = ["Reels", "Poster"];

export const news: NewsDetailData[] = [
  {
    slug: "reels-unboxing-charger-portable-7kw",
    title: "Unboxing Charger Portable 7kW Type 2",
    type: "Reels",
    thumbnailUrl: "/placeholder-product-1.png",
    instagramUrl: "https://www.instagram.com/reel/placeholder-unboxing-7kw/",
    publishedAt: "2026-07-07",
    markNew: true,
    caption:
      "Lihat isi kotak Charger Portable 7kW Type 2 kami — dari konektor, kabel 5 meter, sampai tas penyimpanannya. Solusi charging di rumah tanpa instalasi wallbox. 🔌⚡",
  },
  {
    slug: "poster-promo-grosir-dealer-juli",
    title: "Promo Grosir Sparepart untuk Dealer — Juli",
    type: "Poster",
    thumbnailUrl: "/placeholder-product-5.png",
    instagramUrl: "https://www.instagram.com/p/placeholder-promo-grosir/",
    publishedAt: "2026-07-04",
    markNew: false,
    caption:
      "Harga khusus grosir untuk dealer & reseller sepanjang Juli. Katalog lengkap sparepart & aksesoris EV siap kirim ke seluruh Indonesia. DM untuk katalog & pricelist! 📦",
  },
  {
    slug: "reels-tips-rawat-baterai-ev-tropis",
    title: "3 Tips Cepat Merawat Baterai EV di Cuaca Panas",
    type: "Reels",
    thumbnailUrl: "/placeholder-product-2.png",
    instagramUrl: "https://www.instagram.com/reel/placeholder-tips-baterai/",
    publishedAt: "2026-06-30",
    markNew: false,
    caption:
      "Suhu tinggi bikin baterai cepat drop? Simak 3 kebiasaan sederhana biar baterai EV-mu awet di iklim tropis. Save & share ke teman komunitas EV! 🔋🌴",
  },
  {
    slug: "poster-velg-aero-18-gunmetal",
    title: 'Velg Aero 18" Gunmetal Kini Tersedia',
    type: "Poster",
    thumbnailUrl: "/placeholder-product-3.png",
    instagramUrl: "https://www.instagram.com/p/placeholder-velg-aero/",
    publishedAt: "2026-06-18",
    markNew: false,
    caption:
      "Tampil beda dengan Velg Aero 18\" finishing Gunmetal. Ringan, aerodinamis, dan bikin EV-mu makin agresif. Stok terbatas — cek link di bio! 🏁",
  },
  {
    slug: "reels-cara-pasang-wall-bracket-charger",
    title: "Cara Pasang Wall Bracket Charger Portable",
    type: "Reels",
    thumbnailUrl: "/placeholder-product-4.png",
    instagramUrl: "https://www.instagram.com/reel/placeholder-wall-bracket/",
    publishedAt: "2026-06-10",
    markNew: false,
    caption:
      "Tutorial singkat pasang wall bracket biar charger portable rapi tergantung di garasi. Cukup 5 menit, tanpa alat rumit. 🛠️",
  },
  {
    slug: "poster-tren-aksesoris-ev-2026",
    title: "Tren Aksesoris EV yang Naik Daun 2026",
    type: "Poster",
    thumbnailUrl: "/placeholder-product-6.png",
    instagramUrl: "https://www.instagram.com/p/placeholder-tren-2026/",
    publishedAt: "2026-05-28",
    markNew: false,
    caption:
      "Dari velg aero sampai karpet TPE food-grade — inilah aksesoris EV paling dicari tahun ini. Mana favoritmu? Komen di bawah! 👇",
  },
];

function toCard(n: NewsDetailData): NewsCardData {
  const { slug, title, type, thumbnailUrl, instagramUrl, publishedAt, markNew } = n;
  return { slug, title, type, thumbnailUrl, instagramUrl, publishedAt, markNew };
}

export function getAllNewsCards(): NewsCardData[] {
  return news.map(toCard);
}

export function getNewsBySlug(slug: string): NewsDetailData | undefined {
  return news.find((n) => n.slug === slug);
}

export function getRelatedNews(slug: string): NewsCardData[] {
  return news
    .filter((n) => n.slug !== slug)
    .map(toCard)
    .slice(0, 3);
}
