# Prompt — Setup Docker Lokal (samakan dengan VPS)

Tempelkan prompt di bawah ini ke Claude Code (atau AI assistant) di mesin lokalmu,
di dalam folder repo `yuanautomotive-company-fe`. Tujuannya: menjalankan image Docker
yang identik dengan yang sudah live di VPS, tanpa Nginx/SSL (cukup akses via localhost).

---

Saya punya project Next.js 16 (App Router, `output: "standalone"`) bernama
**Yuan Dewata Automotive** di folder ini. Project ini sudah punya konfigurasi Docker
yang dipakai di VPS: `Dockerfile`, `.dockerignore`, `docker-compose.yml`, dan
`docker-compose.override.yml`. Saya mau menjalankannya secara lokal supaya PERSIS sama
dengan setup VPS. Tolong bantu dengan aturan berikut:

1. **Jangan ubah `Dockerfile`.** Ini image yang sama dengan produksi (multi-stage,
   Next.js standalone, user non-root `nextjs`, listen di port 3000 dalam container).

2. **Environment variables** — buat file `.env` dari `.env.local.example`:
   - `NEXT_PUBLIC_API_URL` → arahkan ke API yang kamu pakai untuk dev.
     Nilai ini **di-inline saat build** (bukan runtime), jadi kalau diubah harus rebuild.
     - Produksi VPS memakai: `https://api.yuandewatatimur.cloud/api`
     - Untuk lokal biasanya: `http://localhost:3000/api` (atau URL API stagingmu)
   - `REVALIDATE_SECRET` → isi string acak (mis. hasil `openssl rand -hex 32`).
     Dipakai runtime oleh `app/api/revalidate/route.ts`.

3. **Port** — di VPS container di-map ke `127.0.0.1:3002` lewat
   `docker-compose.override.yml` (karena 3000 & 3001 sudah dipakai service lain di VPS).
   Di lokal saya TIDAK butuh override itu. Base `docker-compose.yml` sudah map ke
   `127.0.0.1:3000:3000`. Karena Docker Compose otomatis menggabungkan file override,
   jalankan Compose HANYA dengan base file supaya port lokal = 3000:

   ```bash
   docker compose -f docker-compose.yml up -d --build
   ```

   (Kalau port 3000 di lokal bentrok, ganti sisi kiri mapping di `docker-compose.yml`
   menjadi mis. `127.0.0.1:8080:3000`, jangan sentuh sisi kanan `3000`.)

4. **Build & jalankan**, lalu verifikasi:
   ```bash
   docker compose -f docker-compose.yml up -d --build
   docker compose -f docker-compose.yml ps
   curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3000/
   ```
   Harus balas `HTTP 200`. Buka http://localhost:3000 di browser.

5. **Catatan penting yang harus kamu jaga:**
   - `NEXT_PUBLIC_*` di-inline saat `next build` → ganti nilai = wajib `--build` ulang.
   - Jangan commit `.env` (sudah di-`.gitignore`).
   - Image, container name, dan Dockerfile harus sama dengan VPS; yang beda hanya
     nilai `.env` dan port host lokal.

Tolong kerjakan langkah 2–4, tampilkan output verifikasinya, dan beri tahu saya
URL lokal untuk mengakses situsnya.
