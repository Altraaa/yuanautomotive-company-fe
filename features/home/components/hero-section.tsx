import Image from "next/image";
import { CtaButton } from "@/components/common/cta-button";
import { Badge } from "@/components/common/badge";
import { site, waLink } from "@/lib/site";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-surface to-bg"
    >
      {/* diagonal red/gold speed stripes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 hidden h-[640px] w-[420px] rotate-[8deg] md:block"
      >
        <div className="absolute inset-y-0 left-[44%] w-[8%] skew-x-[24deg] bg-red/20" />
        <div className="absolute inset-y-0 left-[60%] w-[8%] skew-x-[24deg] bg-gold/25" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_1fr] md:items-center md:px-8 md:py-16">
        <div className="flex flex-col">
          <Badge intent="red" skew className="mb-5 w-fit px-3.5 py-1.5 text-[11px] tracking-[0.16em]">
            Importir Langsung
          </Badge>

          <h1 className="font-display text-3xl font-bold italic uppercase leading-[1.08] text-fg md:text-[42px] lg:text-5xl">
            Pastikan Kendaraan Anda Mendapatkan{" "}
            <span className="text-gold">Sparepart Original Terbaik</span>
          </h1>

          <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-fg-muted md:text-[17px]">
            One-stop shopping spare part, body parts, dan aksesoris mobil Cina di Indonesia.
          </p>

          <div className="mt-7 flex flex-col gap-3.5 sm:flex-row">
            <CtaButton href="/produk" variant="primary" size="lg">
              Lihat Produk
            </CtaButton>
            <CtaButton href={waLink()} target="_blank" rel="noopener" variant="gold" size="lg">
              Chat Sales
            </CtaButton>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden border border-gold/35 bg-gradient-to-b from-surface-sunken to-surface-black md:aspect-auto md:h-[340px]">
          <Image
            src="/placeholder-hero.png"
            alt={`Sparepart dan aksesoris mobil listrik ${site.name}`}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
