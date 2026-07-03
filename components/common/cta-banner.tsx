import { CtaButton } from "@/components/common/cta-button";

type CtaBannerProps = {
  title: string;
  accent?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
};

/**
 * CtaBanner — full-bleed red pattern-interrupt with an italic headline and a
 * single skewed action. Used once per page maximum.
 */
export function CtaBanner({
  title,
  accent,
  description,
  ctaLabel,
  ctaHref,
  external = false,
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-red">
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-64 w-64 -skew-x-12 bg-gradient-to-br from-gold/25 to-transparent"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center md:px-8 md:py-16">
        <h2 className="font-display text-2xl font-bold italic uppercase text-fg md:text-4xl">
          {title}
          {accent ? <span className="text-gold"> {accent}</span> : null}
        </h2>
        {description ? (
          <p className="max-w-2xl font-sans text-base leading-relaxed text-fg/90">{description}</p>
        ) : null}
        <CtaButton
          href={ctaHref}
          variant="gold"
          size="lg"
          {...(external ? { target: "_blank", rel: "noopener" } : {})}
        >
          {ctaLabel}
        </CtaButton>
      </div>
    </section>
  );
}
