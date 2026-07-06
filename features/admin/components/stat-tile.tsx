import { cva } from "class-variance-authority";
import type { DashboardStat, Tone } from "@/types/ui/admin";
import { cn } from "@/lib/utils";
import { DeltaChip } from "./delta-chip";

const tileVariants = cva("p-5", {
  variants: {
    accent: {
      red: "border border-border border-t-[3px] border-t-red bg-surface",
      gold: "border border-border border-t-[3px] border-t-gold bg-surface",
      gradient: "border border-border border-t-[3px] border-t-red bg-gradient-to-br from-red/15 to-gold/15",
    },
  },
  defaultVariants: { accent: "red" },
});

const hintToneClass: Record<Tone, string> = {
  green: "text-whatsapp",
  gold: "text-gold",
  red: "text-red-soft",
  grey: "text-fg-soft",
  muted: "text-fg-muted",
};

/** StatTile — dashboard KPI card: label + optional delta, big value, supporting line. */
export function StatTile({ stat }: { stat: DashboardStat }) {
  return (
    <div className={cn(tileVariants({ accent: stat.accent }))}>
      <div className="flex items-center justify-between">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-subtle">
          {stat.label}
        </span>
        {stat.delta && stat.deltaDirection && (
          <DeltaChip value={stat.delta} direction={stat.deltaDirection} />
        )}
      </div>
      <div className="mb-0.5 mt-2 font-display text-[34px] font-bold leading-none text-fg">
        {stat.value}
      </div>
      <div className="font-sans text-xs text-fg-muted">
        {stat.hintHighlight && (
          <b className={cn("font-semibold", hintToneClass[stat.hintTone ?? "gold"])}>
            {stat.hintHighlight}{" "}
          </b>
        )}
        {stat.hint}
      </div>
    </div>
  );
}
