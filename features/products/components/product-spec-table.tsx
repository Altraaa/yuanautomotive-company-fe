import type { ProductSpec } from "@/types/ui/product";

/**
 * ProductSpecTable — the technical spec sheet. Server component (no interaction
 * now that compatibility has its own prominent section), so it ships no client
 * JS. Renders nothing when there are no specs.
 */
export function ProductSpecTable({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;

  return (
    <div>
      <h2 className="border-b-2 border-red pb-2.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-fg">
        Spesifikasi
      </h2>
      <dl className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
        {specs.map((spec) => (
          <div key={spec.label} className="flex flex-col gap-1 bg-surface p-4">
            <dt className="font-sans text-xs uppercase tracking-[0.1em] text-fg-subtle">
              {spec.label}
            </dt>
            <dd className="font-sans text-sm font-medium text-fg">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
