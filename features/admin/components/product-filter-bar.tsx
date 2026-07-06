import { ChevronDown, Search } from "lucide-react";

const dropdowns = [
  { label: "Kategori", value: "Semua" },
  { label: "Status", value: "Semua" },
  { label: "Urutkan", value: "Terbaru" },
];

/** ProductFilterBar — search + filter dropdowns above the manage table (presentational). */
export function ProductFilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex h-11 min-w-[240px] flex-1 items-center gap-2.5 border border-border bg-surface px-4">
        <Search className="h-4 w-4 shrink-0 text-fg-faint" />
        <span className="font-sans text-[13px] text-fg-faint">Cari nama produk atau SKU…</span>
      </div>
      {dropdowns.map((d) => (
        <button
          key={d.label}
          type="button"
          className="flex h-11 items-center gap-1.5 border border-border bg-surface px-4 font-sans text-[12.5px] font-semibold text-fg-soft"
        >
          {d.label}: <span className="text-gold">{d.value}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gold" />
        </button>
      ))}
    </div>
  );
}
