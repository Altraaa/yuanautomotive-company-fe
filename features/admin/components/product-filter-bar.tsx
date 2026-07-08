"use client";

import { Search } from "lucide-react";
import { productCategories } from "@/features/products/data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Cari nama produk atau SKU…"
          className="h-auto flex-1 border-0 bg-transparent px-0 py-0 text-[13px] placeholder:text-fg-faint focus:border-transparent"
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
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className="h-11 w-auto gap-1.5 bg-surface font-sans text-[12.5px] font-semibold text-gold"
      >
        <span className="text-fg-soft">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
