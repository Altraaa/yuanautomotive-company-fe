import { StatCard } from "@/components/common/stat-card";
import { whyUsStats } from "@/features/home/data";

export function WhyUsSection() {
  return (
    <section className="border-y border-border bg-surface-sunken">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[280px_1fr] md:items-start md:px-8">
        <h2 className="font-display text-2xl font-bold italic uppercase leading-tight text-fg">
          Kenapa <span className="text-red">Kami</span>
        </h2>
        <div className="grid gap-3.5 sm:grid-cols-3">
          {whyUsStats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={stat.accent}
              valueTone={stat.valueTone}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
