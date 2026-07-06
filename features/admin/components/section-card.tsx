import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Accent = "gold" | "red";

type SectionCardProps = {
  title: string;
  /** Trailing word rendered in the accent colour (comp pattern: "Spesifikasi <Teknis>"). */
  accentWord?: string;
  accentTone?: Accent;
  /** 3px top border accent on the card. */
  topAccent?: Accent;
  /** Right-aligned header slot. */
  action?: ReactNode;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
};

/** SectionCard — bordered admin card with an accented header; used by product detail + edit sections. */
export function SectionCard({
  title,
  accentWord,
  accentTone = "gold",
  topAccent,
  action,
  bodyClassName,
  className,
  children,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "border border-border bg-surface",
        topAccent === "gold" && "border-t-[3px] border-t-gold",
        topAccent === "red" && "border-t-[3px] border-t-red",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5 md:px-[22px]">
        <h3 className="font-display text-sm font-bold uppercase italic text-fg md:text-[15px]">
          {title}
          {accentWord && (
            <span className={accentTone === "gold" ? "text-gold" : "text-red"}> {accentWord}</span>
          )}
        </h3>
        {action}
      </div>
      <div className={cn("p-5 md:px-[22px]", bodyClassName)}>{children}</div>
    </section>
  );
}
