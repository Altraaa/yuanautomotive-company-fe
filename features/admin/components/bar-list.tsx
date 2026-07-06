import type { BarItem } from "@/types/ui/admin";

/** BarList — horizontal ranked bars (red→gold), e.g. "Produk Terlaris". */
export function BarList({ items }: { items: BarItem[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate font-sans text-xs text-fg-soft">{item.label}</span>
            <span className="font-display text-xs font-bold text-gold">{item.value}</span>
          </div>
          <div className="h-[7px] overflow-hidden bg-surface-sunken">
            <div
              className="h-full bg-gradient-to-r from-red to-gold"
              style={{ width: `${item.width}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
