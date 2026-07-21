# 🚗 KOMPATIBILITAS PRODUK (Vehicle Fitment) — SPEK BACKEND

Field `compatibility` pada produk **diubah bentuknya** di frontend: dari daftar teks (`string[]`) menjadi daftar objek kendaraan terstruktur (**merek + model + tahun**). FE sudah hidup penuh memakai data mock (auto-fallback) dengan bentuk baru ini. Dokumen ini adalah kontrak yang harus dibangun di **NestJS API** agar data asli menggantikan mock **tanpa perubahan kode FE**.

> Ikuti **`BACKEND-GUIDE.md` §2 (Konvensi Global)**: base URL tanpa prefix `/api`, field JSON **`snake_case`**, bentuk error NestJS default, public pakai **slug**, admin pakai **uuid**, role dipisah lewat **JWT**. Setiap write admin → **revalidate `tag=products`** ke FE (`BACKEND-GUIDE.md §7`).

Sumber kebenaran field ada di FE:
- Tipe API: `types/api/product.ts` → `ApiVehicleFitment`
- Tipe UI + helper label: `types/ui/product.ts` → `VehicleFitment`, `fitmentLabel()`
- Mapper (toleran shape lama): `services/products.ts` → `toFitments()`
- Payload builder admin: `services/admin/products.ts` → `toProductPayload()`
- Skema form (validasi): `features/admin/product-schema.ts`

---

## 0. RINGKASAN — APA YANG BERUBAH

1. **`compatibility` bukan lagi `string[]`** — sekarang **array objek** `{ brand, model, years }`.
2. Berlaku di **3 payload/respons**: detail produk publik, detail produk admin, dan **body create/update** produk admin.
3. **Tidak ada endpoint baru.** Hanya perubahan bentuk 1 field pada endpoint produk yang sudah ada.
4. Field ini **read-only turunan konten** — tidak melalui alur media/upload. Cukup disimpan & dikembalikan apa adanya.

---

## 1. BENTUK FIELD (JSON)

Satu entri kendaraan:

```jsonc
{
  "brand": "Wuling",       // wajib, string non-kosong (mis. merek)
  "model": "Air EV",       // wajib, string non-kosong (mis. tipe/model)
  "years": "2022–2024"     // OPSIONAL, string bebas (rentang/tahun); boleh null / dihilangkan
}
```

`compatibility` adalah **array** dari objek di atas, dan **urutannya dipertahankan** (tampil apa adanya di FE):

```jsonc
"compatibility": [
  { "brand": "Wuling",    "model": "Air EV",  "years": "2022–2024" },
  { "brand": "Hyundai",   "model": "Ioniq 5", "years": "2021–2025" },
  { "brand": "Universal", "model": "Type 2" }              // years boleh tidak ada
]
```

Catatan:
- `years` **string bebas**, bukan number/range terstruktur — FE hanya menampilkannya (mis. `"2022–2024"`, `"2023+"`, `"Semua tahun"`).
- FE sudah membuang baris yang `brand`/`model`-nya kosong sebelum mengirim (lihat `toProductPayload`), tetapi **backend tetap wajib memvalidasi** (lihat §4).
- Array kosong `[]` **valid** (produk tanpa data kompatibilitas) — FE akan menyembunyikan seksinya.

---

## 2. DATA MODEL (opsi penyimpanan)

Field ini analog dengan `specs` (yang sudah tersimpan sebagai daftar `{ label, value, sort_order }`). Dua opsi, pilih yang konsisten dengan implementasi `specs` saat ini:

**Opsi A — kolom JSON (paling ringkas, disarankan bila `specs` juga JSON):**

```prisma
model Product {
  // ...
  compatibility Json @default("[]")   // array of { brand, model, years? }
}
```

**Opsi B — tabel relasi (bila butuh query "cari produk untuk mobil X"):**

```prisma
model ProductFitment {
  id        String  @id @default(uuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  brand     String
  model     String
  years     String?
  sortOrder Int     @default(0)   // pertahankan urutan input admin
}
```

> **Rekomendasi:** mulai dengan **Opsi A** (JSON) karena FE belum butuh filter "produk untuk mobil X". Naikkan ke Opsi B hanya bila fitur pencarian by-vehicle dibutuhkan nanti — bentuk JSON respons ke FE **tetap sama**.

---

## 3. ENDPOINT YANG TERPENGARUH

Tidak ada endpoint baru. Sesuaikan bentuk `compatibility` pada:

| Endpoint | Arah | Perubahan |
|---|---|---|
| `GET /products/slug/:slug` (publik) | respons | `compatibility` → array objek |
| `GET /products/:uuid` (admin) | respons | `compatibility` → array objek |
| `POST /products` (admin, create) | request body | terima `compatibility` array objek |
| `PATCH /products/:uuid` (admin, update) | request body | terima `compatibility` array objek |

Endpoint **list** (`GET /products`) **tidak** mengirim `compatibility` (kartu produk tak butuh) — biarkan seperti sekarang.

### Contoh body create/update yang dikirim FE

```jsonc
// PATCH /products/:uuid  (potongan payload relevan)
{
  "name": "Kampas Rem Depan EV",
  "compatibility": [
    { "brand": "Wuling",  "model": "Air EV",  "years": "2022–2024" },
    { "brand": "Hyundai", "model": "Ioniq 5", "years": "2021–2025" }
  ],
  "specs": [ { "label": "Material", "value": "Ceramic", "sort_order": 0 } ]
  // ...field lain tidak berubah
}
```

> FE **menghilangkan** `years` dari payload bila kosong (mengirim `undefined`, jadi key-nya absen). Backend harus menganggap `years` absen / `null` / `""` sebagai "tanpa tahun".

---

## 4. VALIDASI DTO (NestJS)

```ts
class VehicleFitmentDto {
  @IsString() @IsNotEmpty() @MaxLength(60)
  brand: string;

  @IsString() @IsNotEmpty() @MaxLength(80)
  model: string;

  @IsOptional() @IsString() @MaxLength(40)
  years?: string;
}

// di Create/UpdateProductDto:
@IsArray()
@ValidateNested({ each: true })
@Type(() => VehicleFitmentDto)
@IsOptional()                       // absen = jangan ubah (khusus PATCH); create default []
compatibility?: VehicleFitmentDto[];
```

Aturan:
- **Trim** `brand`, `model`, `years`; drop entri yang `brand` **atau** `model`-nya kosong setelah trim.
- **Pertahankan urutan** array (jangan sort ulang) — urutan adalah keputusan admin.
- Pada **PATCH**, `compatibility` absen ⇒ **biarkan data lama** (jangan clear). `compatibility: []` ⇒ **kosongkan**. (Sama seperti pola `image_uuids`.)

---

## 5. KOMPATIBILITAS MUNDUR (shape lama)

FE `toFitments()` **toleran** terhadap shape lama: bila backend sempat mengirim `compatibility: ["Wuling Air EV"]` (string), FE tetap render sebagai `{ brand: "Wuling Air EV", model: "" }`. Jadi **tidak ada breaking** saat transisi. Namun target akhir backend adalah **selalu** mengirim/menyimpan bentuk objek baru.

Bila ada data lama `string[]` di DB, migrasi sederhana: pecah tiap string jadi `{ brand: <string>, model: "" }` (atau parse manual bila mau memisah merek/model). Tidak wajib untuk rilis awal karena FE menanganinya.

---

## 6. CHECKLIST BE

- [ ] Ubah kolom/relasi `compatibility` ke bentuk objek (§2, Opsi A disarankan).
- [ ] `GET /products/slug/:slug` & `GET /products/:uuid` mengembalikan `compatibility` array objek `{ brand, model, years? }`, urutan terjaga.
- [ ] `POST` & `PATCH /products` menerima & memvalidasi `compatibility` via `VehicleFitmentDto` (§4).
- [ ] PATCH: absen = biarkan; `[]` = kosongkan.
- [ ] (Opsional) migrasi data lama `string[]` → objek.
- [ ] Write admin tetap memicu revalidate `tag=products` ke FE.
