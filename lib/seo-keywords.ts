/**
 * Peta kata kunci SEO — sumber tunggal strategi keyword situs.
 *
 * Terdiri dari:
 *  1. `brandCore`      — kata kunci brand + kategori + lokasi inti (dipakai di
 *                        SEMUA halaman agar sinyal topikal & lokal konsisten).
 *  2. `pageKeywords`   — kata kunci spesifik per halaman (intent berbeda-beda).
 *  3. `keywordsFor()`  — helper penggabung: page keyword + brandCore (dedup).
 *  4. `withBrand()`    — untuk halaman dinamis (produk/blog/news detail) yang
 *                        merakit keyword dari entitas, lalu ditempel brandCore.
 *
 * Strategi: kombinasi lokal (Bali/Denpasar) + transaksional (jual, harga, katalog)
 * + produk (sparepart mobil China/Wuling + lini mobil listrik) + informasional
 * (blog/news). Google mengabaikan meta keywords untuk ranking, tetapi field ini
 * tetap dipakai Bing/Yandex dan jadi acuan tunggal tim konten untuk heading,
 * copy, dan schema — di situlah keyword benar-benar bekerja.
 *
 * Catatan: keyword per-halaman MENIMPA keyword layout di Next.js (bukan gabung),
 * karena itu setiap halaman wajib memakai keywordsFor()/withBrand() agar brandCore
 * ikut terbawa.
 */

/** Kata kunci inti brand + kategori + lokasi — relevan di seluruh situs. */
export const brandCore: string[] = [
  "Yuan Dewata Automotive",
  "Yuan Dewata Timur",
  "sparepart mobil China",
  "aksesoris mobil China",
  // Ejaan "Cina" — varian pencarian dominan di Indonesia (wajib ada berdampingan)
  "sparepart mobil Cina",
  "spare part mobil Cina",
  "aksesoris mobil Cina",
  "body part mobil Cina",
  "body parts mobil Cina",
  "sparepart mobil listrik",
  "aksesoris mobil listrik",
  // Nasional — jangkauan seluruh Indonesia
  "sparepart mobil China Indonesia",
  "sparepart mobil listrik Indonesia",
  "jual sparepart mobil China online",
  "kirim sparepart mobil seluruh Indonesia",
  // Lokal — basis Bali / Denpasar
  "sparepart mobil China Bali",
  "sparepart mobil Denpasar",
  "sparepart mobil Sanur Denpasar Selatan",
];

/** Kata kunci per halaman (intent spesifik). Gabung dengan brandCore via keywordsFor(). */
export const pageKeywords = {
  home: [
    "sparepart original mobil listrik",
    "sparepart & aksesoris mobil China",
    "spare part body parts aksesoris mobil Cina",
    "aksesoris mobil Cina original",
    "body parts mobil Cina",
    "importir langsung sparepart mobil listrik",
    "one stop sparepart mobil China",
    "jual sparepart aksesoris EV Indonesia",
    "body part mobil listrik original",
    "toko sparepart mobil China",
  ],
  company: [
    "tentang Yuan Dewata Automotive",
    "importir sparepart mobil China",
    "distributor sparepart mobil listrik",
    "distributor body parts aksesoris mobil Cina",
    "pre-order sparepart mobil China langka",
    "sparepart original mobil China terjangkau",
    "body part original mobil Cina",
    "mitra dealer reseller sparepart EV",
  ],
  product: [
    // Katalog nyata — sparepart mobil China / Wuling
    "katalog sparepart mobil China",
    "sparepart Wuling original",
    // Body parts & aksesoris mobil Cina (kluster kategori)
    "body parts mobil Cina",
    "bumper mobil Cina",
    "kap mesin mobil Cina",
    "fender mobil Cina",
    "spion mobil Cina",
    "grill depan mobil Cina",
    "lampu mobil Cina",
    "aksesoris mobil Cina",
    "aksesoris interior mobil Cina",
    "aksesoris eksterior mobil Cina",
    "kampas rem mobil",
    "kampas kopling mobil",
    "matahari kopling",
    "filter udara mobil",
    "filter oli mobil",
    "filter bensin mobil",
    "filter AC kabin mobil",
    "shockbreaker mobil",
    "piringan cakram rem depan",
    "bearing roda depan",
    "busi mobil",
    "fan belt mobil",
    "tie rod mobil",
    "bohlam lampu mobil",
    "release bearing kopling",
    "harga sparepart mobil China",
    // Lini mobil listrik / EV (dipertahankan)
    "katalog sparepart mobil listrik",
    "jual aksesoris mobil listrik",
    "charger mobil listrik Type 2",
    "kampas rem regeneratif EV",
    "velg mobil listrik",
    "karpet mobil listrik",
    "cover jok mobil listrik",
    "kabel charging Type 2 Mode 3",
  ],
  news: [
    "konten Instagram Yuan Dewata Automotive",
    "reels mobil listrik",
    "video tips mobil listrik",
    "konten aksesoris mobil China",
    "konten body parts aksesoris mobil Cina",
    "Instagram sparepart mobil listrik Indonesia",
  ],
  blog: [
    "tips perawatan mobil listrik",
    "panduan sparepart mobil listrik",
    "cara merawat kampas rem EV",
    "panduan charger mobil listrik",
    "berita mobil listrik Indonesia",
    "cara memilih velg mobil listrik",
  ],
  contact: [
    "kontak Yuan Dewata Automotive",
    "WhatsApp sparepart mobil listrik",
    "konsultasi sparepart EV",
    "harga grosir sparepart mobil China",
    "harga grosir body parts aksesoris mobil Cina",
    "cek stok sparepart mobil listrik",
    "kemitraan dealer reseller sparepart mobil listrik",
  ],
  privacy: [
    "kebijakan privasi Yuan Dewata Automotive",
    "perlindungan data pribadi UU PDP",
  ],
} as const;

export type PageKeywordKey = keyof typeof pageKeywords;

/** Tempelkan brandCore ke sekumpulan keyword apa pun, tanpa duplikat. */
export function withBrand(extra: readonly string[]): string[] {
  return Array.from(new Set([...extra, ...brandCore]));
}

/** Gabungkan keyword spesifik halaman dengan brandCore, tanpa duplikat. */
export function keywordsFor(page: PageKeywordKey): string[] {
  return withBrand(pageKeywords[page]);
}
