import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

type BreadcrumbProps = {
  items: Crumb[];
};

/** Breadcrumb — compact trail for detail pages. */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 font-sans text-xs text-fg-subtle">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-fg-muted" : undefined}>{item.label}</span>
              )}
              {!last ? <ChevronRight className="h-3.5 w-3.5 text-fg-faint" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
