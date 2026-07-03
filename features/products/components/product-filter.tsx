"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { productCategories, priceRanges } from "@/features/products/data";
import { Eyebrow } from "@/components/common/eyebrow";
import { cn } from "@/lib/utils";

type Row = { key: string | undefined; label: string };

const categoryRows: Row[] = [
  { key: undefined, label: "Semua" },
  ...productCategories.map((c) => ({ key: c.toLowerCase(), label: c })),
];

const priceRows: Row[] = [
  { key: undefined, label: "Semua Harga" },
  ...priceRanges.map((r) => ({ key: r.key, label: r.label })),
];

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
  const activePrice = searchParams.get("harga") ?? undefined;

  function setParam(param: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    params.delete("page"); // reset paging on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const activeCount = (activeCategory ? 1 : 0) + (activePrice ? 1 : 0);

  const panel = (
    <div className="flex flex-col gap-8">
      <FilterGroup
        title="Kategori"
        rows={categoryRows}
        active={activeCategory}
        onSelect={(key) => setParam("kategori", key)}
      />
      <FilterGroup
        title="Rentang Harga"
        rows={priceRows}
        active={activePrice}
        onSelect={(key) => setParam("harga", key)}
      />
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
