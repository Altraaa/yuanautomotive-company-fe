import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { Eyebrow } from "@/components/common/eyebrow";
import { navLinks, site, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-surface-black">
      {/* red→gold hard-split accent border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-red from-50% to-gold to-50%" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div className="flex flex-col gap-4">
          <Logo variant="compact" />
          <p className="max-w-sm font-sans text-[13px] leading-relaxed text-fg-subtle">
            Sparepart &amp; aksesoris mobil listrik untuk komunitas EV, bengkel, dan jaringan
            dealer di Indonesia.
          </p>
          <p className="font-sans text-xs text-fg-faint">
            © {new Date().getFullYear()} {site.name}
          </p>
          <Link
            href="/kebijakan-privasi"
            className="font-sans text-xs font-medium text-fg-subtle transition-colors hover:text-gold"
          >
            Kebijakan Privasi
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <Eyebrow className="tracking-[0.24em]">Menu</Eyebrow>
          <nav className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[13px] font-medium text-fg-muted transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <Eyebrow className="tracking-[0.24em]">Kontak</Eyebrow>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[13px] font-medium text-fg-muted transition-colors hover:text-whatsapp"
          >
            WhatsApp {site.whatsapp.display}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="font-sans text-[13px] font-medium text-fg-muted transition-colors hover:text-gold"
          >
            {site.email}
          </a>
          <span className="font-sans text-[13px] font-medium leading-relaxed text-fg-muted">
            {site.location}
          </span>
        </div>
      </div>
    </footer>
  );
}
