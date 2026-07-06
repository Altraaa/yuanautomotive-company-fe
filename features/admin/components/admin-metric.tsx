import { cn } from "@/lib/utils";

type AdminMetricProps = {
  label: string;
  value: string;
  /** Small trailing unit rendered muted after the value (e.g. "unit"). */
  suffix?: string;
  accent: "gold" | "red";
  valueTone?: "gold" | "fg";
  className?: string;
};

/** AdminMetric — compact top-accented figure card (retail/wholesale price, stock). */
export function AdminMetric({ label, value, suffix, accent, valueTone = "fg", className }: AdminMetricProps) {
  return (
    <div
      className={cn(
        "border border-border border-t-[3px] bg-surface px-4 py-3.5",
        accent === "gold" ? "border-t-gold" : "border-t-red",
        className
      )}
    >
      <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-display text-[22px] font-bold",
          valueTone === "gold" ? "text-gold" : "text-fg"
        )}
      >
        {value}
        {suffix && <span className="ml-1 font-sans text-[11px] font-medium text-fg-subtle">{suffix}</span>}
      </div>
    </div>
  );
}
