import { Eyebrow } from "@/components/common/eyebrow";

type PartnerStripProps = {
  label?: string;
  partners: string[];
};

/** PartnerStrip — "DIPERCAYA OLEH" label + placeholder partner logo tiles. */
export function PartnerStrip({ label = "Dipercaya Oleh", partners }: PartnerStripProps) {
  return (
    <div className="flex flex-col gap-4">
      <Eyebrow tone="muted">{label}</Eyebrow>
      <div className="grid grid-cols-3 gap-3">
        {partners.map((partner) => (
          <div
            key={partner}
            className="grid h-13 place-items-center border border-border bg-surface font-condensed text-xs font-bold uppercase tracking-[0.1em] text-fg-faint"
          >
            {partner}
          </div>
        ))}
      </div>
    </div>
  );
}
