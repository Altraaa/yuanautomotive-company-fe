import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "gold" | "muted" | "red";
};

/**
 * Eyebrow — the wide-tracked uppercase label above section headings
 * (e.g. "TENTANG KAMI", "DIPERCAYA OLEH"). Chakra Petch, letter-spaced.
 */
export function Eyebrow({ children, className, tone = "gold" }: EyebrowProps) {
  const toneClass =
    tone === "gold" ? "text-gold" : tone === "red" ? "text-red" : "text-fg-subtle";
  return (
    <span
      className={cn(
        "font-display text-[11px] font-bold uppercase tracking-[0.28em]",
        toneClass,
        className
      )}
    >
      {children}
    </span>
  );
}
