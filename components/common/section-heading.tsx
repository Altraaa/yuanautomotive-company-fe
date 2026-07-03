import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Leading (white) part of the heading. */
  title: string;
  /** Optional trailing word rendered in gold (comp pattern: "Produk Unggulan"). */
  accent?: string;
  /** Optional "see all" style link on the right. */
  actionLabel?: string;
  actionHref?: string;
  /** Free-form node rendered on the right instead of an action link. */
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  size?: "md" | "lg";
};

/**
 * SectionHeading — italic uppercase Chakra Petch heading with an optional gold
 * accent word and a right-aligned "SEMUA →" style action. Matches the comp.
 */
export function SectionHeading({
  title,
  accent,
  actionLabel,
  actionHref,
  action,
  as = "h2",
  className,
  size = "md",
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className={cn("flex items-baseline justify-between gap-4", className)}>
      <Tag
        className={cn(
          "font-display font-bold italic uppercase text-fg",
          size === "lg" ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
        )}
      >
        {title}
        {accent ? <span className="text-gold"> {accent}</span> : null}
      </Tag>

      {action}

      {!action && actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="flex-none font-display text-xs font-bold uppercase tracking-[0.1em] text-red transition-colors hover:text-red-soft md:text-sm"
        >
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}
