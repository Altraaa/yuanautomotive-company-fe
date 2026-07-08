import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — shadcn base primitive, restyled to the Red × Gold theme.
 * `asChild` renders the styles onto a child (e.g. a Next <Link>) via Radix Slot.
 * The skewed brand hero button lives in `components/common/cta-button.tsx`; this
 * is the neutral primitive for admin/utility buttons.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display text-sm font-bold uppercase tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-red text-fg hover:bg-red-soft",
        gold: "bg-gold text-bg hover:bg-gold-soft",
        outline: "border border-border bg-surface-sunken text-fg-soft hover:border-gold hover:text-fg",
        ghost: "bg-transparent text-fg-soft hover:bg-surface hover:text-fg",
        whatsapp: "bg-whatsapp text-fg hover:brightness-110",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-[52px] px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";
