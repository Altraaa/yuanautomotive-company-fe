import type { BlogCardData, BlogCategory, BlogDetailData } from "@/types/ui/blog";

/**
 * MOCK blog content — placeholder for the RSC blog service until the backend is wired.
 */

export const blogCategories: BlogCategory[] = ["Tips", "Rilis", "Panduan", "Berita"];

const body = (intro: string): string => `
  <p>${intro}</p>
  <h2>Kenapa Ini Penting</h2>
  <p>Kendaraan listrik memiliki karakteristik perawatan yang berbeda dari mobil konvensional. Memahami detailnya membantu memperpanjang umur komponen dan menjaga efisiensi jarak tempuh.</p>
  <ul>
    <li>Perhatikan siklus pengisian baterai secara berkala.</li>
    <li>Gunakan sparepart dengan spesifikasi yang sesuai.</li>
    <li>Lakukan inspeksi rutin pada sistem pengereman regeneratif.</li>
  </ul>
  <h2>Kesimpulan</h2>
  <p>Dengan pemilihan komponen yang tepat dan perawatan berkala, performa EV tetap optimal dalam jangka panjang. Tim kami siap membantu memilih sparepart yang sesuai dengan kendaraan Anda.</p>
`;

export const blogs: BlogDetailData[] = [
  {
    slug: "5-cara-merawat-baterai-ev-iklim-tropis",
    title: "5 Cara Merawat Baterai EV di Iklim Tropis",
    category: "Tips",
    excerpt:
      "Suhu tinggi mempercepat degradasi baterai. Berikut lima kebiasaan sederhana yang menjaga kesehatan baterai EV Anda di Indonesia.",
    imageUrl: "/placeholder-product-1.png",
    publishedAt: "2026-06-28",
    readingMinutes: 5,
    author: "Tim Yuan Dewata",
    contentHtml: body(
      "Iklim tropis Indonesia menghadirkan tantangan tersendiri bagi kesehatan baterai kendaraan listrik."
    ),
  },
  {
    slug: "charger-22kw-tersedia-pre-order",
    title: "Charger 22kW Kini Tersedia untuk Pre-Order",
    category: "Rilis",
    excerpt:
      "Wallbox DC 22kW terbaru kami resmi dibuka untuk pre-order — solusi pengisian cepat untuk bengkel dan showroom.",
    imageUrl: "/placeholder-product-5.png",
    publishedAt: "2026-06-21",
    readingMinutes: 3,
    author: "Tim Yuan Dewata",
    contentHtml: body(
      "Kami dengan bangga memperkenalkan wallbox DC 22kW yang kini dibuka untuk pemesanan awal."
    ),
  },
  {
    slug: "memilih-kabel-charging-yang-tepat",
    title: "Memilih Kabel Charging yang Tepat untuk EV-mu",
    category: "Panduan",
    excerpt:
      "Mode 2 atau Mode 3? Type 1 atau Type 2? Panduan singkat memilih kabel charging yang aman dan sesuai kebutuhan.",
    imageUrl: "/placeholder-product-2.png",
    publishedAt: "2026-06-14",
    readingMinutes: 6,
    author: "Tim Yuan Dewata",
    contentHtml: body(
      "Memilih kabel charging yang tepat memastikan pengisian aman dan efisien untuk kendaraan listrik Anda."
    ),
  },
  {
    slug: "tren-aksesoris-ev-2026",
    title: "Tren Aksesoris EV yang Naik Daun di 2026",
    category: "Berita",
    excerpt:
      "Dari velg aero hingga interior TPE food-grade — inilah aksesoris EV yang paling banyak dicari tahun ini.",
    imageUrl: "/placeholder-product-3.png",
    publishedAt: "2026-06-05",
    readingMinutes: 4,
    author: "Tim Yuan Dewata",
    contentHtml: body(
      "Industri aksesoris kendaraan listrik berkembang pesat, dengan sejumlah tren baru yang menonjol di 2026."
    ),
  },
  {
    slug: "regenerative-braking-panduan-lengkap",
    title: "Regenerative Braking: Panduan Lengkap untuk Pemula",
    category: "Panduan",
    excerpt:
      "Bagaimana pengereman regeneratif bekerja dan mengapa kampas rem EV bisa bertahan jauh lebih lama.",
    imageUrl: "/placeholder-product-4.png",
    publishedAt: "2026-05-29",
    readingMinutes: 7,
    author: "Tim Yuan Dewata",
    contentHtml: body(
      "Pengereman regeneratif adalah salah satu inovasi utama kendaraan listrik yang mengubah cara kita memahami perawatan rem."
    ),
  },
  {
    slug: "grosir-sparepart-untuk-dealer",
    title: "Program Grosir Sparepart untuk Dealer & Reseller",
    category: "Rilis",
    excerpt:
      "Harga khusus, katalog lengkap, dan dukungan teknis — kenali program kemitraan grosir kami.",
    imageUrl: "/placeholder-product-6.png",
    publishedAt: "2026-05-20",
    readingMinutes: 3,
    author: "Tim Yuan Dewata",
    contentHtml: body(
      "Program kemitraan grosir kami dirancang untuk mendukung dealer dan reseller di seluruh Indonesia."
    ),
  },
];

function toCard(b: BlogDetailData): BlogCardData {
  const { slug, title, category, excerpt, imageUrl, publishedAt, readingMinutes } = b;
  return { slug, title, category, excerpt, imageUrl, publishedAt, readingMinutes };
}

export function getAllBlogCards(): BlogCardData[] {
  return blogs.map(toCard);
}

export function getFeaturedBlog(): BlogCardData {
  return toCard(blogs[0]);
}

export function getBlogBySlug(slug: string): BlogDetailData | undefined {
  return blogs.find((b) => b.slug === slug);
}

export function getRelatedBlogs(slug: string): BlogCardData[] {
  return blogs
    .filter((b) => b.slug !== slug)
    .map(toCard)
    .slice(0, 3);
}
