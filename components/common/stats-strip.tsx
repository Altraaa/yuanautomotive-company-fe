import { cn } from "@/lib/utils";

type Stat = {
  value: string;
  label: string;
};

type StatsStripProps = {
  stats: Stat[];
  className?: string;
};

/** StatsStrip — centered big-number trust indicators (Company / Home). */
export function StatsStrip({ stats, className }: StatsStripProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-6 md:grid-cols-4",
        stats.length === 3 && "md:grid-cols-3",
        className
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center border-t-[3px] border-t-gold bg-surface px-4 py-6 text-center"
        >
          <span className="font-display text-3xl font-bold text-fg md:text-4xl">{stat.value}</span>
          <span className="mt-2 font-sans text-xs uppercase tracking-[0.1em] text-fg-muted">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
