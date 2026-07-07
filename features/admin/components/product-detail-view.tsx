import { Badge } from "@/components/common/badge";
import type { AdminProductDetail } from "@/types/ui/admin";
import { formatIDR } from "@/lib/utils";
import { AdminMetric } from "./admin-metric";
import { ProductGallery } from "./product-gallery";
import { PublishInfo } from "./publish-info";
import { SpecTable } from "./spec-table";

const groupThousands = (n: number) => new Intl.NumberFormat("id-ID").format(n);

/** ProductDetailView — full read-only admin product detail body (gallery + info + specs). */
export function ProductDetailView({ detail }: { detail: AdminProductDetail }) {
  const lead = detail.nameAccent
    ? detail.name.slice(0, detail.name.lastIndexOf(detail.nameAccent)).trim()
    : detail.name;

  return (
    <div className="flex flex-col gap-5 p-4 md:gap-[22px] md:p-8">
      {/* Hero */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
        <ProductGallery images={detail.galleryMedia.map((m) => m.url)} badge={detail.badge} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold text-whatsapp">
              <span className="h-2 w-2 rounded-full bg-whatsapp" />
              {detail.status.toUpperCase()}
            </span>
            {detail.badge && (
              <>
                <span className="h-3.5 w-px bg-border" />
                <Badge intent="red">{detail.badge}</Badge>
              </>
            )}
            <span className="font-sans text-[11px] tracking-[0.1em] text-fg-subtle">
              {detail.category.toUpperCase()} · {detail.sku}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold uppercase italic leading-tight text-fg md:text-[28px]">
            {lead}
            {detail.nameAccent && <span className="text-gold"> {detail.nameAccent}</span>}
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AdminMetric label="Harga Retail" value={formatIDR(detail.retailPrice)} accent="gold" valueTone="gold" />
            <AdminMetric label="Harga Grosir" value={formatIDR(detail.wholesalePrice)} accent="red" />
            <AdminMetric label="Stok" value={String(detail.stock)} suffix="unit" accent="gold" />
          </div>

          <p className="font-sans text-[13.5px] leading-relaxed text-fg-muted">{detail.description}</p>

          <div className="flex flex-col gap-2 border-l-[3px] border-l-gold bg-surface px-4 py-3.5">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              Kompatibel Dengan
            </span>
            <div className="flex flex-wrap gap-1.5">
              {detail.compatibility.map((c) => (
                <span
                  key={c}
                  className="border border-gold/40 bg-surface-raised px-2.5 py-1 font-sans text-[11.5px] font-semibold text-gold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-border pt-3.5">
            <Meta label="Dilihat" value={groupThousands(detail.views)} tone="fg" />
            <Meta label="Leads" value={String(detail.leads)} tone="gold" />
            <Meta label="Pre-Order" value={String(detail.preorders)} tone="red" />
          </div>
        </div>
      </div>

      {/* Spec + publication */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SpecTable specs={detail.specs} />
        <PublishInfo detail={detail} />
      </div>
    </div>
  );
}

function Meta({ label, value, tone }: { label: string; value: string; tone: "fg" | "gold" | "red" }) {
  const toneClass = tone === "gold" ? "text-gold" : tone === "red" ? "text-red" : "text-fg";
  return (
    <div>
      <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-subtle">
        {label}
      </div>
      <div className={`mt-0.5 font-display text-[17px] font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
