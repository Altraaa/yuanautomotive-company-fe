import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/common/page-hero";
import { Eyebrow } from "@/components/common/eyebrow";
import { CtaButton } from "@/components/common/cta-button";
import { ContactForm } from "@/features/contact/components/contact-form";
import { site, waLink } from "@/lib/site";
import { keywordsFor } from "@/lib/seo-keywords";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kontak — Hubungi Tim Kami",
  description:
    "Hubungi tim Yuan Dewata Automotive via WhatsApp atau formulir untuk konsultasi sparepart & aksesoris mobil listrik, harga grosir, dan kemitraan dealer.",
  keywords: keywordsFor("contact"),
  alternates: { canonical: `${site.url}/kontak` },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi"
        accent="Tim Kami"
        description="Butuh konsultasi teknis, cek stok, atau harga grosir? Chat langsung via WhatsApp atau kirim pesan lewat formulir di bawah."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:gap-12">
          {/* WhatsApp-first contact rail */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 border-t-[3px] border-t-whatsapp bg-surface p-6">
              <Eyebrow tone="muted">Cara Tercepat</Eyebrow>
              <h2 className="font-display text-xl font-bold italic uppercase text-fg">
                Chat Sales via WhatsApp
              </h2>
              <p className="font-sans text-sm leading-relaxed text-fg-muted">
                Respon di jam kerja kurang dari 15 menit. Cocok untuk tanya stok, kompatibilitas,
                dan harga dealer.
              </p>
              <CtaButton href={waLink()} target="_blank" rel="noopener" variant="whatsapp" size="lg">
                <MessageCircle className="h-4 w-4" />
                {site.whatsapp.display}
              </CtaButton>
            </div>

            <ul className="flex flex-col gap-4">
              <ContactRow icon={<Mail className="h-5 w-5" />} label="Email" value={site.email} href={`mailto:${site.email}`} />
              <ContactRow icon={<MapPin className="h-5 w-5" />} label="Lokasi" value={site.location} />
            </ul>
          </div>

          {/* Lead form */}
          <div className="border border-border bg-surface p-6 md:p-8">
            <Eyebrow tone="red">Kirim Pesan</Eyebrow>
            <h2 className="mb-6 mt-2 font-display text-xl font-bold italic uppercase text-fg">
              Formulir Kontak
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <li className="flex items-center gap-4 border border-border bg-surface px-5 py-4">
      <span className="grid h-10 w-10 flex-none place-items-center bg-surface-sunken text-gold">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
          {label}
        </span>
        <span className="font-sans text-sm text-fg">{value}</span>
      </span>
    </li>
  );
  return href ? (
    <a href={href} className="transition-opacity hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  );
}
