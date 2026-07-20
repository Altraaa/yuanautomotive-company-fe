"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import {
  productCategories,
  pricePresets,
  priceBounds,
  PRICE_STEP,
} from "@/features/products/data";
import { Eyebrow } from "@/components/common/eyebrow";
import { PriceRangeSlider } from "@/components/common/price-range-slider";
import { cn } from "@/lib/utils";

// Harga disembunyikan sementara untuk end user — set true untuk menampilkan lagi.
const SHOW_PRICE_FILTER = false;

type Row = { key: string | undefined; label: string };

const categoryRows: Row[] = [
  { key: undefined, label: "Semua" },
  ...productCategories.map((c) => ({ key: c.toLowerCase(), label: c })),
];

function clampToBounds(n: number): number {
  return Math.max(priceBounds.min, Math.min(priceBounds.max, n));
}

/**
 * ProductFilter — category + price filter driven by URL search params (so the
 * server component re-renders filtered results). Sidebar on desktop, bottom-sheet
 * on mobile via the "Filter" trigger — one component, adapts internally.
 */
export function ProductFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeCategory = searchParams.get("kategori") ?? undefined;
  const urlMin = searchParams.get("hargaMin");
  const urlMax = searchParams.get("hargaMax");

  const activeMin = urlMin ? clampToBounds(Number(urlMin)) : priceBounds.min;
  const activeMax = urlMax ? clampToBounds(Number(urlMax)) : priceBounds.max;
  const priceActive = Boolean(urlMin || urlMax);

  // Local slider value; commit to the URL only when the user settles.
  const [range, setRange] = useState<[number, number]>([activeMin, activeMax]);

  // Re-sync when the URL changes externally (reset, back/forward).
  useEffect(() => {
    setRange([activeMin, activeMax]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlMin, urlMax]);

  function setParam(param: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    params.delete("page"); // reset paging on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function commitPrice([lo, hi]: [number, number]) {
    const params = new URLSearchParams(searchParams.toString());
    if (lo > priceBounds.min) params.set("hargaMin", String(lo));
    else params.delete("hargaMin");
    if (hi < priceBounds.max) params.set("hargaMax", String(hi));
    else params.delete("hargaMax");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function applyPreset(min: number, max: number) {
    const pair: [number, number] = [clampToBounds(min), clampToBounds(max)];
    setRange(pair);
    commitPrice(pair);
  }

  const activeCount =
    (activeCategory ? 1 : 0) + (SHOW_PRICE_FILTER && priceActive ? 1 : 0);

  const panel = (
    <div className="flex flex-col gap-8">
      <FilterGroup
        title="Kategori"
        rows={categoryRows}
        active={activeCategory}
        onSelect={(key) => setParam("kategori", key)}
      />

      {SHOW_PRICE_FILTER ? (
        <div className="flex flex-col gap-4">
          <Eyebrow>Rentang Harga</Eyebrow>
          <PriceRangeSlider
            min={priceBounds.min}
            max={priceBounds.max}
            step={PRICE_STEP}
            value={range}
            onChange={setRange}
            onCommit={commitPrice}
          />
          <div className="flex flex-wrap gap-2">
            {pricePresets.map((preset) => {
              const selected =
                range[0] === clampToBounds(preset.min) && range[1] === clampToBounds(preset.max);
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.min, preset.max)}
                  className={cn(
                    "-skew-x-[8deg] border px-2.5 py-1.5 font-sans text-xs transition-colors",
                    selected
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border bg-surface text-fg-muted hover:border-gold/60 hover:text-fg"
                  )}
                >
                  <span className="inline-block skew-x-[8deg]">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() => {
            router.push(pathname, { scroll: false });
            setOpen(false);
          }}
          className="w-fit font-display text-xs font-bold uppercase tracking-[0.1em] text-red hover:text-red-soft"
        >
          Reset Filter
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-border bg-surface px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.1em] text-fg md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
        {activeCount > 0 ? (
          <span className="grid h-5 w-5 place-items-center bg-red text-[10px] text-fg">
            {activeCount}
          </span>
        ) : null}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-full md:block">{panel}</aside>

      {/* Mobile bottom-sheet */}
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Tutup filter"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-surface-black/70"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto border-t-2 border-t-gold bg-bg p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-display text-lg font-bold italic uppercase text-fg">Filter</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup">
                <X className="h-5 w-5 text-fg" />
              </button>
            </div>
            {panel}
          </div>
        </div>
      ) : null}
    </>
  );
}

function FilterGroup({
  title,
  rows,
  active,
  onSelect,
}: {
  title: string;
  rows: Row[];
  active: string | undefined;
  onSelect: (key: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      <div className="flex flex-col gap-1">
        {rows.map((row) => {
          const selected = active === row.key;
          return (
            <button
              key={row.label}
              type="button"
              onClick={() => onSelect(row.key)}
              className={cn(
                "flex items-center justify-between py-1.5 text-left font-sans text-sm transition-colors",
                selected ? "text-gold" : "text-fg-muted hover:text-fg"
              )}
            >
              <span>{row.label}</span>
              {selected ? <span className="h-1.5 w-1.5 rounded-full bg-gold" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
