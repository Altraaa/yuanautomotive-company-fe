import Image from "next/image";
import { Camera, ExternalLink, Play } from "lucide-react";
import type { AdminNewsDetail } from "@/types/ui/news";
import { isNews } from "@/types/ui/news";
import { Badge } from "@/components/common/badge";
import { formatDate } from "@/lib/utils";
import { SectionCard } from "@/features/admin/components/section-card";

/** NewsDetailView — read-only admin detail for an Instagram content item. */
export function NewsDetailView({ detail }: { detail: AdminNewsDetail }) {
  const isReels = detail.type === "Reels";
  const showNew = isNews(detail);

  return (
    <div className="flex flex-col gap-5 p-4 md:gap-[22px] md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        {/* Thumbnail */}
        <div className="relative mx-auto grid aspect-[4/5] w-full max-w-[260px] place-items-center overflow-hidden border border-border bg-gradient-to-br from-border to-surface-sunken">
          {detail.thumbnailUrl ? (
            <Image src={detail.thumbnailUrl} alt={detail.title} fill sizes="260px" className="object-cover" />
          ) : (
            <span className="font-sans text-[11px] text-fg-faint">Belum ada thumbnail</span>
          )}
          {isReels && detail.thumbnailUrl ? (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-black/55 text-fg backdrop-blur-sm">
                <Play className="h-5 w-5 translate-x-0.5 fill-current" />
              </span>
            </span>
          ) : null}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold text-whatsapp">
              <span className="h-2 w-2 rounded-full bg-whatsapp" />
              {detail.status.toUpperCase()}
            </span>
            <span className="h-3.5 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.1em] text-fg-subtle">
              {isReels ? <Play className="h-3 w-3 fill-current" /> : <Camera className="h-3 w-3" />}
              {detail.type.toUpperCase()}
            </span>
            {showNew && (
              <>
                <span className="h-3.5 w-px bg-border" />
                <Badge intent="red" skew>Baru</Badge>
              </>
            )}
          </div>

          <h2 className="font-display text-2xl font-bold uppercase italic leading-tight text-fg md:text-[28px]">
            {detail.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 font-sans text-[12.5px] text-fg-subtle">
            <span>Instagram</span>
            <span className="text-fg-faint">·</span>
            <span>{detail.publishedAt ? formatDate(detail.publishedAt) : "Belum terbit"}</span>
          </div>

          <p className="whitespace-pre-line font-sans text-[13.5px] leading-relaxed text-fg-muted">
            {detail.caption}
          </p>

          <a
            href={detail.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 border border-gold/40 bg-surface px-4 py-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.05em] text-gold transition-colors hover:border-gold"
          >
            <Camera className="h-4 w-4" />
            {isReels ? "Tonton di Instagram" : "Lihat di Instagram"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <SectionCard title="Detail" accentWord="Konten" bodyClassName="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        <Meta label="Slug" value={detail.slug} />
        <Meta label="Tipe" value={detail.type} />
        <Meta label="Status" value={detail.status === "Published" ? "Terbit" : "Draft"} />
        <Meta label="Label Baru" value={showNew ? "Aktif" : "Nonaktif"} tone={showNew ? "gold" : "fg"} />
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
