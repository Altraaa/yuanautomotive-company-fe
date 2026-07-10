import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/common/page-hero";
import { Eyebrow } from "@/components/common/eyebrow";
import { site, waLink } from "@/lib/site";
import { keywordsFor } from "@/lib/seo-keywords";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

const LEGAL_ENTITY = "PT. Yuan Dewata Timur";
const EFFECTIVE_DATE = "1 Juli 2026";
// Dedicated privacy/data-protection inbox (separate from the general site email).
const PRIVACY_EMAIL = "privacy@yuandewatatimur.com";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Kebijakan Privasi ${site.name} (dikelola ${LEGAL_ENTITY}) — bagaimana kami mengumpulkan, menggunakan, dan melindungi Data Pribadi Anda sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).`,
  keywords: keywordsFor("privacy"),
  alternates: { canonical: `${site.url}/kebijakan-privasi` },
};

type Section = {
  id: string;
  title: string;
  /** Leading paragraphs. */
  intro?: string[];
  /** Optional bullet list rendered after the intro. */
  bullets?: string[];
  /** Trailing paragraphs after the bullets. */
  outro?: string[];
  /** Render the data-controller contact card (last section). */
  contact?: boolean;
};

const sections: Section[] = [
  {
    id: "pendahuluan",
    title: "Pendahuluan",
    intro: [
      `${site.name} yang dikelola oleh ${LEGAL_ENTITY} berkomitmen melindungi Data Pribadi setiap pengunjung dan pelanggan. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data Anda ketika menggunakan situs katalog sparepart & aksesoris mobil listrik (EV) kami.`,
      "Dengan menggunakan situs ini dan mengirimkan data melalui formulir kontak, pre-order, maupun menghubungi kami via WhatsApp, email, atau telepon, Anda dianggap telah membaca, memahami, dan menyetujui kebijakan ini.",
    ],
  },
  {
    id: "dasar-hukum",
    title: "Dasar Hukum",
    intro: [
      "Kebijakan ini mengacu pada Undang-Undang Republik Indonesia No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) beserta peraturan pelaksananya.",
      `Dalam pemrosesan Data Pribadi Anda, ${LEGAL_ENTITY} bertindak sebagai Pengendali Data Pribadi sebagaimana dimaksud dalam Pasal 20 UU PDP.`,
    ],
  },
  {
    id: "data-yang-dikumpulkan",
    title: "Data yang Dikumpulkan",
    intro: ["Kami mengumpulkan Data Pribadi dalam empat kategori berikut:"],
    bullets: [
      "Identitas & kontak — nama, email, nomor telepon/WhatsApp, kota, serta model kendaraan EV Anda.",
      "Konsultasi & kebutuhan — detail pesan, kebutuhan sparepart/aksesoris, dan kompatibilitas kendaraan.",
      "Pemesanan / pre-order — produk yang dipesan, jumlah, dan catatan tambahan.",
      "Data teknis — alamat IP, jenis perangkat, halaman yang dikunjungi, cookie, dan data Google Analytics.",
    ],
    outro: [
      "Kami tidak dengan sengaja mengumpulkan Data Pribadi yang bersifat spesifik/sensitif seperti data kesehatan, biometrik, atau keuangan.",
    ],
  },
  {
    id: "tujuan-penggunaan",
    title: "Tujuan Penggunaan",
    intro: ["Data Pribadi Anda kami gunakan untuk tujuan berikut:"],
    bullets: [
      "Melakukan konsultasi dan asesmen kebutuhan sparepart & aksesoris mobil listrik Anda.",
      "Menghubungi Anda terkait pertanyaan, penawaran, konfirmasi stok, dan pre-order.",
      "Kegiatan promosi dan pemasaran produk (Anda dapat memilih berhenti/opt-out kapan saja).",
      "Pelacakan riwayat pelanggan untuk pelayanan yang lebih baik.",
      "Analitik untuk memahami dan meningkatkan kualitas situs serta layanan.",
      "Kepatuhan terhadap hukum yang berlaku dan menjaga keamanan sistem.",
    ],
  },
  {
    id: "dasar-pemrosesan",
    title: "Dasar Pemrosesan & Persetujuan",
    intro: [
      "Pemrosesan Data Pribadi Anda dilakukan berdasarkan persetujuan yang Anda berikan serta kepentingan yang sah (legitimate interest) dari perusahaan.",
      "Persetujuan untuk tujuan pemasaran bersifat sukarela dan dapat Anda tarik kembali kapan saja tanpa memengaruhi layanan inti yang Anda terima.",
    ],
  },
  {
    id: "cookie",
    title: "Cookie & Pelacakan",
    intro: [
      "Kami menggunakan cookie dan teknologi serupa untuk menjalankan fungsi dasar situs, menyimpan preferensi Anda, serta keperluan analitik.",
      "Anda dapat menonaktifkan atau menghapus cookie melalui pengaturan peramban (browser) Anda. Menonaktifkan cookie tertentu dapat memengaruhi sebagian fungsi situs.",
    ],
  },
  {
    id: "pihak-ketiga",
    title: "Pembagian ke Pihak Ketiga",
    intro: [
      "Kami tidak menjual Data Pribadi Anda kepada pihak mana pun. Data hanya dibagikan secara terbatas kepada:",
    ],
    bullets: [
      "Penyedia layanan tepercaya yang membantu operasional kami (mis. hosting, analitik, dan pengiriman).",
      "Mitra dalam grup usaha untuk keperluan pelayanan yang terintegrasi.",
      "Aparat penegak hukum atau instansi berwenang bila diwajibkan oleh peraturan perundang-undangan.",
    ],
  },
  {
    id: "penyimpanan-keamanan",
    title: "Penyimpanan & Keamanan",
    intro: [
      "Kami menerapkan langkah-langkah teknis dan organisasi yang wajar untuk melindungi Data Pribadi Anda dari akses, pengungkapan, perubahan, atau penghancuran yang tidak sah.",
      "Data Pribadi disimpan selama masih diperlukan untuk tujuan pengumpulannya atau selama diwajibkan oleh hukum, kemudian akan dihapus atau dianonimkan.",
    ],
  },
  {
    id: "hak-anda",
    title: "Hak Anda (UU PDP)",
    intro: ["Sesuai UU PDP, Anda memiliki hak-hak berikut atas Data Pribadi Anda:"],
    bullets: [
      "Mengakses dan memperoleh salinan Data Pribadi Anda.",
      "Memperbaiki atau memperbarui data yang tidak akurat.",
      "Menghapus Data Pribadi Anda (right to be forgotten).",
      "Menarik kembali persetujuan yang telah diberikan.",
      "Menolak pemrosesan untuk pemasaran maupun pengambilan keputusan otomatis.",
      "Memperoleh dan memindahkan data Anda (portabilitas data).",
      "Menuntut ganti rugi atas pelanggaran pemrosesan Data Pribadi.",
    ],
  },
  {
    id: "data-anak",
    title: "Data Anak",
    intro: [
      "Layanan kami ditujukan untuk pengguna dewasa. Kami tidak dengan sengaja mengumpulkan Data Pribadi anak-anak tanpa persetujuan orang tua atau wali yang sah.",
      "Apabila Anda menyadari bahwa data anak telah dikirimkan tanpa izin, silakan menghubungi kami agar data tersebut dapat dihapus.",
    ],
  },
  {
    id: "perubahan",
    title: "Perubahan Kebijakan",
    intro: [
      "Kebijakan Privasi ini dapat kami perbarui sewaktu-waktu untuk menyesuaikan dengan perubahan layanan maupun ketentuan hukum.",
      "Versi terbaru akan selalu tersedia di halaman ini beserta tanggal berlakunya. Kami menganjurkan Anda meninjau halaman ini secara berkala.",
    ],
  },
  {
    id: "hubungi-kami",
    title: "Hubungi Kami (Pengendali Data)",
    intro: [
      `Untuk pertanyaan, permintaan penggunaan hak Anda, atau keluhan terkait Data Pribadi, silakan hubungi ${LEGAL_ENTITY} selaku Pengendali Data melalui kanal berikut:`,
    ],
    contact: true,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Kebijakan"
        accent="Privasi"
        description={`Bagaimana ${site.name} (dikelola ${LEGAL_ENTITY}) mengumpulkan, menggunakan, dan melindungi Data Pribadi Anda sesuai UU PDP.`}
      />

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        {/* Meta strip */}
        <div className="mb-8 flex flex-col gap-2 border border-border border-l-[3px] border-l-gold bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-[13px] text-fg-muted">
            Berlaku efektif <b className="text-fg">{EFFECTIVE_DATE}</b>
          </span>
          <span className="font-sans text-[13px] text-fg-muted">
            Pengendali Data: <b className="text-gold">{LEGAL_ENTITY}</b>
          </span>
        </div>

        {/* Table of contents */}
        <nav
          aria-label="Daftar isi"
          className="mb-10 border border-border bg-surface-sunken p-5"
        >
          <Eyebrow className="tracking-[0.24em]">Daftar Isi</Eyebrow>
          <ol className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-2 font-sans text-[13px] text-fg-muted transition-colors hover:text-gold"
                >
                  <span className="font-display text-[11px] font-bold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="flex items-baseline gap-3 font-display text-xl font-bold uppercase italic text-fg md:text-2xl">
                <span className="text-gold">{String(i + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>

              <div className="mt-4 flex flex-col gap-3">
                {section.intro?.map((p, j) => (
                  <p key={j} className="font-sans text-[14.5px] leading-relaxed text-fg-muted">
                    {p}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="flex flex-col gap-2 pl-1">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 font-sans text-[14.5px] leading-relaxed text-fg-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 -skew-x-12 bg-red" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.outro?.map((p, j) => (
                  <p key={j} className="font-sans text-[14.5px] leading-relaxed text-fg-muted">
                    {p}
                  </p>
                ))}

                {section.contact && <ContactCard />}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

function ContactCard() {
  return (
    <div className="mt-2 grid gap-3 border border-border bg-surface p-5 sm:grid-cols-3">
      <ContactItem
        icon={<Mail className="h-4 w-4" />}
        label="Email"
        value={PRIVACY_EMAIL}
        href={`mailto:${PRIVACY_EMAIL}`}
      />
      <ContactItem
        icon={<MessageCircle className="h-4 w-4" />}
        label="WhatsApp"
        value={site.whatsapp.display}
        href={waLink()}
        external
      />
      <ContactItem
        icon={<MapPin className="h-4 w-4" />}
        label="Alamat"
        value={site.location}
      />
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="grid h-8 w-8 shrink-0 place-items-center border border-border bg-surface-sunken text-gold">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
          {label}
        </span>
        <span className="block truncate font-sans text-[13px] font-semibold text-fg">{value}</span>
      </span>
    </>
  );
  const className = "flex items-center gap-3";
  if (href) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(className, "transition-colors hover:text-gold")}
      >
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}
