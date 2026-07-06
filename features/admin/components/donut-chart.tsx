import type { DonutSlice, Tone } from "@/types/ui/admin";

const strokeClass: Record<Tone, string> = {
  red: "stroke-red",
  gold: "stroke-gold",
  green: "stroke-whatsapp",
  grey: "stroke-fg-subtle",
  muted: "stroke-fg-muted",
};

const dotClass: Record<Tone, string> = {
  red: "bg-red",
  gold: "bg-gold",
  green: "bg-whatsapp",
  grey: "bg-fg-subtle",
  muted: "bg-fg-muted",
};

type DonutChartProps = {
  slices: DonutSlice[];
  /** Big number in the hole. */
  total: number;
  /** Small caps unit under the total, e.g. "SKU" / "ORDER". */
  unit: string;
};

/** DonutChart — token-driven SVG ring (stroke-dasharray) with a legend. */
export function DonutChart({ slices, total, unit }: DonutChartProps) {
  const sum = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  let cumulative = 0;

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[118px] w-[118px] shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          {slices.map((slice) => {
            const pct = (slice.value / sum) * 100;
            const dash = `${pct} ${100 - pct}`;
            const offset = -cumulative;
            cumulative += pct;
            return (
              <circle
                key={slice.label}
                cx={18}
                cy={18}
                r={15.9155}
                fill="none"
                pathLength={100}
                strokeWidth={4}
                strokeDasharray={dash}
                strokeDashoffset={offset}
                className={strokeClass[slice.tone]}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-[22px] font-bold leading-none text-fg">{total}</div>
            <div className="font-sans text-[8px] font-semibold tracking-[0.1em] text-fg-subtle">
              {unit}
            </div>
          </div>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 ${dotClass[slice.tone]}`} />
            <span className="flex-1 font-sans text-[11.5px] text-fg-soft">{slice.label}</span>
            <span className="font-display text-xs font-bold text-fg">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
