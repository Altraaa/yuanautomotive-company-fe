"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Check, Copy, FileText, Trash2, UploadCloud } from "lucide-react";
import { deleteMediaAction, uploadMediaAction } from "@/features/admin/media-actions";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaUploader() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    let okCount = 0;
    for (const file of list) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadMediaAction(fd);
      if (res.ok) {
        okCount += 1;
        setItems((prev) => [
          { id: res.id, url: res.url, filename: res.filename, sizeBytes: res.sizeBytes, mimeType: res.mimeType },
          ...prev,
        ]);
      } else {
        toast.error(`${file.name}: ${res.message}`);
      }
    }
    if (okCount > 0) toast.success(`${okCount} file berhasil diunggah.`);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  async function copyUrl(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      toast.success("URL disalin ke clipboard.");
      setTimeout(() => setCopiedId((c) => (c === item.id ? null : c)), 1500);
    } catch {
      toast.error("Gagal menyalin URL.");
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDelete(async () => {
      const res = await deleteMediaAction(target.id);
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== target.id));
        toast.success("File dihapus.");
      } else {
        toast.error(res.message);
      }
      setDeleteTarget(null);
    });
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-gold bg-gold/[0.06]" : "border-border-strong bg-surface"
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,application/pdf"
          multiple
          hidden
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <span className="grid h-14 w-14 place-items-center border border-border bg-surface-sunken text-gold">
          <UploadCloud className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-sm font-bold uppercase italic text-fg">
            {uploading ? "Mengunggah…" : "Tarik & lepas file di sini"}
          </p>
          <p className="mt-1 font-sans text-[12px] text-fg-subtle">
            JPG / PNG / WebP / AVIF / PDF · maks 10 MB per file
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-1 bg-red px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.06em] text-fg transition-colors hover:bg-red-soft disabled:opacity-50"
        >
          {uploading ? "Menunggu…" : "Pilih File"}
        </button>
      </div>

      {/* Uploaded this session */}
      {items.length > 0 && (
        <div className="border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border bg-surface-sunken px-5 py-3">
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
              Diunggah Sesi Ini
            </span>
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
              {items.length} File
            </span>
          </div>
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const isImage = item.mimeType.startsWith("image/");
              return (
                <div key={item.id} className="flex flex-col gap-3 bg-surface p-3.5">
                  <div className="relative grid aspect-video place-items-center overflow-hidden border border-border bg-surface-sunken">
                    {isImage ? (
                      <Image src={item.url} alt={item.filename} fill sizes="320px" className="object-contain" />
                    ) : (
                      <FileText className="h-10 w-10 text-fg-subtle" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-sans text-[12.5px] font-semibold text-fg">{item.filename}</div>
                    <div className="font-sans text-[11px] text-fg-subtle">{formatBytes(item.sizeBytes)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyUrl(item)}
                      className="flex flex-1 items-center justify-center gap-1.5 border border-border bg-surface-sunken py-2 font-display text-[10.5px] font-bold uppercase tracking-[0.05em] text-gold transition-colors hover:border-border-strong"
                    >
                      {copiedId === item.id ? (
                        <><Check className="h-3.5 w-3.5" /> Tersalin</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Salin URL</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      aria-label={`Hapus ${item.filename}`}
                      className="grid h-[34px] w-[34px] place-items-center border border-border bg-surface-sunken text-red-soft transition-colors hover:border-red/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && !uploading && (
        <p className="text-center font-sans text-[12.5px] text-fg-faint">
          File yang diunggah pada sesi ini akan muncul di sini beserta URL-nya.
        </p>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus File"
        description={deleteTarget ? `"${deleteTarget.filename}" akan dihapus permanen dari media.` : undefined}
        pending={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
