import type { AdminProductDetail } from "@/types/ui/admin";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

function Row({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "green" | "muted" | "soft";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-sans text-[12.5px] text-fg-subtle">{label}</span>
      <span
        className={cn(
          "text-[12.5px] font-semibold",
          mono ? "font-mono" : "font-sans",
          tone === "green" && "text-whatsapp",
          tone === "muted" && "font-medium text-fg-muted",
          tone === "soft" && "font-medium text-fg-soft",
          !tone && "text-fg-soft"
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** PublishInfo — read-only publication metadata for the product detail screen. */
export function PublishInfo({ detail }: { detail: AdminProductDetail }) {
  return (
    <SectionCard title="Info" accentWord="Publikasi" accentTone="red" bodyClassName="flex flex-col gap-3.5">
      <Row label="Kategori" value={detail.category} />
      <Row label="SKU" value={detail.sku} mono />
      <Row label="Status" value={detail.status} tone={detail.status === "Published" ? "green" : "muted"} />
      <Row label="Slug" value={`/${detail.slug}`} mono tone="muted" />
      <div className="h-px bg-border" />
      <Row label="Dibuat" value={detail.createdAt} tone="soft" />
      <Row label="Diperbarui" value={detail.updatedAt} tone="soft" />
      <Row label="Oleh" value={detail.author} />
    </SectionCard>
  );
}
