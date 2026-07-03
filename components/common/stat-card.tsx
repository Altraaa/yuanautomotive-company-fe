import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statCardVariants = cva("p-5 md:p-[22px]", {
  variants: {
    accent: {
      red: "bg-surface border-t-[3px] border-t-red",
      gold: "bg-surface border-t-[3px] border-t-gold",
      gradient: "border border-border bg-gradient-to-br from-red/15 to-gold/15",
    },
  },
  defaultVariants: { accent: "red" },
});

type StatCardProps = VariantProps<typeof statCardVariants> & {
  value: string;
  label: string;
  valueTone?: "fg" | "gold";
  className?: string;
};

/** StatCard — "Kenapa Kami" style: big Chakra number + muted supporting line. */
export function StatCard({ value, label, accent, valueTone = "fg", className }: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ accent }), className)}>
      <div
        className={cn(
          "font-display text-3xl font-bold",
          valueTone === "gold" ? "text-gold" : "text-fg"
        )}
      >
        {value}
      </div>
      <div className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-fg-muted">{label}</div>
    </div>
  );
}
