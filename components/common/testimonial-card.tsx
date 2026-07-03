type TestimonialCardProps = {
  quote: string;
  authorName: string;
  authorLocation: string;
  authorInitials: string;
};

/** TestimonialCard — quote block with gold quotation mark + skewed initials avatar. */
export function TestimonialCard({
  quote,
  authorName,
  authorLocation,
  authorInitials,
}: TestimonialCardProps) {
  return (
    <figure className="relative border border-gold/35 bg-surface p-6 md:p-7">
      <span
        aria-hidden
        className="absolute -top-4 left-5 font-display text-5xl font-bold leading-none text-gold"
      >
        &ldquo;
      </span>
      <blockquote className="mt-3 font-sans text-base leading-relaxed text-fg-soft">
        {quote}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className="grid h-9 w-9 -skew-x-[8deg] place-items-center bg-red font-display text-sm font-bold text-fg">
          <span className="skew-x-[8deg]">{authorInitials}</span>
        </span>
        <span className="flex flex-col">
          <span className="font-sans text-sm font-semibold text-fg">{authorName}</span>
          <span className="font-sans text-xs text-fg-subtle">{authorLocation}</span>
        </span>
      </figcaption>
    </figure>
  );
}
