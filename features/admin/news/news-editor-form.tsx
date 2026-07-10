"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, ImagePlus, X } from "lucide-react";
import { NEWS_TYPES } from "@/types/ui/news";
import { uploadImageAction } from "@/features/admin/actions";
import { saveNewsAction } from "@/features/admin/news-actions";
import { newsFormSchema, type NewsFormValues } from "@/features/admin/news-schema";
import { SectionCard } from "@/features/admin/components/section-card";
import { useFormSubmit } from "@/features/admin/components/form-submit-context";
import { toast } from "sonner";
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

const labelClass = "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted";
const boxClass =
  "flex items-center gap-2 border border-border bg-surface-sunken px-3.5 transition-colors focus-within:border-gold";
// Chrome-less: the surrounding `boxClass` provides border/bg/focus.
const inputClass =
  "h-auto w-full border-0 bg-transparent px-0 py-0 font-sans text-sm text-fg outline-none placeholder:text-fg-faint focus:border-transparent";

const NEWS_FORM_ID = "news-form";

type Props = {
  newsUuid: string | null;
  defaultValues: NewsFormValues;
  initialThumbnailUrl?: string;
  redirectTo: string;
};

export function NewsEditorForm({ newsUuid, defaultValues, initialThumbnailUrl, redirectTo }: Props) {
  const router = useRouter();
  const formCtx = useFormSubmit();
  const [thumbUrl, setThumbUrl] = useState<string | undefined>(initialThumbnailUrl);
  const [thumbUuid, setThumbUuid] = useState<string | null>(null);
  const [thumbDirty, setThumbDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues,
  });

  const status = watch("status");
  const markNew = watch("markNew");

  async function handleThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    if (res.ok) {
      setThumbUrl(res.url);
      setThumbUuid(res.id);
      setThumbDirty(true);
      toast.success("Thumbnail berhasil diunggah.");
    } else {
      toast.error(res.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeThumb() {
    setThumbUrl(undefined);
    setThumbUuid(null);
    setThumbDirty(true);
  }

  async function onSubmit(values: NewsFormValues) {
    formCtx?.setSubmitting(true);
    // Only send thumbnail_uuid when the user changed it (a fresh upload).
    const res = await saveNewsAction(newsUuid, values, thumbDirty ? thumbUuid : null);
    if (!res.ok) {
      formCtx?.setSubmitting(false);
      toast.error(res.message);
      return;
    }
    toast.success(newsUuid ? "Konten diperbarui." : "Konten dibuat.");
    router.push(redirectTo);
    router.refresh();
  }

  function onInvalid() {
    toast.error("Periksa kembali field yang wajib diisi.");
  }

  return (
    <form
      id={NEWS_FORM_ID}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="grid grid-cols-1 items-start gap-5 p-4 md:p-8 lg:grid-cols-[1fr_320px]"
      noValidate
    >
      {/* LEFT */}
      <div className="flex flex-col gap-[18px]">
        <SectionCard title="Informasi Konten" topAccent="gold" bodyClassName="flex flex-col gap-4 md:px-[22px]">
          <Field label="Judul" error={errors.title?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <Input {...register("title")} className={inputClass} placeholder="Judul konten" />
            </div>
          </Field>
          <Field label="Tautan Instagram" error={errors.instagramUrl?.message}>
            <div className={cn(boxClass, "h-[46px]")}>
              <Camera className="h-4 w-4 shrink-0 text-fg-faint" />
              <Input
                {...register("instagramUrl")}
                className={inputClass}
                placeholder="https://www.instagram.com/reel/…"
                inputMode="url"
              />
            </div>
          </Field>
          <Field label="Caption" error={errors.caption?.message}>
            <div className={cn(boxClass, "items-stretch py-3")}>
              <Textarea
                {...register("caption")}
                rows={6}
                className={cn(inputClass, "min-h-0 resize-y leading-relaxed")}
                placeholder="Caption / deskripsi konten Instagram…"
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

          <Field label="Tipe Konten" error={errors.type?.message}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-[46px]">
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <label className="flex items-center justify-between gap-3 border border-border bg-surface-sunken px-3.5 py-3">
            <span className="flex flex-col gap-0.5">
              <span className="font-sans text-[12.5px] font-semibold text-fg">Tandai &ldquo;Baru&rdquo;</span>
              <span className="font-sans text-[10.5px] text-fg-subtle">Konten baru juga otomatis dari tanggal.</span>
            </span>
            <Controller
              control={control}
              name="markNew"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Tandai Baru" />
              )}
            />
          </label>
          {markNew ? (
            <span className="font-sans text-[11px] text-gold">Label &ldquo;Baru&rdquo; akan selalu tampil.</span>
          ) : null}
        </SectionCard>

        <SectionCard title="Thumbnail" bodyClassName="flex flex-col gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            hidden
            onChange={handleThumb}
          />
          <div className="relative mx-auto grid aspect-[4/5] w-full max-w-[200px] place-items-center overflow-hidden border border-border bg-gradient-to-br from-border to-surface-sunken">
            {thumbUrl ? (
              <>
                <Image src={thumbUrl} alt="Thumbnail konten" fill sizes="200px" className="object-cover" />
                <button
                  type="button"
                  onClick={removeThumb}
                  aria-label="Hapus thumbnail"
                  className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center bg-surface-black/70 text-red-soft"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <span className="font-sans text-[11px] text-fg-faint">Belum ada thumbnail</span>
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
                <ImagePlus className="h-4 w-4" /> {thumbUrl ? "Ganti Thumbnail" : "Unggah Thumbnail"}
              </>
            )}
          </button>
          <span className="font-sans text-[11px] leading-relaxed text-fg-faint">
            JPG / PNG / WebP / AVIF · rasio potret 4:5 disarankan
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

export { NEWS_FORM_ID };
