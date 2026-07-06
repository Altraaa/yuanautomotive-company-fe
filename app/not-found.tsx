import { BackButton } from "@/components/common/back-button";
import { CtaButton } from "@/components/common/cta-button";
import { Eyebrow } from "@/components/common/eyebrow";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <span className="font-display text-7xl font-bold italic text-gold md:text-8xl">404</span>
      <Eyebrow tone="red">Halaman Tidak Ditemukan</Eyebrow>
      <h1 className="font-display text-2xl font-bold italic uppercase text-fg md:text-3xl">
        Rute Ini Buntu
      </h1>
      <p className="max-w-md font-sans text-fg-muted">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia. Kembali ke halaman
        sebelumnya.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <BackButton />
        <CtaButton href="/" variant="outline">
          Ke Beranda
        </CtaButton>
      </div>
    </main>
  );
}
