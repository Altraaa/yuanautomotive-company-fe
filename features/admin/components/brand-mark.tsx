import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * BrandMark — the "YD" skewed red→gold split badge + Chakra Petch wordmark used
 * across the admin panel (login brand panel, sidebar header). Reusable, props-driven.
 */
const markVariants = cva(
  "grid shrink-0 -skew-x-[8deg] place-items-center bg-gradient-to-br from-red from-[55%] to-gold to-[55%] font-display font-bold text-fg",
  {
    variants: {
      size: {
        sm: "h-[34px] w-[34px] text-sm",
        md: "h-[38px] w-[38px] text-base",
        lg: "h-11 w-11 text-lg",
      },
    },
    defaultVariants: { size: "md" },
  }
);

type BrandMarkProps = VariantProps<typeof markVariants> & {
  /** Small caps line under the wordmark, e.g. "AUTOMOTIVE" or "ADMIN PANEL". */
  subtitle: string;
  /** Render only the badge (no wordmark). */
  markOnly?: boolean;
  className?: string;
};

export function BrandMark({ size, subtitle, markOnly, className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className={markVariants({ size })}>
        <span className="skew-x-[8deg]">YD</span>
      </span>
      {!markOnly && (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-bold italic tracking-[0.05em] text-fg">
            YUAN DEWATA
          </span>
          <span className="font-sans text-[9px] font-semibold tracking-[0.3em] text-gold">
            {subtitle}
          </span>
        </span>
      )}
    </div>
  );
}
