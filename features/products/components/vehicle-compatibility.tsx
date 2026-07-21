import { CarFront, Check } from "lucide-react";
import type { VehicleFitment } from "@/types/ui/product";
import { FitmentCard } from "@/components/common/fitment-card";

/**
 * VehicleCompatibility — the "does this fit my car?" answer, made unmissable.
 * A gold-accented callout at the top of the product info column: a headline
 * count ("Cocok untuk N kendaraan") plus a scannable grid of vehicle tiles, so
 * the user knows compatibility before they even reach the CTA. Server component
 * (no interactivity) → zero client JS. Renders nothing when the list is empty.
 */
export function VehicleCompatibility({ fitments }: { fitments: VehicleFitment[] }) {
  if (fitments.length === 0) return null;

  return (
    <section
      aria-labelledby="kompatibilitas-heading"
      className="border border-gold/25 bg-surface-sunken/60 p-4 md:p-5"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 flex-none place-items-center bg-gold/10 text-gold">
          <CarFront className="h-[18px] w-[18px]" />
        </span>
        <div className="flex flex-col">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            Kompatibilitas
          </span>
          <h2
            id="kompatibilitas-heading"
            className="font-display text-sm font-bold uppercase italic text-fg"
          >
            Cocok untuk {fitments.length} kendaraan
          </h2>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {fitments.map((f) => (
          <li key={`${f.brand}-${f.model}-${f.years ?? ""}`}>
            <FitmentCard fitment={f} />
          </li>
        ))}
      </ul>

      <p className="mt-3.5 flex items-center gap-1.5 font-sans text-[11.5px] leading-relaxed text-fg-subtle">
        <Check className="h-3.5 w-3.5 flex-none text-gold" />
        Mobil Anda tidak tercantum? Hubungi kami untuk cek kecocokan.
      </p>
    </section>
  );
}
