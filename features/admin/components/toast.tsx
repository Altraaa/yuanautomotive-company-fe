"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin toast system — lightweight, dependency-free feedback for save / upload /
 * delete actions across every admin module. Follows the existing inline-banner
 * palette (whatsapp = success, red = error, gold = info) so it reads on-brand.
 *
 * Usage:
 *   const { toast } = useToast();
 *   toast.success("Kategori ditambahkan.");
 *   toast.error(res.message);
 */

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  variant: ToastVariant;
  message: string;
};

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/**
 * useToast — access the toast API. Returns a no-op fallback outside a provider so
 * components never crash if rendered in isolation (e.g. tests, storybook).
 */
export function useToast(): { toast: ToastApi } {
  const ctx = useContext(ToastContext);
  return { toast: ctx ?? noopToast };
}

const noopToast: ToastApi = {
  success: () => {},
  error: () => {},
  info: () => {},
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = ++counter;
      setItems((prev) => [...prev, { id, variant, message }]);
      // Errors linger a little longer so they can be read.
      const ttl = variant === "error" ? 6000 : 3500;
      setTimeout(() => dismiss(id), ttl);
    },
    [dismiss]
  );

  const api: ToastApi = {
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

const variantStyle: Record<ToastVariant, string> = {
  success: "border-whatsapp/50 bg-whatsapp/12 text-whatsapp",
  error: "border-red/50 bg-red/12 text-red-soft",
  info: "border-gold/50 bg-gold/12 text-gold",
};

const variantIcon: Record<ToastVariant, typeof Check> = {
  success: Check,
  error: TriangleAlert,
  info: Info,
};

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-[360px] flex-col gap-2.5">
      {items.map((t) => {
        const Icon = variantIcon[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={cn(
              "pointer-events-auto flex animate-fade-in items-start gap-3 border border-l-[3px] bg-surface px-4 py-3 shadow-lg backdrop-blur-sm",
              variantStyle[t.variant]
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
            <p className="min-w-0 flex-1 font-sans text-[12.5px] leading-relaxed text-fg-soft">
              {t.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Tutup notifikasi"
              className="shrink-0 text-fg-faint transition-colors hover:text-fg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
