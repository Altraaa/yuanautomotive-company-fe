"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toaster — shadcn's Sonner toast, fully re-skinned to the Red × Gold theme via
 * Tailwind tokens (unstyled + classNames, so no raw hex / no globals.css). Smooth
 * stacked slide-in/out. Mount once per layout; call `toast` from "sonner".
 *   import { toast } from "sonner";
 *   toast.success("Tersimpan.");
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      offset={16}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "pointer-events-auto flex w-full items-center gap-3 border border-l-[3px] border-border bg-surface px-4 py-3 shadow-lg shadow-black/40 backdrop-blur-sm",
          title: "font-sans text-[12.5px] font-semibold text-fg-soft",
          description: "font-sans text-[11.5px] leading-relaxed text-fg-subtle",
          icon: "flex shrink-0 items-center [&>svg]:h-[18px] [&>svg]:w-[18px]",
          closeButton: "border border-border bg-surface-sunken text-fg-faint hover:text-fg",
          actionButton:
            "bg-red px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-fg",
          cancelButton:
            "bg-surface-sunken px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-fg-muted",
          success: "border-l-whatsapp [&_[data-icon]]:text-whatsapp",
          error: "border-l-red [&_[data-icon]]:text-red-soft",
          info: "border-l-gold [&_[data-icon]]:text-gold",
          warning: "border-l-gold [&_[data-icon]]:text-gold",
        },
      }}
      {...props}
    />
  );
}
