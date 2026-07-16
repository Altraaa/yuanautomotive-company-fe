"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types/ui/faq";
import { groupFaqs } from "@/types/ui/faq";
import { cn } from "@/lib/utils";

/**
 * FaqAccordion — public "Pertanyaan Umum" list, grouped by category. Items open
 * one panel at a time (classic FAQ behaviour); a `null` category falls into a
 * trailing "Lainnya" group. Pure client interaction over server-fetched data.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const groups = useMemo(() => groupFaqs(items), [items]);
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group, gi) => (
        <section key={group.category ?? "__ungrouped__"} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-4 w-1 -skew-x-[8deg] bg-red" />
            <h2 className="font-display text-lg font-bold uppercase italic tracking-[0.02em] text-fg md:text-xl">
              {group.category ?? "Lainnya"}
            </h2>
            <span className="font-sans text-[11px] font-semibold text-fg-faint">
              {group.items.length} pertanyaan
            </span>
          </div>

          <div className="flex flex-col divide-y divide-border border border-border bg-surface">
            {group.items.map((item, ii) => {
              const open = openId === item.id;
              const panelId = `faq-panel-${gi}-${ii}`;
              const btnId = `faq-btn-${gi}-${ii}`;
              return (
                <div key={item.id}>
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                      className={cn(
                        "flex w-full items-center gap-4 px-4 py-4 text-left transition-colors md:px-6",
                        open ? "bg-surface-raised" : "hover:bg-surface-raised/60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex-1 font-sans text-[14px] font-semibold leading-snug transition-colors md:text-[15px]",
                          open ? "text-gold" : "text-fg"
                        )}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "h-5 w-5 shrink-0 text-fg-subtle transition-transform duration-200",
                          open && "rotate-180 text-gold"
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!open}
                    className="px-4 pb-5 md:px-6"
                  >
                    <p className="whitespace-pre-line border-l-2 border-gold/50 pl-4 font-sans text-[13.5px] leading-relaxed text-fg-muted">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
