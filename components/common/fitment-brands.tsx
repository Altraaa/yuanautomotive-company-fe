import { CarFront } from "lucide-react";

/**
 * FitmentBrands — the compact "Untuk BYD, Wuling …" compatibility line for
 * product cards. Presentational and props-driven: shows up to `max` brand chips
 * plus a "+N" overflow, so a scanning user instantly sees which cars a part
 * fits without opening the detail page. Renders nothing when the list is empty.
 */
export function FitmentBrands({ brands, max = 2 }: { brands: string[]; max?: number }) {
  if (brands.length === 0) return null;
  const shown = brands.slice(0, max);
  const rest = brands.length - shown.length;

  return (
    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2.5">
      <CarFront className="h-3.5 w-3.5 flex-none text-gold" />
      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-fg-subtle">
        Untuk
      </span>
      {shown.map((brand) => (
        <span
          key={brand}
          className="border border-gold/30 bg-gold/5 px-1.5 py-0.5 font-display text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-gold"
        >
          {brand}
        </span>
      ))}
      {rest > 0 ? (
        <span className="font-sans text-[10.5px] font-medium text-fg-subtle">+{rest}</span>
      ) : null}
    </div>
  );
}
