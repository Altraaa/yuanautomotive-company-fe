import type { ReactNode } from "react";
import { Eyebrow } from "@/components/common/eyebrow";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  children?: ReactNode;
};

/**
 * PageHero — consistent interior-page header (Produk, Blog, Company, Contact).
 * Dark band with a skewed gold accent, italic uppercase headline, optional slot.
 */
export function PageHero({ eyebrow, title, accent, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-raised to-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 -skew-x-12 bg-gradient-to-br from-red/15 to-gold/15"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 md:px-8 md:py-16">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="font-display text-3xl font-bold italic uppercase leading-tight text-fg md:text-5xl">
          {title}
          {accent ? <span className="text-gold"> {accent}</span> : null}
        </h1>
        {description ? (
          <p className="max-w-2xl font-sans text-base leading-relaxed text-fg-muted">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
