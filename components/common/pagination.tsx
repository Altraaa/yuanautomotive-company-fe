import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  basePath: string;
  /** Current query params to preserve (excluding page). */
  params?: Record<string, string | undefined>;
  page: number;
  totalPages: number;
};

function buildHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) search.set(k, v);
  });
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Pagination — link-based (server-rendered) page controls. */
export function Pagination({ basePath, params = {}, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginasi" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={buildHref(basePath, params, page - 1)}
          className="grid h-10 -skew-x-[8deg] place-items-center border border-border bg-surface px-4 font-display text-xs font-bold uppercase text-fg hover:border-gold"
        >
          <span className="skew-x-[8deg]">← Prev</span>
        </Link>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, params, p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "grid h-10 w-10 -skew-x-[8deg] place-items-center border font-display text-sm font-bold",
            p === page
              ? "border-red bg-red text-fg"
              : "border-border bg-surface text-fg-muted hover:border-gold hover:text-fg"
          )}
        >
          <span className="skew-x-[8deg]">{p}</span>
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={buildHref(basePath, params, page + 1)}
          className="grid h-10 -skew-x-[8deg] place-items-center border border-border bg-surface px-4 font-display text-xs font-bold uppercase text-fg hover:border-gold"
        >
          <span className="skew-x-[8deg]">Next →</span>
        </Link>
      ) : null}
    </nav>
  );
}
