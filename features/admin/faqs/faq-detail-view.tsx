import { HelpCircle } from "lucide-react";
import type { AdminFaqDetail } from "@/types/ui/faq";
import { Badge } from "@/components/common/badge";
import { formatDate } from "@/lib/utils";
import { SectionCard } from "@/features/admin/components/section-card";

/** FaqDetailView — read-only admin detail for a single FAQ entry. */
export function FaqDetailView({ detail }: { detail: AdminFaqDetail }) {
  const published = detail.status === "Published";
  const category = detail.category?.trim();

  return (
    <div className="flex flex-col gap-5 p-4 md:gap-[22px] md:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold ${
              published ? "text-whatsapp" : "text-fg-subtle"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${published ? "bg-whatsapp" : "bg-fg-subtle"}`} />
            {published ? "TERBIT" : "DRAFT"}
          </span>
          {category ? (
            <>
              <span className="h-3.5 w-px bg-border" />
              <Badge intent="gold" skew>{category}</Badge>
            </>
          ) : null}
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 grid h-9 w-9 shrink-0 -skew-x-[8deg] place-items-center bg-gold/15 text-gold">
            <HelpCircle className="h-5 w-5 skew-x-[8deg]" />
          </span>
          <h2 className="font-display text-2xl font-bold uppercase italic leading-tight text-fg md:text-[28px]">
            {detail.question}
          </h2>
        </div>

        <p className="whitespace-pre-line font-sans text-[13.5px] leading-relaxed text-fg-muted">
          {detail.answer}
        </p>
      </div>

      <SectionCard title="Detail" accentWord="FAQ" bodyClassName="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        <Meta label="Kategori" value={category || "Tanpa grup"} tone={category ? "gold" : "fg"} />
        <Meta label="Urutan Tampil" value={String(detail.sortOrder)} />
        <Meta label="Status" value={published ? "Terbit" : "Draft"} />
        <Meta label="Dibuat" value={detail.createdAt ? formatDate(detail.createdAt) : "—"} />
      </SectionCard>
    </div>
  );
}

function Meta({ label, value, tone = "fg" }: { label: string; value: string; tone?: "fg" | "gold" }) {
  return (
    <div className="bg-surface px-4 py-3">
      <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-subtle">
        {label}
      </div>
      <div className={`mt-0.5 truncate font-sans text-[13px] font-semibold ${tone === "gold" ? "text-gold" : "text-fg"}`}>
        {value}
      </div>
    </div>
  );
}
