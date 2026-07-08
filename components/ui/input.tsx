import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Input — shadcn base primitive, restyled to the Red × Gold theme.
 * forwardRef so react-hook-form `{...register()}` wires the ref/value/onChange.
 */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full border border-border bg-surface-sunken px-4 py-2 font-sans text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-gold disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
