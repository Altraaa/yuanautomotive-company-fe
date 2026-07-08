"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { BLOG_CATEGORIES } from "@/types/ui/blog";
import { uploadImageAction } from "@/features/admin/actions";
import { saveBlogAction } from "@/features/admin/blog-actions";
import { blogFormSchema, type BlogFormValues } from "@/features/admin/blog-schema";
import { SectionCard } from "@/features/admin/components/section-card";
import { useFormSubmit } from "@/features/admin/components/form-submit-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tiptap is heavy + browser-only → keep it out of the SSR/public bundle.
const RichTextEditor = dynamic(
  () => import("./rich-text-editor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[326px] place-items-center border border-border bg-surface-sunken font-sans text-sm text-fg-faint">
        Memuat editor…
      </div>
    ),
  }
);

const labelClass = "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted";
const boxClass =
  "flex items-center gap-2 border border-border bg-surface-sunken px-3.5 transition-colors focus-within:border-gold";
// Chrome-less: the surrounding `boxClass` provides border/bg/focus.
const inputClass =
  "h-auto w-full border-0 bg-transparent px-0 py-0 font-sans text-sm text-fg outline-none placeholder:text-fg-faint focus:border-transparent";

const BLOG_FORM_ID = "blog-form";

type Props = {
  blogUuid: string | null;
  defaultValues: BlogFormValues;
  initialCoverUrl?: string;
  redirectTo: string;
};

export function BlogEditorForm({ blogUuid, defaultValues, initialCoverUrl, redirectTo }: Props) {
  const router = useRouter();
  const formCtx = useFormSubmit();
  const [coverUrl, setCoverUrl] = useState<string | undefined>(initialCoverUrl);
  const [coverUuid, setCoverUuid] = useState<string | null>(null);
  const [coverDirty, setCoverDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues,
  });

  const status = watch("status");

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    if (res.ok) {
      setCoverUrl(res.url);
      setCoverUuid(res.id);
      setCoverDirty(true);
      toast.success("Cover berhasil diunggah.");
    } else {
      toast.error(res.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeCover() {
    setCoverUrl(undefined);
    setCoverUuid(null);
    setCoverDirty(true);
  }

  async function onSubmit(values: BlogFormValues) {
    formCtx?.setSubmitting(true);
    // Only send cover_uuid when the user changed the cover (a fresh upload).
    const res = await saveBlogAction(blogUuid, values, coverDirty ? coverUuid : null);
    if (!res.ok) {
      formCtx?.setSubmitting(false);
      toast.error(res.message);
      return;
    }
    toast.success(blogUuid ? "Artikel diperbarui." : "Artikel dibuat.");
    router.push(redirectTo);
    router.refresh();
  }

  function onInvalid() {
    toast.error("Periksa kembali field yang wajib diisi.");
  }

  return (
    <form
      id={BLOG_FORM_ID}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="grid grid-cols-1 items-start gap-5 p-4 md:p-8 lg:grid-cols-[1fr_320px]"
      noValidate
    >
      {/* LEFT */}
      <div className="flex flex-col gap-[18px]">
        <SectionCard title="Informasi Artikel" topAccent="gold" bodyClassName="flex flex-col gap-4 md:px-[22px]">
          <Field label="Judul" error={errors.title?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <Input {...register("title")} className={inputClass} placeholder="Judul artikel" />
            </div>
          </Field>
          <Field label="Ringkasan (excerpt)" error={errors.excerpt?.message}>
            <div className={cn(boxClass, "items-stretch py-3")}>
              <Textarea
                {...register("excerpt")}
                rows={2}
                className={cn(inputClass, "min-h-0 resize-y leading-relaxed")}
                placeholder="Ringkasan singkat untuk kartu & meta description…"
              />
            </div>
          </Field>
        </SectionCard>

        <SectionCard title="Isi Artikel" topAccent="red" bodyClassName="flex flex-col gap-2 md:px-[22px]">
          <RichTextEditor
            initialHtml={defaultValues.contentHtml}
            onChange={(html) => setValue("contentHtml", html, { shouldValidate: true })}
          />
          {errors.contentHtml && (
            <span className="font-sans text-xs text-red-soft">{errors.contentHtml.message}</span>
          )}
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

          <Field label="Kategori" error={errors.category?.message}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-[46px]">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Penulis" error={errors.author?.message}>
              <div className={cn(boxClass, "h-[42px]")}>
                <Input {...register("author")} className={cn(inputClass, "text-[13px]")} placeholder="Penulis" />
              </div>
            </Field>
            <Field label="Menit Baca" error={errors.readingMinutes?.message}>
              <div className={cn(boxClass, "h-[42px]")}>
                <Input {...register("readingMinutes")} inputMode="numeric" className={cn(inputClass, "text-[13px]")} placeholder="4" />
              </div>
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Gambar Cover" bodyClassName="flex flex-col gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            hidden
            onChange={handleCover}
          />
          <div className="relative grid aspect-video place-items-center overflow-hidden border border-border bg-gradient-to-br from-border to-surface-sunken">
            {coverUrl ? (
              <>
                <Image src={coverUrl} alt="Cover artikel" fill sizes="320px" className="object-cover" />
                <button
                  type="button"
                  onClick={removeCover}
                  aria-label="Hapus cover"
                  className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center bg-surface-black/70 text-red-soft"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <span className="font-sans text-[11px] text-fg-faint">Belum ada cover</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 border border-dashed border-border-strong bg-surface-sunken py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.05em] text-gold transition-colors hover:border-gold disabled:opacity-50"
          >
            {uploading ? (
              "Mengunggah…"
            ) : (
              <>
                <ImagePlus className="h-4 w-4" /> {coverUrl ? "Ganti Cover" : "Unggah Cover"}
              </>
            )}
          </button>
          <span className="font-sans text-[11px] leading-relaxed text-fg-faint">
            JPG / PNG / WebP / AVIF · rasio 16:9 disarankan
          </span>
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

export { BLOG_FORM_ID };
