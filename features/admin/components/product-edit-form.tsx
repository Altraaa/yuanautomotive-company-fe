"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/features/admin/product-schema";
import {
  deleteProductAction,
  saveProductAction,
  uploadImageAction,
} from "@/features/admin/actions";
import type { ProductMedia } from "@/types/ui/admin";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "./section-card";
import { ConfirmDialog } from "./confirm-dialog";
import { toast } from "sonner";
import { useFormSubmit } from "./form-submit-context";

const labelClass =
  "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted";
const boxClass =
  "flex items-center gap-2 border border-border bg-surface-sunken px-3.5 transition-colors focus-within:border-gold";
// Chrome-less: the surrounding `boxClass` provides border/bg/focus; the Input
// primitive sits inside it bare.
const inputClass =
  "h-auto w-full border-0 bg-transparent px-0 py-0 font-sans text-sm text-fg outline-none placeholder:text-fg-faint focus:border-transparent";
const badges = ["BARU", "HOT", "TERLARIS", "PRE-ORDER"] as const;

type ProductEditFormProps = {
  /** Product uuid when editing; null when creating. */
  productUuid: string | null;
  defaultValues: ProductFormValues;
  /** Existing product images (uuid + url) to pre-load in edit mode. */
  initialImages?: ProductMedia[];
  /** Category names from the live category list (backend) for the dropdown. */
  categories?: string[];
  /** Shared id so the action-bar "Simpan" button can submit this form. */
  formId?: string;
};

export function ProductEditForm({
  productUuid,
  defaultValues,
  initialImages = [],
  categories = [],
  formId = "product-form",
}: ProductEditFormProps) {
  const router = useRouter();
  const formCtx = useFormSubmit();
  const [compatDraft, setCompatDraft] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [images, setImages] = useState<ProductMedia[]>(initialImages);
  // Only send `image_uuids` (authoritative) once the user actually changes the
  // gallery — otherwise omit it so the backend leaves existing photos intact.
  const [imagesDirty, setImagesDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImageAction(fd);
      if (res.ok) {
        setImages((prev) => [...prev, { uuid: res.id, url: res.url }]);
        setImagesDirty(true);
        ok += 1;
      } else {
        toast.error(res.message);
      }
    }
    if (ok > 0) toast.success(`${ok} gambar diunggah.`);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(uuid: string) {
    setImages((prev) => prev.filter((img) => img.uuid !== uuid));
    setImagesDirty(true);
  }

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

  async function onSubmit(values: ProductFormValues) {
    formCtx?.setSubmitting(true);
    const result = await saveProductAction(
      productUuid,
      values,
      imagesDirty ? images.map((img) => img.uuid) : null
    );
    if (!result.ok) {
      formCtx?.setSubmitting(false);
      toast.error(result.message);
      return;
    }
    toast.success(productUuid ? "Produk diperbarui." : "Produk berhasil dibuat.");
    router.back();
    router.refresh();
  }

  function onInvalid() {
    toast.error("Lengkapi dulu field yang wajib diisi (nama, SKU, harga, stok, slug).");
  }

  function confirmDelete() {
    if (!productUuid) return;
    startDelete(async () => {
      const res = await deleteProductAction(productUuid);
      if (res.ok) {
        toast.success("Produk dihapus.");
        router.push("/dashboard/produk");
        router.refresh();
      } else {
        toast.error(res.message);
        setDeleteOpen(false);
      }
    });
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="grid grid-cols-1 items-start gap-5 p-4 md:p-8 lg:grid-cols-[1fr_340px]"
      noValidate
    >
      {/* LEFT: form sections */}
      <div className="flex flex-col gap-[18px]">
        <SectionCard title="Informasi Dasar" topAccent="gold" bodyClassName="flex flex-col gap-4 md:px-[22px]">
          <Field label="Nama Produk" error={errors.name?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <Input {...register("name")} className={inputClass} placeholder="Nama produk" />
            </div>
          </Field>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label="SKU" error={errors.sku?.message}>
              <div className={cn(boxClass, "h-[46px]")}>
                <Input {...register("sku")} className={cn(inputClass, "font-mono")} placeholder="YD-XXX-000" />
              </div>
            </Field>
            <Field label="Kategori" error={errors.category?.message}>
              <Controller
                control={control}
                name="category"
                render={({ field }) => {
                  // Keep the current value selectable even if it isn't in the
                  // fetched list (e.g. a renamed/legacy category on an old product).
                  const options =
                    field.value && !categories.includes(field.value)
                      ? [field.value, ...categories]
                      : categories;
                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-[46px]">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            Belum ada kategori
                          </SelectItem>
                        ) : (
                          options.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </Field>
          </div>
          <Field label="Deskripsi" error={errors.description?.message}>
            <div className={cn(boxClass, "items-stretch py-3")}>
              <Textarea
                {...register("description")}
                rows={3}
                className={cn(inputClass, "min-h-0 resize-y leading-relaxed")}
                placeholder="Deskripsi produk…"
              />
            </div>
          </Field>
        </SectionCard>

        <SectionCard title="Harga & Stok" topAccent="red" bodyClassName="grid grid-cols-1 gap-3.5 sm:grid-cols-3 md:px-[22px]">
          <Field label="Harga Retail" error={errors.retailPrice?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <span className="font-sans text-xs font-semibold text-fg-subtle">Rp</span>
              <Input {...register("retailPrice")} inputMode="numeric" className={cn(inputClass, "font-display font-bold text-gold")} placeholder="0" />
            </div>
          </Field>
          <Field label="Harga Grosir" error={errors.wholesalePrice?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <span className="font-sans text-xs font-semibold text-fg-subtle">Rp</span>
              <Input {...register("wholesalePrice")} inputMode="numeric" className={cn(inputClass, "font-display font-bold")} placeholder="0" />
            </div>
          </Field>
          <Field label="Stok (unit)" error={errors.stock?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <Input {...register("stock")} inputMode="numeric" className={cn(inputClass, "font-display font-bold")} placeholder="0" />
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
                <Input {...register(`specs.${i}.label`)} className={cn(inputClass, "text-[12.5px] font-semibold text-fg-muted")} placeholder="Label" />
              </div>
              <div className={cn(boxClass, "h-[42px]")}>
                <Input {...register(`specs.${i}.value`)} className={cn(inputClass, "text-[13px]")} placeholder="Nilai" />
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
            <Input
              value={compatDraft}
              onChange={(e) => setCompatDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCompat();
                }
              }}
              placeholder="Tambah kendaraan…"
              className="h-auto w-36 border-0 bg-transparent px-0 py-0 text-xs placeholder:text-fg-faint focus:border-transparent"
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
            <Controller
              control={control}
              name="badge"
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="h-[46px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa badge</SelectItem>
                    {badges.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <label className="flex cursor-pointer items-center justify-between">
            <span className="font-sans text-[12.5px] text-fg-soft">Tampilkan di Unggulan</span>
            <Switch
              checked={featured}
              onCheckedChange={(v) => setValue("featured", v === true, { shouldDirty: true })}
            />
          </label>
        </SectionCard>

        <SectionCard title="Media Produk" bodyClassName="flex flex-col gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            hidden
            onChange={handleFiles}
          />

          {/* Main preview */}
          <div className="relative grid aspect-square place-items-center overflow-hidden border border-border bg-gradient-to-br from-border to-surface-sunken">
            {images[0] ? (
              <Image
                src={images[0].url}
                alt="Foto utama produk"
                fill
                sizes="320px"
                className="object-contain"
              />
            ) : (
              <div className="h-14 w-[48%] rounded-[16px_40px_8px_8px] bg-surface-black/85" />
            )}
            <span className="absolute left-2.5 top-2.5 z-10 bg-surface-black/60 px-1.5 py-1 font-display text-[8.5px] font-bold tracking-[0.1em] text-gold">
              UTAMA
            </span>
            {images[0] && (
              <button
                type="button"
                onClick={() => removeImage(images[0].uuid)}
                aria-label="Hapus foto utama"
                className="absolute right-2 top-2 z-10 grid h-5 w-5 place-items-center bg-surface-black/70 text-red-soft"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Thumbnails + add button */}
          <div className="grid grid-cols-3 gap-2">
            {images.slice(1).map((img) => (
              <div key={img.uuid} className="relative aspect-square overflow-hidden border border-border bg-surface-sunken">
                <Image src={img.url} alt="" fill sizes="120px" className="object-contain" />
                <button
                  type="button"
                  onClick={() => removeImage(img.uuid)}
                  aria-label="Hapus gambar"
                  className="absolute right-0.5 top-0.5 z-10 grid h-4 w-4 place-items-center bg-surface-black/70 text-red-soft"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Tambah gambar"
              className="grid aspect-square place-items-center border border-dashed border-border-strong bg-surface-sunken text-gold transition-colors hover:border-gold disabled:opacity-50"
            >
              {uploading ? (
                <span className="font-sans text-[10px] text-fg-subtle">Uploading…</span>
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </button>
          </div>
          <span className="font-sans text-[11px] leading-relaxed text-fg-faint">
            JPG / PNG / WebP · maks 2 MB · rasio 1:1 disarankan
          </span>
        </SectionCard>

        <SectionCard title="Slug URL" bodyClassName="flex flex-col gap-2">
          <div className={cn(boxClass, "h-[42px]")}>
            <Input {...register("slug")} className={cn(inputClass, "font-mono text-[12.5px]")} placeholder="nama-produk" />
          </div>
          {errors.slug && <span className="font-sans text-xs text-red-soft">{errors.slug.message}</span>}
        </SectionCard>

        {productUuid && (
          <div className="flex items-center justify-between gap-3 border border-red/30 bg-red/[0.08] px-4 py-3.5">
            <div>
              <div className="font-display text-[12.5px] font-bold text-red-soft">Hapus Produk</div>
              <div className="mt-0.5 font-sans text-[11px] text-fg-subtle">Tidak bisa dibatalkan</div>
            </div>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="flex-none border border-red/50 px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.06em] text-red-soft transition-colors hover:bg-red/10"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Produk"
        description="Produk ini akan dihapus permanen. Tindakan tidak bisa dibatalkan."
        pending={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
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
