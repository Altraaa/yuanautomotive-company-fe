"use client";

import { useEffect } from "react";
import { TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
 * ConfirmDialog — branded modal replacing native window.confirm for destructive
 * admin actions (delete, bulk delete, cancel order). Escape / backdrop cancels.
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-surface-black/70"
        onClick={() => !pending && onCancel()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-[400px] animate-fade-in border border-border border-t-[3px] border-t-red bg-surface p-6"
      >
        <button
          type="button"
          onClick={() => !pending && onCancel()}
          aria-label="Tutup"
          className="absolute right-4 top-4 text-fg-faint transition-colors hover:text-fg"
        >
          <X className="h-4 w-4" />
        </button>

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
            <h2 className="font-display text-base font-bold uppercase italic text-fg">
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed text-fg-subtle">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="border border-border bg-surface-sunken px-4 py-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.06em] text-fg-soft transition-colors hover:text-fg disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              "px-4 py-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.06em] text-fg transition-colors disabled:opacity-50",
              tone === "danger" ? "bg-red hover:bg-red-soft" : "bg-gold text-bg hover:bg-gold-soft"
            )}
          >
            {pending ? "Memproses…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
