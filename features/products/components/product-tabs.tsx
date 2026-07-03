"use client";

import { useState } from "react";
import type { ProductSpec } from "@/types/ui/product";
import { cn } from "@/lib/utils";

type ProductTabsProps = {
  specs: ProductSpec[];
  compatibility: string[];
};

const tabs = [
  { key: "spesifikasi", label: "Spesifikasi" },
  { key: "kompatibilitas", label: "Kompatibilitas" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

/** ProductTabs — Spesifikasi / Kompatibilitas switcher (client leaf). */
export function ProductTabs({ specs, compatibility }: ProductTabsProps) {
  const [active, setActive] = useState<TabKey>("spesifikasi");

  return (
    <div>
      <div className="flex gap-0 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={cn(
              "-mb-px border-b-2 px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] transition-colors",
              active === tab.key
                ? "border-red text-fg"
                : "border-transparent text-fg-subtle hover:text-fg"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {active === "spesifikasi" ? (
          <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1 bg-surface p-4">
                <dt className="font-sans text-xs uppercase tracking-[0.1em] text-fg-subtle">
                  {spec.label}
                </dt>
                <dd className="font-sans text-sm font-medium text-fg">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {compatibility.map((item) => (
              <span
                key={item}
                className="border border-gold/40 bg-surface px-3.5 py-1.5 font-sans text-sm text-fg-soft"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
