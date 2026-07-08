import { cva } from "class-variance-authority";
import type { ActivityStatus } from "@/types/ui/admin";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-block font-display text-[10px] font-semibold uppercase leading-none tracking-[0.06em] px-[9px] py-[3px]",
  {
    variants: {
      status: {
        NEW: "bg-gold/15 text-gold",
        CONTACTED: "bg-surface-raised text-fg",
        CLOSED: "bg-whatsapp/15 text-whatsapp",
        PROCESSED: "bg-border text-fg-muted",
        DONE: "bg-whatsapp/15 text-whatsapp",
        CANCELLED: "bg-red/15 text-red-soft",
      } satisfies Record<ActivityStatus, string>,
    },
    defaultVariants: { status: "NEW" },
  }
);

export function StatusPill({ status, className }: { status: ActivityStatus; className?: string }) {
  return <span className={cn(pillVariants({ status }), className)}>{status}</span>;
}
