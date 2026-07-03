"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { contactSchema, type ContactFormValues } from "@/features/contact/schema";
import { submitContactLead } from "@/features/contact/services/submit-contact";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border border-border bg-surface-sunken px-4 py-3 font-sans text-sm text-fg placeholder:text-fg-subtle outline-none transition-colors focus:border-gold";

export function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitError(null);
    try {
      await submitContactLead(values);
      setSubmitted(true);
      reset();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal mengirim pesan. Coba lagi."
      );
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 border border-gold/35 bg-surface p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-whatsapp" />
        <h3 className="font-display text-xl font-bold italic uppercase text-fg">Pesan Terkirim</h3>
        <p className="font-sans text-sm text-fg-muted">
          Terima kasih. Tim kami akan menghubungi Anda secepatnya.
        </p>
        <CtaButton variant="outline" onClick={() => setSubmitted(false)}>
          Kirim Lagi
        </CtaButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Field label="Nama" error={errors.name?.message}>
        <input {...register("name")} className={fieldClass} placeholder="Nama lengkap" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nomor WhatsApp" error={errors.phone?.message}>
          <input
            {...register("phone")}
            className={fieldClass}
            placeholder="08xx-xxxx-xxxx"
            inputMode="tel"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} className={fieldClass} placeholder="nama@email.com" />
        </Field>
      </div>

      <Field label="Model Kendaraan EV (opsional)" error={errors.vehicleModel?.message}>
        <input
          {...register("vehicleModel")}
          className={fieldClass}
          placeholder="mis. Hyundai Ioniq 5"
        />
      </Field>

      <Field label="Pesan" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className={cn(fieldClass, "resize-y")}
          placeholder="Tuliskan kebutuhan atau pertanyaan Anda…"
        />
      </Field>

      {submitError ? (
        <p className="border border-red/50 bg-red/10 px-4 py-2.5 font-sans text-sm text-red-soft">
          {submitError}
        </p>
      ) : null}

      <CtaButton size="lg" disabled={isSubmitting} className="w-full sm:w-fit">
        {isSubmitting ? "Mengirim…" : "Kirim Pesan"}
      </CtaButton>
    </form>
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
