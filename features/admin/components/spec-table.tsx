import type { ProductSpec } from "@/types/ui/product";
import { SectionCard } from "./section-card";

/** SpecTable — read-only technical spec key/value rows for the product detail screen. */
export function SpecTable({ specs }: { specs: ProductSpec[] }) {
  return (
    <SectionCard title="Spesifikasi" accentWord="Teknis" accentTone="gold" bodyClassName="p-0 md:px-0">
      <dl className="flex flex-col">
        {specs.map((spec, i) => (
          <div
            key={spec.label + i}
            className="grid grid-cols-[130px_1fr] border-b border-border/70 last:border-b-0 sm:grid-cols-[170px_1fr]"
          >
            <dt className="px-5 py-2.5 font-sans text-xs font-semibold text-fg-muted md:px-[22px]">
              {spec.label}
            </dt>
            <dd className="px-4 py-2.5 font-sans text-[12.5px] text-fg-soft">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}
