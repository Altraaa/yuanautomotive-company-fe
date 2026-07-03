"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { preorderSchema, type PreorderFormValues } from "@/features/preorder/schema";
import { submitPreorder } from "@/features/preorder/services/submit-order";
import { useCart } from "@/features/preorder/store/cart-context";
import type { CartItem } from "@/types/ui/cart";
import { formatIDR } from "@/lib/utils";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border border-border bg-surface-sunken px-4 py-3 font-sans text-sm text-fg placeholder:text-fg-subtle outline-none transition-colors focus:border-gold";

/** Build an itemized WhatsApp order message as a fallback / confirmation channel. */
function buildOrderMessage(
  items: CartItem[],
  values: PreorderFormValues,
  subtotal: number
): string {
  const lines = items.map(
    (i) => `• ${i.name} × ${i.qty} — ${formatIDR(i.price * i.qty)}`
  );
  const parts = [
    `Halo ${site.name}, saya ingin melakukan PRE-ORDER:`,
    "",
    ...lines,
    "",
    `Total: ${formatIDR(subtotal)}`,
    "",
    `Nama: ${values.name}`,
    `No. WhatsApp: ${values.phone}`,
  ];
  if (values.vehicleModel) parts.push(`Kendaraan: ${values.vehicleModel}`);
  if (values.note) parts.push(`Catatan: ${values.note}`);
  return parts.join("\n");
}

export function PreorderForm({ onBack }: { onBack: () => void }) {
  const { items, subtotal, clear } = useCart();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PreorderFormValues>({
    resolver: zodResolver(preorderSchema),
  });

  async function onSubmit(values: PreorderFormValues) {
    setSubmitError(null);
    try {
      await submitPreorder(values, items);
      setSentMessage(buildOrderMessage(items, values, subtotal));
      clear();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal mengirim pre-order. Coba lagi."
      );
    }
  }

  if (sentMessage) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-whatsapp" />
        <h3 className="font-display text-xl font-bold italic uppercase text-fg">
          Pre-Order Terkirim
        </h3>
        <p className="font-sans text-sm text-fg-muted">
          Terima kasih. Tim kami akan menghubungi Anda untuk konfirmasi stok &amp; pembayaran.
          Ingin lebih cepat? Konfirmasi langsung via WhatsApp.
        </p>
        <CtaButton
          href={waLink(sentMessage)}
          target="_blank"
          rel="noopener"
          variant="whatsapp"
          className="w-full"
        >
          Konfirmasi via WhatsApp
        </CtaButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 px-5 pt-5 font-display text-xs font-bold uppercase tracking-[0.1em] text-fg-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Keranjang
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-5"
        noValidate
      >
        <Field label="Nama" error={errors.name?.message}>
          <input {...register("name")} className={fieldClass} placeholder="Nama lengkap" />
        </Field>

        <Field label="Nomor WhatsApp" error={errors.phone?.message}>
          <input
            {...register("phone")}
            className={fieldClass}
            placeholder="08xx-xxxx-xxxx"
            inputMode="tel"
          />
        </Field>

        <Field label="Model Kendaraan EV (opsional)" error={errors.vehicleModel?.message}>
          <input
            {...register("vehicleModel")}
            className={fieldClass}
            placeholder="mis. Hyundai Ioniq 5"
          />
        </Field>

        <Field label="Catatan (opsional)" error={errors.note?.message}>
          <textarea
            {...register("note")}
            rows={3}
            className={cn(fieldClass, "resize-y")}
            placeholder="Warna, waktu pengiriman, atau permintaan khusus…"
          />
        </Field>

        <div className="mt-1 flex items-center justify-between border-t border-border pt-4">
          <span className="font-sans text-sm text-fg-muted">Total</span>
          <span className="font-display text-lg font-bold text-gold">{formatIDR(subtotal)}</span>
        </div>

        {submitError ? (
          <p className="border border-red/50 bg-red/10 px-4 py-2.5 font-sans text-sm text-red-soft">
            {submitError}
          </p>
        ) : null}

        <CtaButton size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Mengirim…" : "Kirim Pre-Order"}
        </CtaButton>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-xs font-bold uppercase tracking-[0.08em] text-fg-soft">
        {label}
      </span>
      {children}
      {error ? <span className="font-sans text-xs text-red-soft">{error}</span> : null}
    </label>
  );
}
