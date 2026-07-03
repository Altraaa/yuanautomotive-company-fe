import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — the small solid product/status label from the comp
 * (e.g. "BARU", "HOT"). Optionally skewed to match the racing aesthetic.
 */
const badgeVariants = cva(
  "inline-block font-display text-[9.5px] font-bold uppercase leading-none tracking-[0.1em]",
  {
    variants: {
      intent: {
        red: "bg-red text-fg",
        gold: "bg-gold text-bg",
        dark: "bg-surface-black/70 text-fg",
      },
      skew: {
        true: "-skew-x-[8deg]",
        false: "",
      },
    },
    defaultVariants: { intent: "red", skew: false },
  }
);

type BadgeProps = VariantProps<typeof badgeVariants> & {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, intent, skew, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ intent, skew }), "px-[9px] py-[4px]", className)}>
      <span className={skew ? "inline-block skew-x-[8deg]" : undefined}>{children}</span>
    </span>
  );
}
