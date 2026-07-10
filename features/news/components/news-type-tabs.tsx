import Link from "next/link";
import { newsTypes } from "@/features/news/data";
import { cn } from "@/lib/utils";

type NewsTypeTabsProps = {
  active?: string;
};

const tabs = [{ key: undefined as string | undefined, label: "Semua" }].concat(
  newsTypes.map((t) => ({ key: t.toLowerCase() as string | undefined, label: t }))
);

/** NewsTypeTabs — skewed type pills (server-rendered links, active highlighted). */
export function NewsTypeTabs({ active }: NewsTypeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {tabs.map((tab) => {
        const selected = active === tab.key;
        const href = tab.key ? `/news?tipe=${tab.key}` : "/news";
        return (
          <Link
            key={tab.label}
            href={href}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "grid h-9 -skew-x-[8deg] place-items-center px-4 font-display text-xs font-bold uppercase tracking-[0.06em] transition-colors",
              selected
                ? "bg-red text-fg"
                : "border border-gold/45 bg-surface text-gold hover:border-gold"
            )}
          >
            <span className="skew-x-[8deg]">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
