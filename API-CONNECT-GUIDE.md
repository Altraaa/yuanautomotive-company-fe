# 🔌 API CONNECT GUIDE — Frontend → NestJS Backend

Panduan **menyambungkan frontend Next.js ke backend NestJS yang sudah jadi**, menggantikan semua mock (`features/*/data.ts` + `features/*/services/*`) dengan `apiClient` **tanpa mengubah komponen**.

- **Base URL produksi:** `https://apiautomotive.yuandewatatimur.com`
- **Base URL lokal:** `http://localhost:3001` (BE `APP_PORT=3001`)
- Kontrak JSON final ada di `BACKEND-GUIDE.md`. Dokumen ini = *cara memasangnya*.

> Prinsip yang dijaga (CLAUDE.md): `backend → apiClient → service (+mapper) → view/hook → component`. Komponen tidak pernah `fetch()` atau memanggil `apiClient` langsung. API pakai **snake_case**, `price` **string**, tanggal **ISO**; mapper yang mengubah ke UI type (camelCase, `price:number`).

---

## 0. URUTAN KERJA (checklist)

1. [ ] **Env** — set `NEXT_PUBLIC_API_URL` (§1)
2. [ ] **next.config** — whitelist host gambar media (§2)
3. [ ] **api.ts** — implement `getAuthHeader` + join base URL + hapus `"use server"` (§3)
4. [ ] **Token store + Auth** — login/me/refresh/logout (§4)
5. [ ] **types/api + helper meta** — buat folder tipe API + `unwrap` pagination (§5)
6. [ ] **Products publik** — ganti `features/products/data.ts` → `services/products.ts` (§6)
7. [ ] **Products admin** — list/detail/CRUD + mapper form (§7)
8. [ ] **Categories** (§8)
9. [ ] **Blogs** publik + admin (§9)
10. [ ] **Contacts** submit + admin (§10)
11. [ ] **Orders** submit + admin (§11)
12. [ ] **Media** two-step upload (§12)
13. [ ] **Dashboard** §6 endpoints (§13)
14. [ ] **CMS** (§14)
15. [ ] **Revalidate secret** samakan dengan BE (§15)

Kerjakan **§1–§5 dulu** (fondasi), sisanya bisa per-domain paralel.

---

## 1. ENVIRONMENT

`NEXT_PUBLIC_API_URL` = base URL backend. **Tanpa `/api`, tanpa trailing slash** (endpoint di `lib/endpoint.ts` sudah bare-path seperti `/products`).

> ⚠️ `.env.local.example` & `.env.production.example` saat ini masih menuliskan suffix `/api` — itu **salah** untuk kontrak ini. Hapus `/api`.

**`.env.local`** (dev — FE di :3000, BE di :3001):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
REVALIDATE_SECRET=shared-secret-with-frontend
```

**`.env.production`** (VPS):
```env
NEXT_PUBLIC_API_URL=https://apiautomotive.yuandewatatimur.com
REVALIDATE_SECRET=shared-secret-with-frontend
```

`REVALIDATE_SECRET` **harus identik** dengan `REVALIDATE_SECRET` di BE (`.env` BE saat ini `shared-secret-with-frontend`). Kalau beda, webhook ISR balas 401 (§15).

> CORS BE sudah mengizinkan `http://localhost:3000` dan `https://automotive.yuandewatatimur.com`. Kalau domain FE berubah, tambahkan ke `CORS_ORIGINS` di `.env` BE.

---

## 2. NEXT.CONFIG — HOST GAMBAR MEDIA

BE mengembalikan `image_url` / `gallery` sebagai **URL absolut** dari `MEDIA_PUBLIC_BASE` (BE `.env`). Agar `next/image` mau memuatnya, host-nya harus di-whitelist.

**Rekomendasi:** sajikan media dari host API dan samakan konfigurasinya.

Di **BE `.env`** ubah:
```env
MEDIA_PUBLIC_BASE=https://apiautomotive.yuandewatatimur.com/media
```

Di **`next.config.ts`** → `images.remotePatterns` tambahkan host API (localhost :3001 untuk dev, apiautomotive untuk prod):
```ts
remotePatterns: [
  { protocol: "http",  hostname: "localhost", port: "3001", pathname: "/media/**" },
  { protocol: "https", hostname: "apiautomotive.yuandewatatimur.com", pathname: "/media/**" },
  // biarkan entri lama bila media juga disajikan dari domain utama
],
```

> Kalau nanti media dipindah ke object storage/CDN, cukup ubah `MEDIA_PUBLIC_BASE` di BE + tambah host CDN di sini. Path relatif tidak dipakai — selalu absolut.

---

## 3. `services/api.ts` — 3 PERBAIKAN WAJIB

File `apiClient` sudah menangani ISR cache, `ApiError`, dan `204`. Tiga hal harus dibereskan sebelum bisa dipakai:

### 3a. Hapus `"use server"` di baris 1
Directive itu memaksa **semua** export jadi Server Action. Admin panel (client + TanStack Query) perlu memanggil `apiClient` dari browser, dan token dibaca dari client store (§4). Hapus baris `"use server";`.

> RSC publik tetap bisa memanggil service yang mengimpor `apiClient` (jalan di server) — tanpa `"use server"` modul ini universal (server & client). Auth (`auth:true`) hanya dipakai di rute admin yang client-side, jadi token dari `localStorage`/`sessionStorage` aman.

### 3b. Implement `getAuthHeader()`
Ganti stub yang `return null`:
```ts
import { getAccessToken } from "@/lib/token-store";

async function getAuthHeader(): Promise<string | null> {
  return getAccessToken(); // null di server / saat belum login
}
```

### 3c. (Opsional tapi disarankan) Amankan join base URL
Agar tidak ada `//` ganda kalau env sempat diberi trailing slash:
```ts
const BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const fullUrl = BASE + url + (opts?.query ? buildQueryString(opts.query) : "");
```
Terapkan pola `BASE` yang sama di `post/patch/put/delete/upload`.

---

## 4. AUTH — TOKEN STORE + LOGIN/ME/REFRESH/LOGOUT

### 4a. Token store — `lib/token-store.ts` (baru)
Menyimpan `access_token` (+ `refresh_token`). Checkbox **"Ingat perangkat ini"** menentukan `localStorage` (persist) vs `sessionStorage` (sesi) — *client-only*, tidak dikirim ke `/auth/login`.

```ts
// lib/token-store.ts
const ACCESS = "yd_access_token";
const REFRESH = "yd_refresh_token";

let memoryAccess: string | null = null; // cepat & aman untuk render pertama

function store(remember: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  return remember ? window.localStorage : window.sessionStorage;
}

export function setTokens(access: string, refresh: string, remember: boolean) {
  memoryAccess = access;
  const s = store(remember);
  s?.setItem(ACCESS, access);
  s?.setItem(REFRESH, refresh);
}

export function getAccessToken(): string | null {
  if (memoryAccess) return memoryAccess;
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(ACCESS) ??
    window.sessionStorage.getItem(ACCESS)
  );
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(REFRESH) ??
    window.sessionStorage.getItem(REFRESH)
  );
}

export function clearTokens() {
  memoryAccess = null;
  if (typeof window === "undefined") return;
  [window.localStorage, window.sessionStorage].forEach((s) => {
    s.removeItem(ACCESS);
    s.removeItem(REFRESH);
  });
}
```

### 4b. Service — `services/auth.ts` (baru)
```ts
import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { setTokens, clearTokens, getRefreshToken } from "@/lib/token-store";

export type AuthUser = { id: string; email: string; name: string; role: string };
type LoginResponse = { access_token: string; refresh_token: string; user: AuthUser };

export async function login(
  email: string,
  password: string,
  remember: boolean
): Promise<AuthUser> {
  const res = await apiClient.post<LoginResponse>(endpoints.auth.login, { email, password });
  setTokens(res.access_token, res.refresh_token, remember);
  return res.user;
}

export function getMe(): Promise<AuthUser> {
  return apiClient.get<AuthUser>(endpoints.auth.me, { auth: true });
}

export async function refresh(): Promise<string> {
  const refresh_token = getRefreshToken();
  const res = await apiClient.post<{ access_token: string }>(
    endpoints.auth.refresh,
    { refresh_token }
  );
  return res.access_token;
}

export async function logout(): Promise<void> {
  await apiClient.post<void>(endpoints.auth.logout, undefined, { auth: true });
  clearTokens();
}
```

Di `features/auth/components/login-form.tsx`: pada submit sukses panggil `login(email, password, remember)` lalu `router.push("/dashboard")`. Tangkap `ApiError` → tampilkan `err.messages` (login gagal = 401).

> **401 handling:** bila `apiClient` melempar `ApiError` status 401 di rute admin, panggil `refresh()` sekali lalu ulangi request; kalau tetap gagal → `clearTokens()` + redirect `/login`. Boleh ditaruh di wrapper kecil atau di `onError` TanStack Query.

---

## 5. TIPE API + HELPER PAGINATION

### 5a. Buat folder `types/api/`
Tipe ini **mirror JSON backend persis** (snake_case, `price` string). Contoh `types/api/product.ts`:
```ts
export type ApiMeta = { total: number; page: number; limit: number; total_pages: number };
export type ApiPaginated<T> = { items: T[]; meta: ApiMeta };

export type ApiProductCard = {
  slug: string; name: string; category: string;
  price: string; image_url: string | null; badge: string | null;
};

export type ApiProductDetail = ApiProductCard & {
  description: string;
  specs: { label: string; value: string }[];
  compatibility: string[];
  gallery: string[];
};

export type ApiAdminProductRow = {
  id: string; name: string; sku: string; category: string;
  price: string; badge: string | null; status: "Published" | "Draft";
};

export type ApiAdminProductDetail = {
  id: string; slug: string; sku: string; name: string;
  category: string; category_id: string;
  price: string; price_wholesale: string | null; stock: number;
  badge: string | null; is_published: boolean; is_featured: boolean;
  description: string;
  specs: { label: string; value: string }[];
  compatibility: string[]; gallery: string[];
  view_count: number; lead_count: number; preorder_count: number;
  author: string; created_at: string; updated_at: string;
};
```

### 5b. Helper meta → bentuk mock lama
Mock FE saat ini memakai `{ items, total, totalPages, page }`. BE memakai amplop `{ items, meta:{ total, page, limit, total_pages } }`. Ratakan sekali di satu helper supaya komponen tabel & pagination tak berubah:
```ts
// lib/paginate.ts
import type { ApiPaginated } from "@/types/api/product";

export function flattenPage<A, U>(res: ApiPaginated<A>, map: (a: A) => U) {
  return {
    items: res.items.map(map),
    total: res.meta.total,
    totalPages: res.meta.total_pages,
    page: res.meta.page,
  };
}
```

### 5c. Konversi enum penting (dipakai di mapper)
- `badge`: API `"BARU" | "HOT" | "TERLARIS" | "PRE-ORDER"` (perhatikan `PRE-ORDER` pakai tanda hubung). `null`/`""` → `undefined` di UI.
- `status`: API `"Published" | "Draft"` ↔ `is_published` boolean.
- **`id` (API) = `uuid` (UI)**. Semua entity: publik pakai `slug`, admin pakai `uuid`.
- `price` string → `Number(price)` di UI.

---

## 6. PRODUCTS — PUBLIK (RSC)

Buat `services/products.ts`. Halaman `app/(public)/produk/*` cukup ganti import dari `features/products/data.ts` ke service ini (return shape sama: `ProductCardData` / `ProductDetailData`).

```ts
// services/products.ts
import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import type { ApiPaginated } from "@/types/api/product";
import type { ApiProductCard, ApiProductDetail } from "@/types/api/product";
import type { ProductBadge, ProductCardData, ProductDetailData } from "@/types/ui/product";

const badge = (b: string | null) => (b ? (b as ProductBadge) : undefined);

function toCard(p: ApiProductCard): ProductCardData {
  return {
    slug: p.slug, name: p.name,
    category: p.category as ProductCardData["category"],
    price: Number(p.price),
    imageUrl: p.image_url ?? "/placeholder-product-1.png",
    badge: badge(p.badge),
  };
}

function toDetail(p: ApiProductDetail): ProductDetailData {
  return { ...toCard(p), description: p.description, specs: p.specs,
    compatibility: p.compatibility, gallery: p.gallery };
}

export async function queryProducts(filters: {
  category?: string; priceMin?: number; priceMax?: number; sort?: string; page?: number;
}) {
  const res = await apiClient.get<ApiPaginated<ApiProductCard>>(endpoints.products.list, {
    revalidate: 3600,
    tags: ["products"],
    query: {
      page: filters.page ?? 1,
      limit: 6,
      category: filters.category,
      price_min: filters.priceMin,
      price_max: filters.priceMax,
      sort: filters.sort, // "terbaru" | "termurah" | "termahal"
    },
  });
  return flattenPage(res, toCard);
}

export async function getProductBySlug(slug: string): Promise<ProductDetailData | undefined> {
  try {
    const p = await apiClient.get<ApiProductDetail>(endpoints.products.detailBySlug(slug), {
      revalidate: 3600, tags: ["products"],
    });
    return toDetail(p);
  } catch {
    return undefined; // 404 → page panggil notFound()
  }
}
```

> **Featured / related / priceBounds / getAllProductSlugs** yang sekarang dihitung dari mock: sediakan versinya lewat query API (mis. featured pakai param khusus bila BE menambah `?featured=true`, atau ambil list lalu filter). Untuk `generateStaticParams` (sitemap/SSG) pakai `getAllProductSlugs()` yang memanggil list dan memetakan `slug`.

---

## 7. PRODUCTS — ADMIN (client + TanStack Query)

`GET /products` **dual-shape**: dengan token admin → baris tabel (`AdminProductRow`, termasuk Draft); anonim → card publik. Jadi service admin cukup memanggil `endpoints.products.adminList` dengan `auth: true`.

```ts
// services/admin/products.ts
import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import type { ApiPaginated, ApiAdminProductRow, ApiAdminProductDetail } from "@/types/api/product";
import type { AdminProductRow, AdminProductDetail } from "@/types/ui/admin";
import type { ProductBadge, ProductCategory } from "@/types/ui/product";
import type { ProductFormValues } from "@/features/admin/product-schema";

const badge = (b: string | null) => (b ? (b as ProductBadge) : undefined);

function toRow(r: ApiAdminProductRow): AdminProductRow {
  return { uuid: r.id, name: r.name, sku: r.sku,
    category: r.category as ProductCategory, price: Number(r.price),
    badge: badge(r.badge), status: r.status };
}

function toDetail(d: ApiAdminProductDetail): AdminProductDetail {
  return {
    uuid: d.id, slug: d.slug, name: d.name, sku: d.sku,
    category: d.category as ProductCategory, status: d.is_published ? "Published" : "Draft",
    badge: badge(d.badge),
    retailPrice: Number(d.price), wholesalePrice: Number(d.price_wholesale ?? 0),
    stock: d.stock, description: d.description, specs: d.specs,
    compatibility: d.compatibility, featured: d.is_featured,
    views: d.view_count, leads: d.lead_count, preorders: d.preorder_count,
    createdAt: d.created_at, updatedAt: d.updated_at, author: d.author,
  };
}

export async function listAdminProducts(params: { page?: number; limit?: number; category?: string }) {
  const res = await apiClient.get<ApiPaginated<ApiAdminProductRow>>(endpoints.products.adminList, {
    auth: true, query: { page: params.page ?? 1, limit: params.limit ?? 10, category: params.category },
  });
  return flattenPage(res, toRow);
}

export async function getAdminProduct(uuid: string): Promise<AdminProductDetail> {
  const d = await apiClient.get<ApiAdminProductDetail>(endpoints.products.adminDetail(uuid), { auth: true });
  return toDetail(d);
}

export function deleteProduct(uuid: string) {
  return apiClient.delete<void>(endpoints.products.adminDelete(uuid), { auth: true });
}
export function bulkDeleteProducts(ids: string[]) {
  return apiClient.post<{ deleted: number }>(endpoints.products.adminBulkDelete, { ids }, { auth: true });
}
```

### 7a. Form → payload (create/update)
`productFormSchema` memakai **nama kategori** (`"Sparepart"`), harga bergrup (`"8.450.000"`), `stock` string, `status`. BE menerima `category_id` (uuid), `price` (BE strip titik sendiri — tapi kirim bersih lebih aman), `stock` number, `is_published`. Kategori name → uuid butuh daftar kategori (dari `/categories`).

```ts
// services/admin/products.ts (lanjutan)
const digits = (s: string) => s.replace(/[^\d]/g, "");

export function toProductPayload(
  v: ProductFormValues,
  categories: { uuid: string; name: string }[],
  imageUuids: string[] // hasil upload dua langkah (§12)
) {
  const cat = categories.find((c) => c.name === v.category);
  return {
    name: v.name,
    sku: v.sku,
    slug: v.slug, // editable; kosong → BE generate dari name
    category_id: cat?.uuid,
    price: digits(v.retailPrice),
    price_wholesale: v.wholesalePrice ? digits(v.wholesalePrice) : undefined,
    stock: Number(digits(v.stock) || "0"),
    badge: v.badge ? v.badge.replace("-", "_") : undefined, // "PRE-ORDER" → "PRE_ORDER"
    description: v.description,
    compatibility: v.compatibility,
    specs: v.specs
      .filter((s) => s.label && s.value)
      .map((s, i) => ({ label: s.label, value: s.value, sort_order: i })),
    image_uuids: imageUuids.length ? imageUuids : undefined,
    is_featured: v.featured,
    is_published: v.status === "Published",
  };
}

export function createProduct(payload: ReturnType<typeof toProductPayload>) {
  return apiClient.post<ApiAdminProductDetail>(endpoints.products.adminCreate, payload, { auth: true });
}
export function updateProduct(uuid: string, payload: Partial<ReturnType<typeof toProductPayload>>) {
  return apiClient.patch<ApiAdminProductDetail>(endpoints.products.adminUpdate(uuid), payload, { auth: true });
}
```

> ⚠️ **Badge enum:** DTO BE memakai token DB `BARU|HOT|TERLARIS|PRE_ORDER` (underscore) untuk **input** create/update, sedangkan **output** JSON memakai `PRE-ORDER` (hubung). Karena itu di payload: `"PRE-ORDER" → "PRE_ORDER"`. (Kalau BE nanti menerima kedua bentuk, baris `.replace` boleh disederhanakan.)

### 7b. Hooks (TanStack Query)
```ts
// features/admin/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import * as svc from "@/services/admin/products";

export const useAdminProducts = (params: { page?: number; limit?: number }) =>
  useQuery({ queryKey: qk.products.adminList(params), queryFn: () => svc.listAdminProducts(params),
             placeholderData: (p) => p });

export const useAdminProduct = (uuid: string) =>
  useQuery({ queryKey: qk.products.adminDetail(uuid), queryFn: () => svc.getAdminProduct(uuid), enabled: !!uuid });

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.products.all }) });
}
```
Komponen `product-manager.tsx` / `product-edit-form.tsx` / `product-detail-view.tsx` tinggal ganti sumber datanya dari mock `features/admin/data.ts` ke hooks ini — shape UI (`AdminProductRow` / `AdminProductDetail`) sudah sama.

---

## 8. CATEGORIES

```ts
// services/categories.ts
import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
export type ApiCategory = { id: string; name: string; slug: string };

export function listCategories() {
  return apiClient.get<ApiCategory[]>(endpoints.categories.list, { revalidate: 3600, tags: ["products"] });
}
```
Dipakai untuk: filter produk, dropdown kategori di form (name→uuid di §7a), dan navigasi. Admin CRUD kategori pakai `endpoints.categories.create/update/delete` dengan `auth: true`.

---

## 9. BLOGS — PUBLIK + ADMIN

Sama polanya dengan Products. `types/ui/blog.ts` sudah ada; buat `types/api/blog.ts` (mirror) + `services/blogs.ts`.

Catatan konversi:
- `category` API Title-case: `"Tips" | "Rilis" | "Panduan" | "Berita"`.
- `published_at` = ISO string; UI yang format tanggal.
- Detail publik = card + `content_html` + `author`. Render `content_html` (sudah disanitasi BE) via Tiptap read-only / `dangerouslySetInnerHTML` dalam wrapper prose.
- Admin create/update body: `{ title, category, excerpt, content_html, cover_uuid, author, reading_minutes, is_published, published_at }`. `cover_uuid` dari upload dua langkah (§12).

```ts
export async function getBlogBySlug(slug: string) {
  try {
    return await apiClient.get(endpoints.blogs.detailBySlug(slug), { revalidate: 3600, tags: ["blogs"] });
  } catch { return undefined; }
}
```

---

## 10. CONTACTS (LEADS)

### 10a. Submit publik — ganti mock `features/contact/services/submit-contact.ts`
```ts
import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import type { ContactFormValues } from "@/features/contact/schema";

export async function submitContactLead(values: ContactFormValues): Promise<void> {
  await apiClient.post(endpoints.contacts.create, {
    name: values.name,
    phone: values.phone,
    email: values.email,
    vehicle_model: values.vehicleModel, // opsional
    message: values.message,
  });
}
```
Validasi zod FE sudah mirror DTO BE (name ≥2, phone ≥8, email valid, message ≥10). Error field dari BE (`ApiError.messages`) ditampilkan di form saat submit gagal.

### 10b. Admin
`endpoints.contacts.adminList` (query `page/limit/status`), `adminDetail`, `adminUpdate` (`{ status }` — `NEW|CONTACTED|CLOSED`), `adminDelete`, `adminBulkDelete` — semua `auth: true`. Petakan ke tabel leads admin.

---

## 11. ORDERS (PRE-ORDER)

### 11a. Submit publik — ganti mock `features/preorder/services/submit-order.ts`
Items berasal dari **cart**, bukan field form.
```ts
import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import type { PreorderFormValues } from "@/features/preorder/schema";
import type { CartItem } from "@/types/ui/cart";

export async function submitPreorder(values: PreorderFormValues, items: CartItem[]): Promise<void> {
  if (items.length === 0) throw new Error("Keranjang masih kosong.");
  await apiClient.post(endpoints.orders.create, {
    customer_name: values.name,
    phone: values.phone,
    email: values.email,
    vehicle_model: values.vehicleModel,
    note: values.note,
    items: items.map((i) => ({ product_slug: i.slug, quantity: i.qty })),
  });
}
```
BE me-resolve tiap `product_slug` → snapshot `product_name` + `price_snapshot`. Kirim `items` kosong ditolak BE.

### 11b. Admin
`endpoints.orders.adminList` (query `page/limit/status`), `adminDetail` (beserta items), `adminUpdate` (`{ status }` — `NEW|PROCESSED|DONE|CANCELLED`), delete, bulk — `auth: true`.

---

## 12. MEDIA — UPLOAD DUA LANGKAH (WAJIB)

1. Upload file → dapat `uuid`.
2. Kirim `uuid` sebagai `image_uuids` (produk) / `cover_uuid` (blog) di payload create/update.
Jangan pernah base64 inline. `uuid` yang tak ada di tabel media → 404.

```ts
// services/media.ts
import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";

export type UploadedMedia = {
  id: string; url: string; filename: string;
  mime_type: string; size_bytes: number; width: number | null; height: number | null;
};

export async function uploadImage(file: File): Promise<UploadedMedia> {
  const form = new FormData();
  form.append("file", file);
  return apiClient.upload<UploadedMedia>(endpoints.media.upload, form, { auth: true });
}

export function deleteMedia(uuid: string) {
  return apiClient.delete<void>(endpoints.media.delete(uuid), { auth: true });
}
```
Di `product-gallery.tsx` / editor blog: setiap file dipilih → `uploadImage()` → kumpulkan `res.id` → kirim array `image_uuids` saat submit form (§7a). `res.url` dipakai untuk preview langsung.

> `width/height` bisa `null` (BE belum pasang lib dimensi). Beri fallback ukuran di `next/image` (mis. `fill` + parent ber-aspect-ratio) supaya tidak CLS.

---

## 13. DASHBOARD / ANALYTICS (§6 BE) — ganti mock `features/admin/data.ts`

Semua endpoint `auth: true`. Bentuk respons sudah final di `BACKEND-GUIDE.md §6`.

| Komponen admin | Endpoint | Query |
|---|---|---|
| 4 stat card | `GET /dashboard/summary` | — |
| Line chart leads/orders | `GET /dashboard/timeseries` | `metric=leads\|orders\|revenue`, `range=7d\|30d\|90d`, `granularity=day\|week` |
| Pie kategori | `GET /dashboard/products-by-category` | — |
| Bar top produk | `GET /dashboard/top-products` | `range`, `limit` |
| Donut status | `GET /dashboard/status-breakdown` | `entity=orders\|contacts` |
| 2 tabel aktivitas | `GET /dashboard/recent` | — |

Endpoint-nya belum ada di `lib/endpoint.ts` — tambahkan grup `dashboard`:
```ts
dashboard: {
  summary: "/dashboard/summary",
  timeseries: "/dashboard/timeseries",
  productsByCategory: "/dashboard/products-by-category",
  topProducts: "/dashboard/top-products",
  statusBreakdown: "/dashboard/status-breakdown",
  recent: "/dashboard/recent",
},
```
Contoh service + hook:
```ts
// services/admin/dashboard.ts
export const getSummary = () => apiClient.get(endpoints.dashboard.summary, { auth: true });
export const getTimeseries = (q: { metric: string; range: string; granularity?: string }) =>
  apiClient.get(endpoints.dashboard.timeseries, { auth: true, query: q });
```
Mapper mengubah field agregasi (mis. `deltas.leads_pct_vs_prev_period` → chip `"+12.5%"` dengan `deltaDirection`; `points[]` → data chart SVG token-driven yang sudah ada). Komponen `line-chart.tsx`/`donut-chart.tsx`/`bar-list.tsx`/`stat-tile.tsx` tidak berubah — hanya sumber datanya.

---

## 14. CMS (fase akhir — opsional)

Konten home/tentang masih hardcoded di FE. Saat siap: `GET /cms/:key` (publik, `tags:["cms-<key>"]`) dan `PUT /cms/:key` (`{ data }`, admin). Section: `home-hero`, `home-why-us`, `home-testimonial`, `home-partners`, `about`, `contact-info`. Prioritas rendah — dahulukan Products/Blogs/Leads/Orders.

---

## 15. ON-DEMAND ISR (BE → FE) — TINGGAL COCOKKAN SECRET

Webhook FE sudah ada di `app/api/revalidate/route.ts`. BE memanggilnya setelah tiap write admin:
```
POST {FRONTEND_REVALIDATE_URL}?tag=<tag>&secret=<REVALIDATE_SECRET>
```
Yang perlu dilakukan FE:
1. `REVALIDATE_SECRET` FE **=** `REVALIDATE_SECRET` BE (§1).
2. `FRONTEND_REVALIDATE_URL` di BE `.env` = `https://automotive.yuandewatatimur.com/api/revalidate` (domain FE, bukan API).
3. Pastikan setiap fetch publik memberi `tags` yang cocok: `["products"]`, `["blogs"]`, `["cms-<key>"]` (sudah dicontohkan di §6/§9). Tanpa tag yang sama, `revalidateTag` tidak menyegarkan halaman.

---

## 16. GOTCHAS (ringkas)

- **`id` (API) = `uuid` (UI)** — jangan tertukar; publik pakai `slug`, admin pakai `uuid`.
- **`price` selalu string** di JSON → `Number()` di mapper. Kirim balik sebagai string angka bersih.
- **`PRE-ORDER`** (hubung) di output, **`PRE_ORDER`** (underscore) untuk input DTO.
- **`status` "Published"/"Draft"** ↔ `is_published` boolean.
- **snake_case wajib** di semua body/response; mapper yang menjembatani ke camelCase UI.
- **Amplop list** `{ items, meta }` → ratakan pakai `flattenPage` (§5b) agar tabel/pagination lama tetap jalan.
- **204** (delete/logout) → `apiClient` balas `undefined`; jangan `.json()`.
- **Error** = `ApiError` dengan `.status` + `.messages` (string[]); tampilkan `messages` di form.
- **Auth calls** wajib `{ auth: true }` supaya token terpasang.
- **Gambar** butuh host di `next.config` (§2), kalau tidak `next/image` menolak.

---

**Penutup:** kerjakan §1–§5 (fondasi) → §6/§10/§11 (publik, cepat kelihatan) → §7/§13 (admin) → §8/§9 → §14/§15. Karena shape UI (`types/ui/*`) sudah dipakai komponen, wiring = **buat service + mapper, ganti sumber data**, komponen tidak disentuh.
