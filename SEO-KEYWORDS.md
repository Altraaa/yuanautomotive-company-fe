# 🔍 SEO KEYWORD MAP — Yuan Dewata Automotive

> Sumber: telaah seluruh konten `app/(public)/*`, `lib/site.ts`, `features/products/data.ts`.
> Target pasar: **Indonesia (id_ID)**, fokus geo **Bali / Denpasar**, skala nasional.
> Tujuan: setiap halaman punya *keyword cluster* yang jelas (primary → secondary → long-tail)
> agar lebih mudah ditemukan lewat mesin pencari.

## ⚠️ Catatan positioning (penting)

Brand punya **dua sumbu produk** yang harus sama-sama dioptimasi:

| Sumbu | Muncul di | Contoh istilah |
|---|---|---|
| **Mobil listrik / EV** | `site.ts`, katalog produk | charger EV, kampas rem regeneratif, kabel Type 2, wallbox DC |
| **Mobil buatan China** | Hero, halaman Tentang | sparepart mobil China, body part mobil Cina, importir langsung |
| **Brand kompatibilitas** | `compatibility[]` tiap produk | Wuling Air EV, Hyundai Ioniq 5, BYD Atto 3, Neta, MG, Chery, Kia EV6, Seres |

> Rekomendasi: **jangan pilih salah satu** — gabungkan. Banyak mobil China yang beredar
> adalah EV (Wuling, BYD, Neta, Seres), jadi kedua istilah menyasar audiens yang sama.
> Istilah **brand kompatibilitas** adalah tambang long-tail dengan intent beli tertinggi
> ("kampas rem Ioniq 5", "karpet Wuling Air EV") dan wajib dipakai di halaman detail produk.

> **Realita meta `keywords`:** Google mengabaikan tag `<meta name="keywords">`. Nilai SEO
> sesungguhnya ada di **title, description, H1/H2, alt gambar, dan isi konten**. Daftar
> keyword di bawah dipakai sebagai (a) referensi copywriting, dan (b) tetap ditanam ke
> `metadata.keywords` untuk Bing/mesin lain & konsistensi internal — bukan andalan utama.

---

## 🌐 UNIVERSAL (site-wide / brand)

Ditanam sekali di `lib/site.ts` (`siteKeywords`) dan diwarisi semua halaman lewat root layout.

**Brand & entitas**
- Yuan Dewata Automotive
- Yuan Dewata Timur
- automotive Yuan Dewata

**Primary (kategori inti)**
- sparepart mobil listrik
- aksesoris mobil listrik
- sparepart mobil China
- aksesoris mobil China
- body part mobil listrik

**Secondary (peran & model bisnis)**
- importir sparepart mobil listrik
- jual sparepart EV
- toko sparepart mobil listrik
- distributor aksesoris mobil China
- pre-order sparepart mobil China
- sparepart EV original

**Geo**
- sparepart mobil listrik Bali
- sparepart mobil listrik Denpasar
- toko aksesoris mobil listrik Bali

---

## 🏠 HOME — `/`

**Intent:** brand + kategori inti + kepercayaan (importir langsung, original).

- Primary: `sparepart original mobil listrik`, `sparepart & aksesoris mobil China`
- Secondary: `importir langsung sparepart mobil listrik`, `one stop sparepart mobil China`, `jual sparepart aksesoris EV Indonesia`, `body part mobil listrik original`
- Long-tail: `beli sparepart mobil listrik original Indonesia`, `importir sparepart mobil China terpercaya`

**Title (≤60 char):** `Yuan Dewata Automotive — Sparepart & Aksesoris Mobil Listrik`
**Description:** *(sudah ada di `site.description`, pertahankan)*

---

## ℹ️ TENTANG — `/tentang`

**Intent:** kredibilitas perusahaan + layanan pre-order langka.

- Primary: `tentang Yuan Dewata Automotive`, `importir sparepart mobil China`
- Secondary: `distributor sparepart mobil listrik`, `pre-order sparepart mobil China langka`, `sparepart original mobil China terjangkau`
- Long-tail: `cara pesan sparepart mobil China yang langka`, `mitra dealer reseller sparepart EV`

**Title:** `Tentang Kami — Profil Perusahaan` *(sudah baik)*

---

## 🛒 PRODUK (katalog) — `/produk`

**Intent:** browsing kategori + harga. Ini halaman komersial utama.

- Primary: `katalog sparepart mobil listrik`, `jual aksesoris mobil listrik`
- Secondary (per kategori & produk nyata):
  - `charger mobil listrik` / `charger portable EV` / `wallbox DC fast charger`
  - `kampas rem mobil listrik` / `kampas rem regeneratif EV`
  - `velg mobil listrik` / `velg aero EV`
  - `karpet mobil listrik` / `karpet 3D EV`
  - `cover jok mobil listrik` / `spoiler body part mobil listrik`
  - `kabel charging Type 2 Mode 3`
- Long-tail: `harga charger mobil listrik Type 2`, `velg 18 inch mobil listrik`, `karpet full set Wuling Air EV`

**Title:** `Produk — Katalog Sparepart & Aksesoris EV` *(sudah baik)*

---

## 📦 PRODUK DETAIL — `/produk/[slug]` (dinamis)

**Intent:** intent beli tertinggi. Keyword dirakit otomatis dari entitas produk.

Rumus: `[nama produk]` + `[kategori]` + `[tiap merek di compatibility]` + `sparepart mobil listrik`

Contoh untuk `charger-portable-7kw-type-2`:
- `Charger Portable 7kW Type 2`, `charger EV Type 2`, `charger Wuling`, `charger Hyundai`,
  `charger BYD`, `charger Neta`, `charger MG`, `sparepart mobil listrik`

Contoh untuk `kampas-rem-regeneratif-ev`:
- `Kampas Rem Regeneratif EV`, `kampas rem mobil listrik`, `kampas rem Wuling Air EV`,
  `kampas rem Hyundai Ioniq 5`, `kampas rem Ioniq 6`

> **Aksi:** `generateMetadata` diperluas untuk menghasilkan `keywords` dari
> `product.name`, `product.category`, dan `product.compatibility`.

---

## 📰 NEWS — `/news`

**Intent:** konten sosial (Instagram Reels & poster).

- Primary: `konten Instagram Yuan Dewata Automotive`
- Secondary: `reels mobil listrik`, `video tips mobil listrik`, `konten aksesoris mobil China`
- Long-tail: `Instagram sparepart mobil listrik Indonesia`

**Detail `/news/[slug]`:** keyword dari `title` + `type` (Reels/Poster) + `mobil listrik`.

---

## 📝 BLOG — `/blog`

**Intent:** edukasi & discovery (top of funnel).

- Primary: `tips perawatan mobil listrik`, `panduan sparepart mobil listrik`
- Secondary: `cara merawat kampas rem EV`, `panduan charger mobil listrik`, `berita mobil listrik Indonesia`
- Long-tail: `cara memilih velg mobil listrik`, `perbedaan Type 2 CCS2 charger`

**Detail `/blog/[slug]`:** keyword dari `title` + `category` + `mobil listrik` (+ tags jika ada).

---

## 📞 KONTAK — `/kontak`

**Intent:** konversi lead + harga grosir + kemitraan.

- Primary: `kontak Yuan Dewata Automotive`, `WhatsApp sparepart mobil listrik`
- Secondary: `konsultasi sparepart EV`, `harga grosir sparepart mobil China`, `cek stok sparepart mobil listrik`
- Long-tail: `kemitraan dealer reseller sparepart mobil listrik`, `harga dealer aksesoris mobil China`

**Title:** `Kontak — Hubungi Tim Kami` *(sudah baik)*

---

## 🔒 KEBIJAKAN PRIVASI — `/kebijakan-privasi`

Bukan halaman komersial — keyword minimal, tetap `index`.
- `kebijakan privasi Yuan Dewata Automotive`, `perlindungan data pribadi UU PDP`

---

## ✅ Ringkasan implementasi

| Lokasi | Perubahan |
|---|---|
| `lib/seo-keywords.ts` | **Sumber tunggal** — `brandCore` (universal), `pageKeywords` (per halaman), helper `keywordsFor()` & `withBrand()` |
| `app/layout.tsx` | `metadata.keywords = brandCore` |
| Tiap `page.tsx` publik statis | `keywords: keywordsFor("<page>")` (tanpa array panjang inline) |
| `produk/[slug]`, `blog/[slug]`, `news/[slug]` | `keywords: withBrand([...])` — keyword entitas + brandCore |

> Catatan: di Next.js `metadata.keywords` per-halaman **menimpa** (bukan menggabung)
> keywords layout — karena itu tiap halaman memakai `keywordsFor()`/`withBrand()` agar
> `brandCore` selalu ikut.

> Keyword ditanam **melengkapi**, bukan menggantikan, optimasi title/description/heading.
> Untuk ranking nyata: pastikan H1/H2 tiap halaman memuat primary keyword-nya (mayoritas
> sudah, mis. Hero "Sparepart Original Terbaik" — pertimbangkan tambah "mobil listrik/China").
