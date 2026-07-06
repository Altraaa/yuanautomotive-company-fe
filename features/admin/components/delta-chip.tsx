import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type DeltaChipProps = {
  value: string;
  direction: "up" | "down";
  className?: string;
};

/** DeltaChip — the "▲ 12.5%" / "▼ 3.2%" trend indicator. */
export function DeltaChip({ value, direction, className }: DeltaChipProps) {
  const Icon = direction === "up" ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-display text-[11px] font-bold",
        direction === "up" ? "text-whatsapp" : "text-red-soft",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {value}
    </span>
  );
}
