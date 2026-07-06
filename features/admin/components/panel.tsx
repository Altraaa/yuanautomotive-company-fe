import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelProps = {
  /** Italic uppercase Chakra title shown in the header row. */
  title?: string;
  /** Muted line under the title. */
  subtitle?: string;
  /** Right-aligned header slot (link, value, delta…). */
  action?: ReactNode;
  /** Remove the default body padding (e.g. for flush tables). */
  flush?: boolean;
  className?: string;
  children: ReactNode;
};

/** Panel — the standard admin surface card with an optional header row. */
export function Panel({ title, subtitle, action, flush, className, children }: PanelProps) {
  const hasHeader = title || action;
  return (
    <section className={cn("border border-border bg-surface", className)}>
      {hasHeader && (
        <div
          className={cn(
            "flex items-baseline justify-between gap-3",
            flush ? "border-b border-border px-5 py-4" : "px-5 pb-4 pt-5 md:px-[22px]"
          )}
        >
          <div className="min-w-0">
            {title && (
              <h3 className="truncate font-display text-sm font-bold uppercase italic text-fg md:text-[15px]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 font-sans text-[11.5px] text-fg-subtle">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={cn(!flush && "px-5 pb-5 md:px-[22px]", !flush && !hasHeader && "pt-5")}>
        {children}
      </div>
    </section>
  );
}
