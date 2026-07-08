"use client";

import { cn } from "@/lib/utils";

export type StatusTab = { value: string; label: string; count?: number };

/**
 * StatusTabs — horizontal filter pills with optional counts, shared by the order
 * and contact inboxes. Scrolls horizontally on mobile.
 */
export function StatusTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: StatusTab[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5">
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border px-3.5 py-2 font-display text-[11.5px] font-bold uppercase tracking-[0.05em] transition-colors",
              isActive
                ? "border-red bg-red text-fg"
                : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg"
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  "font-display text-[10px] leading-none",
                  isActive ? "text-fg/80" : "text-fg-subtle"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
