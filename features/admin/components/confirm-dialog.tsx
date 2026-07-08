"use client";

import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" = red destructive button; "default" = gold. */
  tone?: "danger" | "default";
  /** Disables the buttons + shows the pending label while the action runs. */
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * ConfirmDialog — branded confirmation modal for destructive admin actions,
 * composed from the shadcn/Radix Dialog primitive (focus trap, Escape/backdrop
 * close, smooth fade+scale). Same props as before, so callers are unchanged.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  tone = "danger",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !pending) onCancel();
      }}
    >
      <DialogContent
        showClose={!pending}
        className={cn(tone === "default" && "border-t-gold")}
        onEscapeKeyDown={(e) => pending && e.preventDefault()}
        onInteractOutside={(e) => pending && e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center",
                tone === "danger" ? "bg-red/15 text-red-soft" : "bg-gold/15 text-gold"
              )}
            >
              <TriangleAlert className="h-5 w-5" />
            </span>
            <div className="min-w-0 pt-0.5">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1.5">{description}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "default" : "gold"}
            size="sm"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? "Memproses…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
