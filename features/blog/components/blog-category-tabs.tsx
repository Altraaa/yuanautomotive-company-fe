import Link from "next/link";
import { blogCategories } from "@/features/blog/data";
import { cn } from "@/lib/utils";

type BlogCategoryTabsProps = {
  active?: string;
};

const tabs = [{ key: undefined as string | undefined, label: "Semua" }].concat(
  blogCategories.map((c) => ({ key: c.toLowerCase() as string | undefined, label: c }))
);

/** BlogCategoryTabs — skewed category pills (server-rendered links, active highlighted). */
export function BlogCategoryTabs({ active }: BlogCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {tabs.map((tab) => {
        const selected = active === tab.key;
        const href = tab.key ? `/blog?kategori=${tab.key}` : "/blog";
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
