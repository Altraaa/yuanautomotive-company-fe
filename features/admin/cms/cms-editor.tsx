"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { saveCmsAction } from "@/features/admin/cms-actions";
import { SectionCard } from "@/features/admin/components/section-card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * CmsEditor — key-scoped JSON editor for freeform CMS sections. Validates JSON as
 * you type, prettifies, and saves via the server action. Data shape is section-
 * specific, so a raw-but-validated JSON editor is the honest, flexible surface.
 */
export function CmsEditor({
  sectionKey,
  sectionLabel,
  initialData,
  exists,
}: {
  sectionKey: string;
  sectionLabel: string;
  initialData: Record<string, unknown> | null;
  exists: boolean;
}) {
  const router = useRouter();
  const initialText = useMemo(
    () => JSON.stringify(initialData ?? {}, null, 2),
    [initialData]
  );
  const [text, setText] = useState(initialText);
  const [isSaving, startSave] = useTransition();

  const parseError = useMemo(() => {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return "Harus berupa objek JSON ({ ... }).";
      }
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "JSON tidak valid.";
    }
  }, [text]);

  const dirty = text !== initialText;

  function prettify() {
    try {
      setText(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      toast.error("Tidak bisa merapikan — JSON belum valid.");
    }
  }

  function handleSave() {
    if (parseError) {
      toast.error(parseError);
      return;
    }
    startSave(async () => {
      const res = await saveCmsAction(sectionKey, text);
      if (res.ok) {
        toast.success(`Konten "${sectionLabel}" disimpan.`);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <SectionCard
      title={`Konten: ${sectionLabel}`}
      topAccent="gold"
      bodyClassName="flex flex-col gap-3 md:px-[22px]"
      action={
        <button
          type="button"
          onClick={prettify}
          className="inline-flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-[0.06em] text-gold transition-colors hover:text-gold-soft"
        >
          <Sparkles className="h-3.5 w-3.5" /> Rapikan
        </button>
      }
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-fg-subtle">key: {sectionKey}</span>
        <span
          className={cn(
            "font-sans text-[11px] font-semibold",
            exists ? "text-whatsapp" : "text-gold"
          )}
        >
          {exists ? "Tersimpan di backend" : "Belum ada — akan dibuat saat disimpan"}
        </span>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={18}
        className={cn(
          "px-3.5 font-mono text-[12.5px]",
          parseError ? "border-red/50" : "border-border"
        )}
        placeholder='{\n  "title": "..."\n}'
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={cn("font-sans text-[12px]", parseError ? "text-red-soft" : "text-fg-faint")}>
          {parseError ? `JSON tidak valid: ${parseError}` : "JSON valid ✓"}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !!parseError || !dirty}
          className="inline-flex items-center gap-2 bg-red px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.06em] text-fg transition-colors hover:bg-red-soft disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {isSaving ? "Menyimpan…" : "Simpan Konten"}
        </button>
      </div>
    </SectionCard>
  );
}
