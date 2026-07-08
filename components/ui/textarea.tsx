import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Textarea — shadcn base primitive, restyled to the Red × Gold theme.
 * forwardRef so react-hook-form `{...register()}` wires the ref/value/onChange.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full resize-y border border-border bg-surface-sunken px-4 py-3 font-sans text-sm leading-relaxed text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-gold disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
