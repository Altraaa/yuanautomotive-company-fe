"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, X } from "lucide-react";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/features/admin/product-schema";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

const labelClass =
  "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted";
const boxClass =
  "flex items-center gap-2 border border-border bg-surface-sunken px-3.5 transition-colors focus-within:border-gold";
const inputClass =
  "w-full bg-transparent font-sans text-sm text-fg outline-none placeholder:text-fg-faint";

type ProductEditFormProps = {
  defaultValues: ProductFormValues;
  /** Where to navigate after a successful save. */
  redirectTo: string;
  /** Shared id so the topbar "Simpan" button can submit this form. */
  formId?: string;
};

const badgeOptions = ["", "BARU", "HOT", "TERLARIS", "PRE-ORDER"];
const categoryOptions = ["Sparepart", "Body Part", "Aksesoris"];

export function ProductEditForm({
  defaultValues,
  redirectTo,
  formId = "product-form",
}: ProductEditFormProps) {
  const router = useRouter();
  const [compatDraft, setCompatDraft] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "specs" });

  const status = watch("status");
  const featured = watch("featured");
  const compatibility = watch("compatibility");

  function addCompat() {
    const value = compatDraft.trim();
    if (!value || compatibility.includes(value)) return;
    setValue("compatibility", [...compatibility, value], { shouldDirty: true });
    setCompatDraft("");
  }

  function removeCompat(tag: string) {
    setValue(
      "compatibility",
      compatibility.filter((c) => c !== tag),
      { shouldDirty: true }
    );
  }

  async function onSubmit(_values: ProductFormValues) {
    // TODO: wire services/products.create|update once the backend is ready.
    router.push(redirectTo);
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 items-start gap-5 p-4 md:p-8 lg:grid-cols-[1fr_340px]"
      noValidate
    >
      {/* LEFT: form sections */}
      <div className="flex flex-col gap-[18px]">
        <SectionCard title="Informasi Dasar" topAccent="gold" bodyClassName="flex flex-col gap-4 md:px-[22px]">
          <Field label="Nama Produk" error={errors.name?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <input {...register("name")} className={inputClass} placeholder="Nama produk" />
            </div>
          </Field>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label="SKU" error={errors.sku?.message}>
              <div className={cn(boxClass, "h-[46px]")}>
                <input {...register("sku")} className={cn(inputClass, "font-mono")} placeholder="YD-XXX-000" />
              </div>
            </Field>
            <Field label="Kategori" error={errors.category?.message}>
              <SelectBox {...register("category")}>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </SelectBox>
            </Field>
          </div>
          <Field label="Deskripsi" error={errors.description?.message}>
            <div className={cn(boxClass, "items-stretch py-3")}>
              <textarea
                {...register("description")}
                rows={3}
                className={cn(inputClass, "resize-y leading-relaxed")}
                placeholder="Deskripsi produk…"
              />
            </div>
          </Field>
        </SectionCard>

        <SectionCard title="Harga & Stok" topAccent="red" bodyClassName="grid grid-cols-1 gap-3.5 sm:grid-cols-3 md:px-[22px]">
          <Field label="Harga Retail" error={errors.retailPrice?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <span className="font-sans text-xs font-semibold text-fg-subtle">Rp</span>
              <input {...register("retailPrice")} inputMode="numeric" className={cn(inputClass, "font-display font-bold text-gold")} placeholder="0" />
            </div>
          </Field>
          <Field label="Harga Grosir" error={errors.wholesalePrice?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <span className="font-sans text-xs font-semibold text-fg-subtle">Rp</span>
              <input {...register("wholesalePrice")} inputMode="numeric" className={cn(inputClass, "font-display font-bold")} placeholder="0" />
            </div>
          </Field>
          <Field label="Stok (unit)" error={errors.stock?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <input {...register("stock")} inputMode="numeric" className={cn(inputClass, "font-display font-bold")} placeholder="0" />
            </div>
          </Field>
        </SectionCard>

        <SectionCard
          title="Spesifikasi Teknis"
          topAccent="gold"
          bodyClassName="flex flex-col gap-2.5 md:px-[22px]"
          action={
            <button
              type="button"
              onClick={() => append({ label: "", value: "" })}
              className="font-display text-[11px] font-bold uppercase tracking-[0.06em] text-gold transition-colors hover:text-gold-soft"
            >
              + Tambah Baris
            </button>
          }
        >
          {fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_36px] items-center gap-2.5 sm:grid-cols-[180px_1fr_36px]">
              <div className={cn(boxClass, "h-[42px]")}>
                <input {...register(`specs.${i}.label`)} className={cn(inputClass, "text-[12.5px] font-semibold text-fg-muted")} placeholder="Label" />
              </div>
              <div className={cn(boxClass, "h-[42px]")}>
                <input {...register(`specs.${i}.value`)} className={cn(inputClass, "text-[13px]")} placeholder="Nilai" />
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Hapus baris"
                className="grid h-[42px] place-items-center border border-border bg-surface-sunken text-red-soft transition-colors hover:border-red/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Kompatibilitas Kendaraan" topAccent="red" bodyClassName="flex flex-wrap items-center gap-2.5 md:px-[22px]">
          {compatibility.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 border border-gold/40 bg-surface-raised px-3 py-2 font-sans text-xs font-semibold text-gold"
            >
              {tag}
              <button type="button" onClick={() => removeCompat(tag)} aria-label={`Hapus ${tag}`} className="text-red-soft">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <div className="inline-flex h-[37px] items-center gap-1.5 border border-dashed border-border-strong bg-surface-sunken px-3 focus-within:border-gold">
            <Plus className="h-3.5 w-3.5 text-gold" />
            <input
              value={compatDraft}
              onChange={(e) => setCompatDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCompat();
                }
              }}
              placeholder="Tambah kendaraan…"
              className="w-36 bg-transparent font-sans text-xs text-fg outline-none placeholder:text-fg-faint"
            />
          </div>
        </SectionCard>
      </div>

      {/* RIGHT: side panel */}
      <div className="flex flex-col gap-[18px] lg:sticky lg:top-5">
        <SectionCard title="Status" bodyClassName="flex flex-col gap-3.5">
          <div className="grid grid-cols-2">
            {(["Published", "Draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("status", s, { shouldDirty: true })}
                className={cn(
                  "py-2.5 text-center font-display text-xs font-bold uppercase tracking-[0.06em] transition-colors",
                  status === s
                    ? "bg-red text-fg"
                    : "border border-border bg-surface-sunken text-fg-subtle hover:text-fg"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <Field label="Badge">
            <SelectBox {...register("badge")}>
              {badgeOptions.map((b) => (
                <option key={b || "none"} value={b}>{b || "Tanpa badge"}</option>
              ))}
            </SelectBox>
          </Field>

          <button
            type="button"
            role="switch"
            aria-checked={featured}
            onClick={() => setValue("featured", !featured, { shouldDirty: true })}
            className="flex items-center justify-between"
          >
            <span className="font-sans text-[12.5px] text-fg-soft">Tampilkan di Unggulan</span>
            <span className={cn("relative h-[22px] w-10 rounded-full transition-colors", featured ? "bg-gold" : "bg-border-strong")}>
              <span
                className={cn(
                  "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-bg transition-all",
                  featured ? "right-0.5" : "left-0.5"
                )}
              />
            </span>
          </button>
        </SectionCard>

        <SectionCard title="Media Produk" bodyClassName="flex flex-col gap-3">
          <div className="relative grid h-[150px] place-items-center border border-border bg-gradient-to-br from-border to-surface-sunken">
            <div className="h-14 w-[48%] rounded-[16px_40px_8px_8px] bg-surface-black/85" />
            <span className="absolute left-2.5 top-2.5 bg-surface-black/60 px-1.5 py-1 font-display text-[8.5px] font-bold tracking-[0.1em] text-gold">
              UTAMA
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 border border-border bg-gradient-to-br from-border to-surface-sunken" />
            <div className="h-14 border border-border bg-gradient-to-br from-border to-surface-sunken" />
            <button type="button" aria-label="Tambah media" className="grid h-14 place-items-center border border-dashed border-border-strong bg-surface-sunken text-gold">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <span className="font-sans text-[11px] leading-relaxed text-fg-faint">
            JPG / PNG · maks 2 MB · rasio 4:3 disarankan
          </span>
        </SectionCard>

        <SectionCard title="Slug URL" bodyClassName="flex flex-col gap-2">
          <div className={cn(boxClass, "h-[42px]")}>
            <input {...register("slug")} className={cn(inputClass, "font-mono text-[12.5px]")} placeholder="nama-produk" />
          </div>
          {errors.slug && <span className="font-sans text-xs text-red-soft">{errors.slug.message}</span>}
        </SectionCard>

        <div className="flex items-center justify-between gap-3 border border-red/30 bg-red/[0.08] px-4 py-3.5">
          <div>
            <div className="font-display text-[12.5px] font-bold text-red-soft">Hapus Produk</div>
            <div className="mt-0.5 font-sans text-[11px] text-fg-subtle">Tidak bisa dibatalkan</div>
          </div>
          <Link
            href="/dashboard/produk"
            className="flex-none border border-red/50 px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.06em] text-red-soft transition-colors hover:bg-red/10"
          >
            Hapus
          </Link>
        </div>
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

function SelectBox({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className="h-[46px] w-full appearance-none border border-border bg-surface-sunken px-3.5 pr-9 font-sans text-sm text-fg outline-none transition-colors focus:border-gold"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
    </div>
  );
}
