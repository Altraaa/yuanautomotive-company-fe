"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveFaqAction } from "@/features/admin/faq-actions";
import { faqFormSchema, type FaqFormValues } from "@/features/admin/faq-schema";
import { SectionCard } from "@/features/admin/components/section-card";
import { useFormSubmit } from "@/features/admin/components/form-submit-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const labelClass = "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted";
const boxClass =
  "flex items-center gap-2 border border-border bg-surface-sunken px-3.5 transition-colors focus-within:border-gold";
// Chrome-less: the surrounding `boxClass` provides border/bg/focus.
const inputClass =
  "h-auto w-full border-0 bg-transparent px-0 py-0 font-sans text-sm text-fg outline-none placeholder:text-fg-faint focus:border-transparent";

const FAQ_FORM_ID = "faq-form";

/** Datalist id for the category free-text input (autocomplete of existing labels). */
const CATEGORY_LIST_ID = "faq-category-options";

type Props = {
  faqUuid: string | null;
  defaultValues: FaqFormValues;
  /** Existing category labels for autocomplete (optional). */
  categories?: string[];
  redirectTo: string;
};

export function FaqEditorForm({ faqUuid, defaultValues, categories = [], redirectTo }: Props) {
  const router = useRouter();
  const formCtx = useFormSubmit();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues,
  });

  const status = watch("status");

  async function onSubmit(values: FaqFormValues) {
    formCtx?.setSubmitting(true);
    const res = await saveFaqAction(faqUuid, values);
    if (!res.ok) {
      formCtx?.setSubmitting(false);
      toast.error(res.message);
      return;
    }
    toast.success(faqUuid ? "FAQ diperbarui." : "FAQ dibuat.");
    router.push(redirectTo);
    router.refresh();
  }

  function onInvalid() {
    toast.error("Periksa kembali field yang wajib diisi.");
  }

  return (
    <form
      id={FAQ_FORM_ID}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="grid grid-cols-1 items-start gap-5 p-4 md:p-8 lg:grid-cols-[1fr_320px]"
      noValidate
    >
      {/* LEFT */}
      <div className="flex flex-col gap-[18px]">
        <SectionCard title="Pertanyaan & Jawaban" topAccent="gold" bodyClassName="flex flex-col gap-4 md:px-[22px]">
          <Field label="Pertanyaan" error={errors.question?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <Input {...register("question")} className={inputClass} placeholder="mis. Apakah produk bergaransi?" />
            </div>
          </Field>
          <Field label="Jawaban" error={errors.answer?.message}>
            <div className={cn(boxClass, "items-stretch py-3")}>
              <Textarea
                {...register("answer")}
                rows={8}
                className={cn(inputClass, "min-h-0 resize-y leading-relaxed")}
                placeholder="Tulis jawaban lengkap yang menjawab pertanyaan pelanggan…"
              />
            </div>
          </Field>
        </SectionCard>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-[18px] lg:sticky lg:top-5">
        <SectionCard title="Publikasi" bodyClassName="flex flex-col gap-3.5">
          <div className="grid grid-cols-2">
            {(["Published", "Draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("status", s, { shouldDirty: true })}
                className={cn(
                  "py-2.5 text-center font-display text-xs font-bold uppercase tracking-[0.06em] transition-colors",
                  status === s ? "bg-red text-fg" : "border border-border bg-surface-sunken text-fg-subtle hover:text-fg"
                )}
              >
                {s === "Published" ? "Terbit" : "Draft"}
              </button>
            ))}
          </div>
          <span className="font-sans text-[11px] leading-relaxed text-fg-faint">
            Draft tidak tampil di halaman FAQ publik.
          </span>
        </SectionCard>

        <SectionCard title="Pengelompokan" bodyClassName="flex flex-col gap-4">
          <Field label="Kategori" error={errors.category?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <Input
                {...register("category")}
                className={inputClass}
                placeholder="mis. Garansi, Pengiriman…"
                list={categories.length ? CATEGORY_LIST_ID : undefined}
                autoComplete="off"
              />
            </div>
            {categories.length > 0 && (
              <datalist id={CATEGORY_LIST_ID}>
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}
            <span className="font-sans text-[11px] leading-relaxed text-fg-faint">
              Opsional. Kosongkan untuk menaruh di grup &ldquo;Lainnya&rdquo;.
            </span>
          </Field>

          <Field label="Urutan Tampil" error={errors.sortOrder?.message}>
            <div className={cn(boxClass, "h-[46px] w-28")}>
              <Input
                type="number"
                min={0}
                step={1}
                {...register("sortOrder", { valueAsNumber: true })}
                className={inputClass}
              />
            </div>
            <span className="font-sans text-[11px] leading-relaxed text-fg-faint">
              Angka kecil tampil lebih dulu (dalam kategorinya).
            </span>
          </Field>
        </SectionCard>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-[7px]">
      {label && <span className={labelClass}>{label}</span>}
      {children}
      {error && <span className="font-sans text-xs text-red-soft">{error}</span>}
    </label>
  );
}

export { FAQ_FORM_ID };
