import type { Metadata } from "next";
import { Target, Compass } from "lucide-react";
import { PageHero } from "@/components/common/page-hero";
import { StatsStrip } from "@/components/common/stats-strip";
import { Eyebrow } from "@/components/common/eyebrow";
import { CtaBanner } from "@/components/common/cta-banner";
import { site, waLink } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tentang Kami — Profil Perusahaan",
  description: `${site.name} adalah pusat sparepart & aksesoris mobil listrik untuk komunitas EV, bengkel, dan jaringan dealer di Indonesia.`,
  alternates: { canonical: `${site.url}/tentang` },
};

const stats = [
  { value: "80+", label: "SKU Produk EV" },
  { value: "100%", label: "Spesifikasi Tercantum" },
  { value: "Grosir", label: "Harga Dealer" },
  { value: "< 15'", label: "Respon WhatsApp" },
];

const vision =
  "Menjadi pusat sparepart & aksesoris mobil listrik paling tepercaya di Indonesia — mempercepat adopsi kendaraan listrik melalui komponen berkualitas, spesifikasi transparan, dan layanan yang mengutamakan pelanggan.";

const missions = [
  "Menyediakan katalog sparepart & aksesoris EV yang terkurasi, terverifikasi kompatibilitasnya, dan lengkap spesifikasi teknis.",
  "Memberikan harga grosir yang adil bagi komunitas, bengkel, dealer, dan reseller dengan pasokan stok yang berkelanjutan.",
  "Mengedepankan konsultasi teknis yang jujur agar setiap pelanggan mendapat komponen yang benar-benar sesuai kebutuhannya.",
  "Membangun dukungan purna jual yang andal — garansi, pemasangan, dan penggantian — demi performa kendaraan yang optimal.",
];

const steps = [
  {
    no: "01",
    title: "Kurasi Produk",
    body: "Setiap sparepart dipilih dan diverifikasi spesifikasi serta kompatibilitasnya sebelum masuk katalog.",
  },
  {
    no: "02",
    title: "Konsultasi Teknis",
    body: "Tim kami membantu memastikan komponen sesuai dengan model EV dan kebutuhan Anda via WhatsApp.",
  },
  {
    no: "03",
    title: "Harga Grosir",
    body: "Dealer dan reseller mendapat harga khusus untuk order besar dengan dukungan stok berkelanjutan.",
  },
  {
    no: "04",
    title: "Dukungan Purna Jual",
    body: "Bantuan pemasangan, garansi, dan penggantian untuk menjaga performa kendaraan tetap optimal.",
  },
];

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Mendorong Ekosistem EV Indonesia,"
        accent="Satu Komponen Sekaligus."
        description={`${site.name} — pusat sparepart & aksesoris mobil listrik untuk komunitas EV, bengkel, dan jaringan dealer di seluruh Indonesia. Kami percaya setiap komponen berkualitas mempercepat adopsi kendaraan listrik.`}
      />

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
          <StatsStrip stats={stats} />
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 pb-4 md:px-8 md:pb-8">
          <div className="flex flex-col gap-3">
            <Eyebrow tone="gold">Arah Kami</Eyebrow>
            <h2 className="font-display text-2xl font-bold italic uppercase text-fg md:text-4xl">
              Visi &amp; <span className="text-gold">Misi</span>
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.15fr] lg:gap-6">
            {/* Visi */}
            <div className="flex flex-col gap-4 border border-border border-t-[3px] border-t-gold bg-surface p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center bg-gold/10 text-gold">
                  <Compass className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-bold italic uppercase text-fg">Visi</h3>
              </div>
              <p className="font-sans text-base leading-relaxed text-fg-muted">{vision}</p>
            </div>

            {/* Misi */}
            <div className="flex flex-col gap-4 border border-border border-t-[3px] border-t-red bg-surface p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center bg-red/10 text-red-soft">
                  <Target className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-bold italic uppercase text-fg">Misi</h3>
              </div>
              <ul className="flex flex-col gap-4">
                {missions.map((item, i) => (
                  <li key={item} className="flex gap-3.5">
                    <span className="font-display text-sm font-bold italic text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-sans text-sm leading-relaxed text-fg-muted">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface-raised">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <div className="flex flex-col gap-3">
            <Eyebrow tone="red">Cara Kami Melayani</Eyebrow>
            <h2 className="font-display text-2xl font-bold italic uppercase text-fg md:text-4xl">
              Dari Katalog Hingga <span className="text-gold">Purna Jual</span>
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.no}
                className="flex flex-col gap-3 border border-border border-t-[3px] border-t-red bg-surface p-6"
              >
                <span className="font-display text-3xl font-bold italic text-gold">{step.no}</span>
                <h3 className="font-sans text-lg font-semibold text-fg">{step.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-fg-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Daftar Bermitra"
        accent="Dengan Kami"
        description="Jadi bagian dari jaringan dealer & reseller kami. Dapatkan harga grosir dan dukungan penuh."
        ctaLabel="Chat Sales"
        ctaHref={waLink("Halo, saya ingin mendaftar bermitra (dealer/reseller) dengan Yuan Dewata Automotive.")}
        external
      />
    </>
  );
}
