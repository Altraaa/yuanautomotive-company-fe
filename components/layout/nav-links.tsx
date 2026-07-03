"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Desktop nav links with active-route highlighting (comp: active = gold + red underline).
 * Client leaf so the Header itself can stay a Server Component.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navLinks.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "font-display text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors",
              active
                ? "border-b-2 border-red pb-[3px] text-gold"
                : "text-fg-soft hover:text-fg"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
