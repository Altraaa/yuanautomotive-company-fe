import type { FaqItem } from "@/types/ui/faq";

/**
 * MOCK FAQ dataset — public fallback used by `services/faqs` only when the
 * backend is truly down (5xx / unreachable). Mirrors the seed content in
 * `automotive-be/src/database/seeds/faqs.json`, already ordered by
 * category → sort_order so the accordion renders sensibly without the API.
 */
export const faqs: FaqItem[] = [
  {
    id: "faq-umum-1",
    question: "Apa saja yang dijual oleh Yuan Dewata Automotive?",
    answer:
      "Kami menyediakan spare part, body parts, dan aksesoris untuk mobil Cina serta kendaraan listrik (EV). Mulai dari komponen mesin, kaki-kaki, kelistrikan, hingga perlengkapan charging dan interior — semuanya dengan spesifikasi teknis yang lengkap.",
    category: "Umum",
  },
  {
    id: "faq-umum-2",
    question: "Di mana lokasi toko Yuan Dewata Automotive?",
    answer:
      "Kami berlokasi di Sanur, Denpasar Selatan, Bali. Anda bisa datang langsung ke toko kami atau menghubungi tim kami melalui WhatsApp untuk konsultasi produk sebelum berkunjung.",
    category: "Umum",
  },
  {
    id: "faq-produk-1",
    question: "Apakah produk yang dijual original?",
    answer:
      "Ya. Kami mengutamakan produk original maupun aftermarket berkualitas dari pemasok terpercaya. Setiap produk dilengkapi spesifikasi teknis sehingga Anda bisa memastikan kecocokan sebelum membeli.",
    category: "Produk",
  },
  {
    id: "faq-produk-2",
    question: "Bagaimana cara memastikan sparepart cocok dengan mobil saya?",
    answer:
      "Setiap produk mencantumkan daftar kompatibilitas kendaraan dan spesifikasi teknis. Jika masih ragu, kirimkan tipe, tahun, dan nomor rangka/mesin mobil Anda ke tim kami via WhatsApp — kami bantu cek kecocokannya.",
    category: "Produk",
  },
  {
    id: "faq-produk-3",
    question: "Apakah tersedia sparepart untuk mobil listrik (EV)?",
    answer:
      "Tentu. Kami menyediakan komponen dan aksesoris khusus kendaraan listrik seperti charger portable, kabel charging Type 2, wall bracket, hingga sparepart pendukung untuk berbagai merek EV populer di Indonesia.",
    category: "Produk",
  },
  {
    id: "faq-beli-1",
    question: "Bagaimana cara melakukan pemesanan?",
    answer:
      "Pilih produk yang Anda inginkan di katalog kami, lalu klik tombol pemesanan atau hubungi kami langsung melalui WhatsApp. Tim kami akan membantu proses pemesanan, konfirmasi stok, dan pengiriman hingga selesai.",
    category: "Pembelian",
  },
  {
    id: "faq-beli-2",
    question: "Apakah bisa membeli dengan harga grosir atau reseller?",
    answer:
      "Bisa. Kami melayani pembelian grosir untuk bengkel, dealer, dan reseller dengan harga khusus. Silakan hubungi tim kami melalui WhatsApp untuk mendapatkan penawaran harga grosir sesuai kebutuhan Anda.",
    category: "Pembelian",
  },
  {
    id: "faq-beli-3",
    question: "Apakah bisa pre-order untuk produk yang stoknya kosong?",
    answer:
      "Bisa. Untuk produk tertentu yang sedang tidak tersedia, kami membuka sistem pre-order. Tim kami akan menginformasikan estimasi ketersediaan dan waktu tunggu sebelum Anda melakukan pemesanan.",
    category: "Pembelian",
  },
  {
    id: "faq-bayar-1",
    question: "Metode pembayaran apa saja yang diterima?",
    answer:
      "Kami menerima pembayaran melalui transfer bank dan pembayaran langsung di toko. Detail rekening dan konfirmasi pembayaran akan diberikan oleh tim kami saat proses pemesanan berlangsung.",
    category: "Pembayaran",
  },
  {
    id: "faq-bayar-2",
    question: "Apakah harga produk sudah termasuk ongkos kirim?",
    answer:
      "Harga yang tertera adalah harga produk. Ongkos kirim dihitung terpisah berdasarkan tujuan dan berat/dimensi barang. Tim kami akan menginformasikan total biaya sebelum Anda menyelesaikan pembayaran.",
    category: "Pembayaran",
  },
  {
    id: "faq-kirim-1",
    question: "Apakah melayani pengiriman ke luar Bali?",
    answer:
      "Ya. Kami melayani pengiriman ke seluruh Indonesia melalui jasa ekspedisi tepercaya. Estimasi biaya dan lama pengiriman akan disesuaikan dengan alamat tujuan dan layanan ekspedisi yang dipilih.",
    category: "Pengiriman",
  },
  {
    id: "faq-kirim-2",
    question: "Berapa lama waktu pengiriman?",
    answer:
      "Untuk wilayah Bali, pengiriman umumnya 1–2 hari kerja. Untuk luar Bali, estimasi 2–5 hari kerja tergantung lokasi dan ekspedisi. Barang biasanya dikirim pada hari yang sama jika pembayaran dikonfirmasi sebelum jam operasional berakhir.",
    category: "Pengiriman",
  },
  {
    id: "faq-kirim-3",
    question: "Bagaimana cara melacak status pengiriman?",
    answer:
      "Setelah barang dikirim, kami akan memberikan nomor resi pengiriman melalui WhatsApp. Anda bisa memakai nomor resi tersebut untuk melacak posisi paket di situs ekspedisi yang bersangkutan.",
    category: "Pengiriman",
  },
  {
    id: "faq-garansi-1",
    question: "Apakah produk bergaransi?",
    answer:
      "Sebagian besar produk kami bergaransi, dengan masa garansi yang bervariasi tergantung jenis barang (mulai dari 2 minggu hingga beberapa bulan). Informasi garansi tercantum pada spesifikasi masing-masing produk.",
    category: "Garansi",
  },
  {
    id: "faq-garansi-2",
    question: "Bagaimana jika barang yang diterima rusak atau tidak sesuai?",
    answer:
      "Segera hubungi kami maksimal 1x24 jam setelah barang diterima, sertakan foto/video kondisi barang. Setelah kami verifikasi, kami akan bantu proses penggantian atau solusi terbaik sesuai kebijakan garansi.",
    category: "Garansi",
  },
  {
    id: "faq-garansi-3",
    question: "Apakah bisa retur atau tukar barang?",
    answer:
      "Retur atau penukaran dapat dilakukan untuk kasus barang cacat produksi atau salah kirim, dengan syarat barang masih dalam kondisi asli dan belum dipasang. Hubungi tim kami untuk memulai proses retur.",
    category: "Garansi",
  },
];

/** Public read used by the FAQ page fallback. */
export function getAllFaqs(): FaqItem[] {
  return faqs;
}
