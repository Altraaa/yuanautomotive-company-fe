import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * CtaButton — branded skewed action button from the comp.
 * The outer element is skewed -8deg; children are un-skewed +8deg so text stays upright.
 */
export const ctaButtonVariants = cva(
  "inline-grid place-items-center whitespace-nowrap -skew-x-[8deg] font-display font-bold uppercase tracking-wide transition-[transform,background-color,border-color,color] duration-200 ease-sport hover:-translate-y-0.5 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-red text-fg hover:bg-red-soft",
        gold: "bg-gradient-to-br from-gold to-gold-dark text-bg hover:from-gold-soft hover:to-gold",
        outline:
          "border border-gold/45 bg-surface text-gold hover:border-gold hover:bg-surface-raised",
        ghost: "bg-transparent text-fg hover:bg-surface",
        whatsapp: "bg-whatsapp text-fg hover:brightness-110",
      },
      size: {
        sm: "h-10 px-5 text-xs",
        default: "h-12 px-7 text-sm",
        lg: "h-[52px] px-9 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type Variants = VariantProps<typeof ctaButtonVariants>;

type CtaButtonAsLink = Variants & {
  href: LinkProps["href"];
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type CtaButtonAsButton = Variants & {
  href?: undefined;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type CtaButtonProps = CtaButtonAsLink | CtaButtonAsButton;

export function CtaButton({ className, variant, size, children, ...rest }: CtaButtonProps) {
  const classes = cn(ctaButtonVariants({ variant, size }), className);
  const inner = <span className="inline-flex skew-x-[8deg] items-center gap-2">{children}</span>;

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkProps } = rest as CtaButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as CtaButtonAsButton)}>
      {inner}
    </button>
  );
}
