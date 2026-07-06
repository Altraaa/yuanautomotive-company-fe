# 🛠️ BACKEND GUIDE — Yuan Dewata Automotive (NestJS API)

Panduan lengkap fitur backend yang harus dibangun untuk menunjang frontend Next.js ini **plus admin panel** (dashboard + chart). Dokumen ini diturunkan **langsung dari kontrak yang sudah ada di frontend** — `lib/endpoint.ts`, `services/api.ts`, zod schema, dan tipe UI di `types/ui/`. Artinya: kalau backend mengikuti dokumen ini, frontend tinggal ganti mock service jadi `apiClient` tanpa mengubah komponen.

> Cara pakai: potong per-bagian dan jadikan prompt terpisah saat membangun NestJS (mis. "buat module Products sesuai spec berikut …"). Semua bentuk JSON, DTO, dan query param di sini sudah final — jangan diubah namanya, karena frontend sudah mengharapkan bentuk itu.

---

## 0. RINGKASAN — APA YANG HARUS ADA

| # | Module | Publik (SEO/RSC) | Admin (JWT) | Menunjang halaman FE |
|---|--------|:---:|:---:|---|
| 1 | **Auth** | — | ✅ login/me/refresh/logout | Login admin |
| 2 | **Products** | list + detail by slug | CRUD + bulk delete | `/produk`, `/produk/[slug]`, home featured |
| 3 | **Categories** | list | CRUD | Filter produk, form produk |
| 4 | **Blogs** | list + detail by slug | CRUD + bulk delete (Tiptap HTML) | `/blog`, `/blog/[slug]`, home |
| 5 | **Contacts (Leads)** | create | list/detail/update-status/delete/bulk | Form `/kontak` |
| 6 | **Orders (Pre-Order)** | create | list/detail/update-status/delete/bulk | Cart / pre-order |
| 7 | **Media** | — | upload/delete (two-step) | Upload gambar produk & blog |
| 8 | **CMS** | get by section | update by section | Konten dinamis home & tentang |
| 9 | **Dashboard / Analytics** | — | stats + time-series + top-N | Admin dashboard & chart |
| 10 | **Revalidate trigger** | (BE→FE call) | dipanggil setelah tiap write | ISR on-demand |

> **Status FE (per Jul 2026):** admin panel sudah diimplementasi di route group `app/(admin)` — halaman **Login** (`/login`), **Dashboard** (`/dashboard`), **Kelola Produk** (`/dashboard/produk`), **Detail Produk** (`/dashboard/produk/[uuid]`), dan **Edit/Tambah Produk** (`/dashboard/produk/[uuid]/edit`, `/dashboard/produk/baru`). Semua masih memakai **mock** (`features/admin/data.ts`) dengan shape final di `types/ui/admin.ts` + `features/admin/product-schema.ts`. Backend tinggal menyediakan endpoint di dokumen ini agar mock diganti `apiClient` tanpa ubah komponen. Bagian yang **bertambah** karena admin panel ini: field produk `sku` / `price_wholesale` / `stock`, response **detail admin yang kaya** (§5.2), `slug` yang editable, dan agregasi dashboard (§6).

---

## 1. TECH STACK BACKEND (rekomendasi terkunci)

| Layer | Pilihan |
|---|---|
| Framework | **NestJS** (v10+) |
| Bahasa | **TypeScript** (strict) |
| ORM | **Prisma** (rekomendasi) atau TypeORM |
| Database | **PostgreSQL** |
| Auth | **JWT** (access + refresh) via `@nestjs/jwt` + Passport |
| Validasi | **class-validator + class-transformer** (global `ValidationPipe`) |
| Upload | **Multer** → simpan ke disk/S3, simpan metadata di tabel `media` |
| Docs | **Swagger** (`@nestjs/swagger`) di `/docs` |
| Password | **argon2** atau **bcrypt** |
| Slug | **slugify** (auto dari nama/judul, dijamin unik) |

---

## 2. KONVENSI GLOBAL (WAJIB — FE mengandalkan ini)

### 2.1 Base URL & prefix
- Semua route TANPA prefix `/api` dan TANPA segmen `/admin`. Pemisahan role lewat **JWT + Guard**, bukan URL. (Lihat `lib/endpoint.ts`.)
- Frontend memanggil `process.env.NEXT_PUBLIC_API_URL` + path. Contoh path final: `GET /products`, `GET /products/slug/charger-portable-7kw-type-2`.

### 2.2 Penamaan field = `snake_case`
Frontend memisahkan **tipe API (snake_case)** dari **tipe UI (camelCase)** dan menjembataninya dengan **mapper**. Jadi respons JSON API HARUS `snake_case`:
- `vehicle_model`, `customer_name`, `image_url`, `published_at`, `reading_minutes`, `content_html`.

### 2.3 `price` dikirim sebagai STRING
Sesuai aturan FE (`types/api/`), harga tetap **string** di JSON (mis. `"8450000"`), tanggal sebagai **ISO string**. Mapper FE yang mengubah `price` → number.

### 2.4 Bentuk error = bentuk NestJS default
`services/api.ts` mem-parse error seperti ini:
```json
{ "statusCode": 400, "message": "string atau array string", "error": "Bad Request" }
```
`message` boleh `string` atau `string[]` (hasil ValidationPipe). Jangan bungkus ulang error dengan format lain.

### 2.5 204 No Content
Endpoint delete/logout boleh balas `204` tanpa body — FE menangani ini (return `undefined`).

### 2.6 Public detail pakai SLUG, admin pakai UUID
- Publik: `GET /products/slug/:slug`, `GET /blogs/slug/:slug` (untuk SEO).
- Admin: `GET /products/:uuid`, dst. Semua entity punya `id` (uuid) DAN `slug` unik.

### 2.7 Pagination (bentuk respons list)
List admin & produk publik memakai query `page`, `limit`, dan balas amplop:
```json
{
  "items": [ /* ... */ ],
  "meta": { "total": 42, "page": 1, "limit": 12, "total_pages": 4 }
}
```
> Catatan: FE mock saat ini memakai `{ items, total, totalPages, page }`. Saat wiring, mapper FE meratakan `meta`. Gunakan bentuk `meta` di atas (lebih rapi) — cukup pastikan berisi `total`, `page`, `limit`, `total_pages`.

### 2.8 CORS
Izinkan origin frontend (`https://automotive.yuandewatatimur.com` + `http://localhost:3000`) untuk method GET/POST/PATCH/PUT/DELETE + header `Authorization`, `Content-Type`.

---

## 3. ENVIRONMENT VARIABLES (backend)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/yuandewata
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Media
MEDIA_STORAGE=local            # local | s3
MEDIA_UPLOAD_DIR=./uploads
MEDIA_PUBLIC_BASE=https://automotive.yuandewatatimur.com/media

# On-demand ISR ke frontend (WAJIB sama dengan REVALIDATE_SECRET di FE)
FRONTEND_REVALIDATE_URL=https://automotive.yuandewatatimur.com/api/revalidate
REVALIDATE_SECRET=<samakan-dengan-FE>

CORS_ORIGINS=https://automotive.yuandewatatimur.com,http://localhost:3000
```

---

## 4. DATA MODEL (skema Prisma — ringkas)

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(ADMIN)   // ADMIN | SUPERADMIN
  createdAt    DateTime @default(now())
}

model Category {
  id        String    @id @default(uuid())
  name      String    @unique             // "Sparepart" | "Body Part" | "Aksesoris"
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
}

model Product {
  id             String        @id @default(uuid())
  slug           String        @unique          // editable di form admin (auto dari name bila kosong)
  sku            String        @unique          // "YD-CHG-7K2" — tampil di admin, bukan di publik
  name           String
  price          Decimal                        // harga retail — dikirim ke FE sebagai string
  priceWholesale Decimal?                       // harga grosir — string; admin only
  stock          Int           @default(0)      // jumlah unit; admin only
  viewCount      Int           @default(0)      // untuk stat "Dilihat" di detail admin
  badge          Badge?                         // BARU | HOT | TERLARIS | PRE_ORDER
  description    String
  compatibility  String[]                       // ["Wuling","Hyundai",...]
  categoryId     String
  category       Category      @relation(fields: [categoryId], references: [id])
  specs          ProductSpec[]
  images         Media[]       @relation("ProductImages")
  isFeatured     Boolean       @default(false)
  isPublished    Boolean       @default(true)   // Status Published/Draft di form admin
  authorId       String?                        // user pembuat/pengubah terakhir → detail "Oleh"
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model ProductSpec {
  id        String  @id @default(uuid())
  label     String                            // "Daya Output"
  value     String                            // "7 kW (32A)"
  sortOrder Int     @default(0)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Blog {
  id             String   @id @default(uuid())
  slug           String   @unique
  title          String
  category       BlogCategory                   // TIPS | RILIS | PANDUAN | BERITA
  excerpt        String
  contentHtml    String                          // hasil Tiptap
  coverMediaId   String?
  cover          Media?   @relation("BlogCover", fields: [coverMediaId], references: [id])
  author         String
  readingMinutes Int
  isPublished    Boolean  @default(true)
  publishedAt    DateTime
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Contact {                                  // LEAD dari form /kontak
  id           String        @id @default(uuid())
  name         String
  phone        String
  email        String
  vehicleModel String?
  message      String
  status       ContactStatus @default(NEW)       // NEW | CONTACTED | CLOSED
  createdAt    DateTime      @default(now())
}

model Order {                                    // PRE-ORDER
  id           String       @id @default(uuid())
  customerName String
  phone        String
  email        String?
  vehicleModel String?
  note         String?
  status       OrderStatus  @default(NEW)         // NEW | PROCESSED | DONE | CANCELLED
  items        OrderItem[]
  createdAt    DateTime     @default(now())
}

model OrderItem {
  id            String  @id @default(uuid())
  orderId       String
  order         Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId     String?                           // null jika produk terhapus
  productSlug   String                            // snapshot
  productName   String                            // snapshot
  priceSnapshot Decimal
  quantity      Int
}

model Media {
  id         String   @id @default(uuid())
  url        String                               // /media/xxxx.webp (path publik)
  filename   String
  mimeType   String
  sizeBytes  Int
  width      Int?
  height     Int?
  productId  String?                              // relasi ProductImages
  createdAt  DateTime @default(now())
}

model CmsSection {
  id        String   @id @default(uuid())
  key       String   @unique                      // "home-hero", "home-why-us", "about", ...
  data      Json                                   // blob konten fleksibel
  updatedAt DateTime @updatedAt
}

enum Role { ADMIN SUPERADMIN }
enum Badge { BARU HOT TERLARIS PRE_ORDER }
enum BlogCategory { TIPS RILIS PANDUAN BERITA }
enum ContactStatus { NEW CONTACTED CLOSED }
enum OrderStatus { NEW PROCESSED DONE CANCELLED }
```

---

## 5. MODULE & ENDPOINT (bentuk request/response FINAL)

### 5.1 AUTH — `/auth`
| Method | Path | Guard | Body | Response |
|---|---|---|---|---|
| POST | `/auth/login` | — | `{ email, password }` | `{ access_token, refresh_token, user }` |
| GET | `/auth/me` | JWT | — | `user` |
| POST | `/auth/refresh` | refresh JWT | `{ refresh_token }` | `{ access_token }` |
| POST | `/auth/logout` | JWT | — | `204` |

`user` = `{ id, email, name, role }`. Login gagal → `401` dengan message string.

> FE: form login (`features/auth/schema.ts`, halaman `/login`) mengirim `{ email, password }`. Checkbox **"Ingat perangkat ini"** bersifat *client-only* — hanya menentukan apakah `refresh_token` disimpan persist (localStorage) atau sesi (memory/sessionStorage); tidak dikirim ke `/auth/login`. Sukses → FE simpan `access_token` + `refresh_token` lalu redirect ke `/dashboard`.

### 5.2 PRODUCTS — `/products`

**Publik — list** `GET /products`
Query: `page`, `limit`, `category` (nama/slug), `price_min`, `price_max`, `sort` (`terbaru|termurah|termahal`).
Response `items[]` (product card):
```json
{
  "items": [{
    "slug": "charger-portable-7kw-type-2",
    "name": "Charger Portable 7kW Type 2",
    "category": "Sparepart",
    "price": "8450000",
    "image_url": "/media/xxx.webp",
    "badge": "BARU"
  }],
  "meta": { "total": 8, "page": 1, "limit": 6, "total_pages": 2 }
}
```

**Publik — detail** `GET /products/slug/:slug` → `404` bila tidak ada:
```json
{
  "slug": "charger-portable-7kw-type-2",
  "name": "Charger Portable 7kW Type 2",
  "category": "Sparepart",
  "price": "8450000",
  "image_url": "/media/xxx.webp",
  "badge": "BARU",
  "description": "…",
  "specs": [{ "label": "Daya Output", "value": "7 kW (32A)" }],
  "compatibility": ["Wuling", "Hyundai", "BYD"],
  "gallery": ["/media/a.webp", "/media/b.webp"]
}
```
> `badge` opsional. Nilai enum FE: `BARU | HOT | TERLARIS | PRE-ORDER` (perhatikan `PRE-ORDER` pakai tanda hubung di JSON — konversi dari enum DB `PRE_ORDER`).

**Admin** (JWT):
| POST | `/products` | create |
| GET | `/products/:uuid` | detail admin (kaya — lihat di bawah) |
| PATCH | `/products/:uuid` | update |
| DELETE | `/products/:uuid` | delete → `204` |
| POST | `/products/bulk/delete` | `{ ids: string[] }` |

**Admin — list** `GET /products` (JWT) memakai amplop `meta` yang sama, item = baris tabel *Kelola Produk* (`types/ui/admin.ts → AdminProductRow`): `{ id, name, sku, category, price, badge, status }` — `status` = `"Published" | "Draft"` (turunan `is_published`).

**Admin — detail** `GET /products/:uuid` — feeds halaman **Detail Produk** & **Edit Produk**; bentuk mengikuti `types/ui/admin.ts → AdminProductDetail`:
```json
{
  "id": "uuid",
  "slug": "charger-portable-7kw",
  "sku": "YD-CHG-7K2",
  "name": "Charger Portable 7kW Type 2",
  "category": "Sparepart",
  "category_id": "uuid",
  "price": "8450000",
  "price_wholesale": "7900000",
  "stock": 24,
  "badge": "BARU",
  "is_published": true,
  "is_featured": true,
  "description": "…",
  "specs": [{ "label": "Daya output", "value": "7 kW (32 A, 1 fasa)" }],
  "compatibility": ["BYD Atto 3", "Wuling Air EV", "Hyundai Ioniq 5"],
  "gallery": ["/media/a.webp", "/media/b.webp"],
  "view_count": 1240,
  "lead_count": 18,
  "preorder_count": 24,
  "author": "Admin Utama",
  "created_at": "2026-06-12T09:24:00Z",
  "updated_at": "2026-07-05T14:02:00Z"
}
```
- `view_count` = kolom; **`lead_count` & `preorder_count` = agregasi** (jumlah lead/pre-order yang menyebut produk ini). Boleh `0` bila relasi belum ada.
- `author` = nama user pembuat/pengubah terakhir (`authorId` → `User.name`). `created_at`/`updated_at` = **ISO**; FE yang memformat ("12 Jun 2026 · 09.24").

Body create/update (mirror `features/admin/product-schema.ts → productFormSchema`; `image_uuids` = hasil upload media dua langkah):
```json
{
  "name": "Charger Portable 7kW Type 2",
  "sku": "YD-CHG-7K2",
  "slug": "charger-portable-7kw",
  "category_id": "uuid",
  "price": "8450000",
  "price_wholesale": "7900000",
  "stock": 24,
  "badge": "BARU",
  "description": "…",
  "compatibility": ["BYD Atto 3", "Wuling Air EV"],
  "specs": [{ "label": "Daya output", "value": "7 kW", "sort_order": 0 }],
  "image_uuids": ["media-uuid-1", "media-uuid-2"],
  "is_featured": true,
  "is_published": true
}
```
- **`slug`** kini **editable** dari form (field "Slug URL"). Bila dikirim kosong → generate dari `name`; jaga tetap unik. **`sku`** wajib & unik.
- FE mengirim `price`/`price_wholesale` sebagai string angka ber-titik (mis. `"8.450.000"`) → **strip titik** jadi angka murni sebelum simpan (atau terima kedua bentuk). `stock` = integer.
- Toggle **Status Published/Draft** → `is_published` (true/false). Toggle **Unggulan** → `is_featured`. **Badge** boleh kosong → `null`. `specs` bisa 0..n baris (form pakai field-array add/remove).
- Gambar pertama = `image_url` (thumbnail), sisanya `gallery`. Setelah create/update/delete → revalidate `tag=products` (lihat §7).

### 5.3 CATEGORIES — `/categories`
| GET | `/categories` | publik | `[{ id, name, slug }]` |
| POST/PATCH/DELETE | `/categories[/:uuid]` | admin | CRUD |
Home & filter produk memakai list ini.

### 5.4 BLOGS — `/blogs`

**Publik list** `GET /blogs` — query `page`, `limit`, `category`. Item = blog card:
```json
{
  "slug": "5-cara-merawat-baterai-ev-iklim-tropis",
  "title": "5 Cara Merawat Baterai EV di Iklim Tropis",
  "category": "Tips",
  "excerpt": "…",
  "image_url": "/media/x.webp",
  "published_at": "2026-06-28",
  "reading_minutes": 5
}
```
**Publik detail** `GET /blogs/slug/:slug` → card + `{ "content_html": "<p>…</p>", "author": "Tim Yuan Dewata" }`. `404` bila tidak ada.

**Admin** (JWT): `POST /blogs`, `GET /blogs/:uuid`, `PATCH /blogs/:uuid`, `DELETE /blogs/:uuid`, `POST /blogs/bulk/delete`.
Body create/update: `{ title, category, excerpt, content_html, cover_uuid, author, reading_minutes, is_published, published_at }`. Slug auto. Setelah write → revalidate `tag=blogs`.
> `category` JSON = `Tips | Rilis | Panduan | Berita`.

### 5.5 CONTACTS (Leads) — `/contacts`

**Publik create** `POST /contacts` (dipakai form `/kontak`):
```json
{ "name": "…", "phone": "08xx", "email": "a@b.com", "vehicle_model": "Wuling Air EV", "message": "…" }
```
Validasi = mirror zod FE (`features/contact/schema.ts`): `name` ≥2, `phone` ≥8 & hanya `0-9 + - spasi`, `email` valid, `vehicle_model` opsional, `message` ≥10. Response `201 { id, created_at }`.

**Admin** (JWT): `GET /contacts` (query `page`, `limit`, `status`), `GET /contacts/:uuid`, `PATCH /contacts/:uuid` (`{ status }`), `DELETE /contacts/:uuid`, `POST /contacts/bulk/delete`.

### 5.6 ORDERS (Pre-Order) — `/orders`

**Publik create** `POST /orders` (dari cart; item berasal dari keranjang, bukan field form — lihat `features/preorder/services/submit-order.ts`):
```json
{
  "customer_name": "…",
  "phone": "08xx",
  "email": "a@b.com",
  "vehicle_model": "Hyundai Ioniq 5",
  "note": "…",
  "items": [
    { "product_slug": "charger-portable-7kw-type-2", "quantity": 2 }
  ]
}
```
Backend: resolve tiap `product_slug` → simpan snapshot `product_name` + `price_snapshot` di `OrderItem`. Response `201 { id, created_at }`. Tolak bila `items` kosong.

**Admin** (JWT): `GET /orders` (query `page`, `limit`, `status`), `GET /orders/:uuid` (beserta items), `PATCH /orders/:uuid` (`{ status }`), `DELETE`, `POST /orders/bulk/delete`.

### 5.7 MEDIA — `/media` (WAJIB alur DUA LANGKAH)
| POST | `/media/upload` | JWT | `multipart/form-data` field `file` | `{ id, url, filename, mime_type, size_bytes, width, height }` |
| DELETE | `/media/:uuid` | JWT | — | `204` |

Alur: FE `apiClient.upload()` → dapat `uuid` → kirim `uuid` itu sebagai `image_uuids`/`cover_uuid` di payload create/update. Jangan pernah terima base64 inline. `uuid` yang tak ada di tabel media → `404`.

### 5.8 CMS — `/cms`
| GET | `/cms/:key` | publik | `{ key, data }` |
| PUT/PATCH | `/cms/:key` | admin | `{ data }` → revalidate `tag=cms-<key>` |

`data` = JSON bebas per section. Section yang dipakai FE (lihat `features/home/data.ts`, `app/(public)/tentang/page.tsx`):
- `home-hero` — judul, subjudul, CTA, gambar hero
- `home-why-us` — array `{ value, label, accent, valueTone }`
- `home-testimonial` — `{ quote, author_name, author_location, author_initials }`
- `home-partners` — `string[]`
- `about` — visi, misi[], steps[], stats[]
- `contact-info` — email, whatsapp, lokasi (opsional; saat ini di `lib/site.ts`)

> CMS bersifat opsional di fase awal — konten ini masih hardcoded di FE. Prioritaskan Products/Blogs/Leads/Orders dulu, CMS menyusul.

---

## 6. ADMIN PANEL — DASHBOARD & CHART

FE admin **sudah dibangun** (route group `app/(admin)`, halaman `/dashboard`). Saat ini datanya dari mock `features/admin/data.ts`; komponen chart digambar **SVG token-driven** (`LineChart`, `DonutChart`, `BarList`, `StatTile`, `ActivityCard`) — bukan Recharts — sehingga cukup diganti `apiClient` tanpa dependensi tambahan (Recharts tetap opsional untuk chart lanjutan). Backend menyediakan endpoint agregasi berikut. Semua **JWT-protected**.

### 6.1 Kartu ringkasan (stat cards) — `GET /dashboard/summary`
```json
{
  "products": { "total": 42, "published": 38 },
  "blogs": { "total": 12, "published": 10 },
  "leads": { "total": 130, "new": 8 },
  "orders": { "total": 76, "new": 5, "revenue_estimate": "154000000" },
  "deltas": { "leads_pct_vs_prev_period": 12.5, "orders_pct_vs_prev_period": -3.2 }
}
```
Feeds: 4 kartu angka + indikator naik/turun.

### 6.2 Time-series (Line/Area chart) — `GET /dashboard/timeseries`
Query: `metric=leads|orders|revenue`, `range=7d|30d|90d`, `granularity=day|week`.
```json
{
  "metric": "leads",
  "range": "30d",
  "points": [
    { "date": "2026-06-01", "value": 4 },
    { "date": "2026-06-02", "value": 7 }
  ]
}
```
Feeds: grafik tren leads & orders per hari (Recharts `LineChart`/`AreaChart`).

### 6.3 Breakdown kategori (Pie/Bar) — `GET /dashboard/products-by-category`
```json
{ "items": [ { "category": "Sparepart", "count": 18 }, { "category": "Body Part", "count": 9 } ] }
```

### 6.4 Top produk (Bar chart / tabel) — `GET /dashboard/top-products`
Query: `range`, `limit` (default 5). Diurutkan dari jumlah pre-order terbanyak:
```json
{ "items": [ { "slug": "…", "name": "…", "order_count": 24, "qty_total": 51 } ] }
```

### 6.5 Status distribusi (Donut) — `GET /dashboard/status-breakdown`
Query: `entity=orders|contacts`.
```json
{ "entity": "orders", "items": [ { "status": "NEW", "count": 5 }, { "status": "DONE", "count": 40 } ] }
```

### 6.6 Aktivitas terbaru (feed/tabel) — `GET /dashboard/recent`
```json
{
  "leads": [ { "id": "…", "name": "…", "created_at": "…", "status": "NEW" } ],
  "orders": [ { "id": "…", "customer_name": "…", "items_count": 3, "created_at": "…", "status": "NEW" } ]
}
```

> Ringkasan komponen admin yang butuh data ini: **4 stat card** (§6.1), **2 line chart** leads+orders (§6.2), **1 pie** kategori (§6.3), **1 bar** top produk (§6.4), **1 donut** status (§6.5), **2 tabel** aktivitas terbaru (§6.6), plus **tabel CRUD** untuk Products/Blogs/Leads/Orders (pakai endpoint admin di §5).

---

## 7. ON-DEMAND ISR (BACKEND → FRONTEND)

FE sudah punya webhook di `app/api/revalidate/route.ts`. Setelah **setiap admin write**, backend WAJIB memanggil:

```
POST {FRONTEND_REVALIDATE_URL}?tag=<tag>&secret=<REVALIDATE_SECRET>
```

Peta tag → aksi:
| Setelah menulis | tag |
|---|---|
| Product create/update/delete | `products` |
| Blog create/update/delete | `blogs` |
| CMS section update | `cms-<key>` (mis. `cms-home-hero`) |
| Category change | `products` (produk ikut berubah tampil) |

`REVALIDATE_SECRET` di backend **harus identik** dengan yang di FE, kalau tidak FE balas `401`. Implementasikan sebagai side-effect (mis. di service, setelah commit DB) dan jangan gagalkan request admin bila revalidate error — cukup log.

---

## 8. VALIDASI, SECURITY, & ROLE

- **Global `ValidationPipe`** `{ whitelist: true, transform: true, forbidNonWhitelisted: true }` → menghasilkan `message: string[]` yang cocok dengan `ApiError` FE.
- **DTO class-validator** meniru zod FE (lihat §5.5 & schema `features/*/schema.ts`).
- **Guard**: `JwtAuthGuard` untuk semua route admin; `@Public()` decorator untuk endpoint publik (list/detail/create contact/create order).
- **Rate limit** (`@nestjs/throttler`) pada endpoint publik POST (`/contacts`, `/orders`) untuk cegah spam lead.
- **Role**: `SUPERADMIN` bisa kelola user; `ADMIN` kelola konten. Bulk delete sebaiknya `SUPERADMIN`.
- **Sanitasi `content_html`** blog (Tiptap) sebelum simpan (cegah XSS) — mis. `sanitize-html`.
- **Swagger** di `/docs` untuk memudahkan FE wiring.

---

## 9. URUTAN BUILD (checklist prompting NestJS)

1. **Bootstrap**: NestJS + Prisma + Postgres + `ValidationPipe` global + CORS + Swagger.
2. **Auth**: User model, seed 1 admin, login/me/refresh/logout (JWT + refresh + Guard).
3. **Media**: upload (Multer) + serve statis + delete. (Diperlukan sebelum Products/Blogs.)
4. **Categories**: CRUD + seed 3 kategori (`Sparepart`, `Body Part`, `Aksesoris`).
5. **Products**: model + specs + relasi media (termasuk field admin `sku`/`price_wholesale`/`stock`/`view_count`/`authorId`); publik list (filter/sort/paginate) + detail by slug; admin list (baris tabel) + **detail admin kaya** (§5.2) + CRUD + bulk; `slug` auto **atau** dari input; revalidate hook.
6. **Blogs**: mirip Products (Tiptap `content_html`, cover media, `reading_minutes`).
7. **Contacts** & **Orders**: create publik (validasi mirror zod) + admin list/detail/update-status/delete/bulk; snapshot item order.
8. **Dashboard/Analytics**: endpoint agregasi §6.
9. **CMS**: get/update by section + revalidate (fase akhir).
10. **Seed data** dari mock FE (`features/products/data.ts`, `features/blog/data.ts`) agar tampilan konsisten saat wiring.

---

## 10. CHEAT SHEET — PETA FE → BE

| Frontend (sudah ada) | Backend (dibangun) |
|---|---|
| `lib/endpoint.ts` | daftar route final di atas |
| `services/api.ts` (`ApiError`, 204, ISR tags) | bentuk error NestJS + `204` + revalidate |
| `features/contact/schema.ts` | DTO `POST /contacts` |
| `features/preorder/schema.ts` + cart | DTO `POST /orders` (items dari cart) |
| `types/ui/product.ts` (+ mapper) | JSON `snake_case`, `price` string, `image_url`, `gallery` |
| `types/ui/blog.ts` | JSON blog `content_html`, `published_at`, `reading_minutes` |
| `features/products/data.ts` `queryProducts()` | filter `category/price_min/price_max/sort` + pagination `meta` |
| `app/api/revalidate/route.ts` | target webhook `?tag=&secret=` |
| `lib/query-keys.ts` | param admin list: `page/limit/status/categoryId` |
| `features/auth/schema.ts` (login form) | DTO `POST /auth/login` (`{ email, password }`) |
| `types/ui/admin.ts` `AdminProductRow` | item admin list `GET /products` (JWT) |
| `types/ui/admin.ts` `AdminProductDetail` | response `GET /products/:uuid` (detail admin kaya) |
| `features/admin/product-schema.ts` `productFormSchema` | DTO create/update produk (sku, price_wholesale, stock, slug editable, status) |
| `features/admin/data.ts` (mock dashboard) | shape endpoint agregasi §6 |

---

**Prinsip penutup:** jangan ubah nama field atau bentuk JSON di dokumen ini. Frontend sudah mengharapkan bentuk `snake_case` + `price` string + detail-by-slug + amplop `meta`. Ikuti kontrak → wiring FE = ganti mock jadi `apiClient.get(endpoints.…)` tanpa sentuh komponen.
