"use client";

import { ChevronDown, Search } from "lucide-react";
import { productCategories } from "@/features/products/data";

export type ProductListFilters = {
  search: string;
  category: string; // "Semua" | category name
  status: string; // "Semua" | "Published" | "Draft"
  sort: string; // "Terbaru" | "Termurah" | "Termahal"
};

export const defaultProductFilters: ProductListFilters = {
  search: "",
  category: "Semua",
  status: "Semua",
  sort: "Terbaru",
};

type ProductFilterBarProps = {
  filters: ProductListFilters;
  onChange: (next: ProductListFilters) => void;
};

/** ProductFilterBar — functional search + category/status/sort controls (client). */
export function ProductFilterBar({ filters, onChange }: ProductFilterBarProps) {
  const set = (patch: Partial<ProductListFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex h-11 min-w-[240px] flex-1 items-center gap-2.5 border border-border bg-surface px-4 focus-within:border-gold">
        <Search className="h-4 w-4 shrink-0 text-fg-faint" />
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Cari nama produk atau SKU…"
          className="w-full bg-transparent font-sans text-[13px] text-fg outline-none placeholder:text-fg-faint"
        />
      </label>

      <FilterSelect
        label="Kategori"
        value={filters.category}
        onChange={(v) => set({ category: v })}
        options={["Semua", ...productCategories]}
      />
      <FilterSelect
        label="Status"
        value={filters.status}
        onChange={(v) => set({ status: v })}
        options={["Semua", "Published", "Draft"]}
      />
      <FilterSelect
        label="Urutkan"
        value={filters.sort}
        onChange={(v) => set({ sort: v })}
        options={["Terbaru", "Termurah", "Termahal"]}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative flex h-11 items-center border border-border bg-surface pl-4 pr-9 font-sans text-[12.5px] font-semibold text-fg-soft">
      <span className="whitespace-nowrap">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ml-1.5 cursor-pointer appearance-none bg-transparent pr-1 font-semibold text-gold outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-surface text-fg">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold" />
    </div>
  );
}
