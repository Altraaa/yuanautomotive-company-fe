"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { navLinks, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="grid h-10 w-10 place-items-center text-fg"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-[73px] z-40 animate-fade-up border-t border-border bg-bg px-4 py-6 shadow-xl">
          <nav className="flex flex-col">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-border py-3.5 font-display text-base font-semibold uppercase tracking-[0.06em]",
                    active ? "text-gold" : "text-fg"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <CtaButton
            href={waLink()}
            target="_blank"
            rel="noopener"
            className="mt-6 w-full"
            onClick={() => setOpen(false)}
          >
            Chat Sales
          </CtaButton>
        </div>
      ) : null}
    </div>
  );
}
