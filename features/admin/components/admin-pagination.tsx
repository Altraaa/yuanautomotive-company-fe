import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminPaginationProps = {
  rangeLabel: string;
  totalLabel: string;
  pages: number;
  current: number;
};

const cellBase =
  "grid h-[34px] w-[34px] place-items-center border border-border bg-surface-sunken font-display text-xs font-semibold";

/** AdminPagination — table footer with range summary + skewed page buttons. */
export function AdminPagination({ rangeLabel, totalLabel, pages, current }: AdminPaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:px-[18px]">
      <span className="font-sans text-xs text-fg-subtle">
        Menampilkan <b className="text-fg">{rangeLabel}</b> dari <b className="text-fg">{totalLabel}</b>{" "}
        produk
      </span>
      <div className="flex items-center gap-1.5">
        <button type="button" aria-label="Sebelumnya" className={cn(cellBase, "text-fg-faint")}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
          n === current ? (
            <span
              key={n}
              aria-current="page"
              className="grid h-[34px] w-[34px] -skew-x-[8deg] place-items-center bg-red font-display text-xs font-bold text-fg"
            >
              <span className="skew-x-[8deg]">{n}</span>
            </span>
          ) : (
            <button key={n} type="button" className={cn(cellBase, "text-fg-soft")}>
              {n}
            </button>
          )
        )}
        <button type="button" aria-label="Berikutnya" className={cn(cellBase, "text-gold")}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
