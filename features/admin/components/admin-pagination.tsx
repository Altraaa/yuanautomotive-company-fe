import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  /** Total number of items (across all pages) for the range summary. */
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const cellBase =
  "grid h-[34px] w-[34px] place-items-center border border-border bg-surface-sunken font-display text-xs font-semibold transition-colors";

/** AdminPagination — table footer with range summary + skewed page buttons (client-driven). */
export function AdminPagination({ page, totalPages, total, pageSize, onPageChange }: AdminPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:px-[18px]">
      <span className="font-sans text-xs text-fg-subtle">
        Menampilkan <b className="text-fg">{from}–{to}</b> dari <b className="text-fg">{total}</b> produk
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Sebelumnya"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(cellBase, "text-fg-faint disabled:opacity-40", page > 1 && "hover:border-border-strong")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
          n === page ? (
            <span
              key={n}
              aria-current="page"
              className="grid h-[34px] w-[34px] -skew-x-[8deg] place-items-center bg-red font-display text-xs font-bold text-fg"
            >
              <span className="skew-x-[8deg]">{n}</span>
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={cn(cellBase, "text-fg-soft hover:border-border-strong")}
            >
              {n}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Berikutnya"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(cellBase, "text-gold disabled:opacity-40", page < totalPages && "hover:border-border-strong")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
