import { CtaButton } from "@/components/common/cta-button";
import { Badge } from "@/components/common/badge";
import { waLink } from "@/lib/site";

const highlights = [
  "Importir Langsung",
  "100% Original",
  "Pre-Order Satuan",
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-linear-to-b from-surface to-bg"
    >
      {/* diagonal red/gold speed stripes — the hero's main visual motif */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-full w-[38%] skew-x-24 bg-linear-to-r from-red/10 to-transparent" />
        <div className="absolute -right-16 top-0 h-full w-[6%] skew-x-24 bg-red/15" />
        <div className="absolute -right-4 top-0 h-full w-[6%] skew-x-24 bg-gold/20" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-8 text-center md:px-8 md:pb-24 md:pt-12">
        <Badge intent="red" skew className="mb-6 px-3.5 py-1.5 text-[11px] tracking-[0.16em]">
          Importir Langsung
        </Badge>

        <h1 className="font-display text-4xl font-bold italic uppercase leading-[1.06] text-fg md:text-6xl lg:text-7xl">
          Pastikan Kendaraan Anda Mendapatkan {""}
          <span className="text-gold">Sparepart Original Terbaik</span>
        </h1>

        <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-fg-muted md:text-lg">
          One-stop shopping spare part, body parts, dan aksesoris mobil Cina di Indonesia.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
          <CtaButton href="/produk" variant="primary" size="lg">
            Lihat Produk
          </CtaButton>
          <CtaButton href={waLink()} target="_blank" rel="noopener" variant="gold" size="lg">
            Chat Sales
          </CtaButton>
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-16">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted"
            >
              <span className="h-1.5 w-1.5 -skew-x-12 bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
