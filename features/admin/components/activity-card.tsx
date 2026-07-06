import Link from "next/link";
import type { ActivityItem } from "@/types/ui/admin";
import { cn } from "@/lib/utils";
import { Panel } from "./panel";
import { StatusPill } from "./status-pill";

type ActivityCardProps = {
  title: string;
  /** "SEMUA →" target. */
  href: string;
  items: ActivityItem[];
  /** Avatar accent — gold for leads, red for orders. */
  tone?: "gold" | "red";
};

/** ActivityCard — "Leads Terbaru" / "Pre-Order Terbaru" list panel. */
export function ActivityCard({ title, href, items, tone = "gold" }: ActivityCardProps) {
  return (
    <Panel
      title={title}
      flush
      action={
        <Link
          href={href}
          className="flex-none font-display text-[11px] font-bold uppercase tracking-[0.08em] text-red transition-colors hover:text-red-soft"
        >
          Semua →
        </Link>
      }
    >
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li
            key={item.title}
            className={cn(
              "flex items-center gap-3 px-5 py-3",
              i < items.length - 1 && "border-b border-border/70"
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center border border-border bg-surface-sunken font-display text-xs font-bold",
                tone === "gold" ? "text-gold" : "text-red"
              )}
            >
              {item.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-sans text-[13px] font-semibold text-fg">
                {item.title}
              </div>
              <div className="truncate font-sans text-[11px] text-fg-subtle">{item.subtitle}</div>
            </div>
            <StatusPill status={item.status} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
