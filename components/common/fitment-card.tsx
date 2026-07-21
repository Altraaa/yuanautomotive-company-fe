import type { VehicleFitment } from "@/types/ui/product";

/**
 * FitmentCard — a single compatible-vehicle tile (brand · model · years).
 * Presentational, props-driven, reusable across product detail + related views.
 * Left gold accent + uppercase brand so a scanning user instantly recognises
 * whether their car is on the list.
 */
export function FitmentCard({ fitment }: { fitment: VehicleFitment }) {
  return (
    <div className="flex flex-col justify-center gap-0.5 border border-border border-l-[3px] border-l-gold bg-surface px-3.5 py-3">
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
        {fitment.brand}
      </span>
      {fitment.model ? (
        <span className="font-sans text-[13.5px] font-semibold leading-tight text-fg">
          {fitment.model}
        </span>
      ) : null}
      {fitment.years ? (
        <span className="font-sans text-[11px] text-fg-subtle">{fitment.years}</span>
      ) : null}
    </div>
  );
}
