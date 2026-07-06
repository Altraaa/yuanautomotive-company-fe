"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useAdminSidebar } from "./admin-shell";

export type Crumb = { label: string; href?: string };

type AdminTopbarProps = {
  /** Small gold eyebrow above the title (dashboard style). */
  eyebrow?: string;
  /** Breadcrumb trail shown above the title (manage-page style). */
  crumbs?: Crumb[];
  title: string;
  /** Right-aligned action buttons (e.g. "+ Tambah Produk"). */
  actions?: ReactNode;
  /** Show the search + date filter + bell cluster (dashboard). */
  showTools?: boolean;
};

export function AdminTopbar({
  eyebrow,
  crumbs,
  title,
  actions,
  showTools,
}: AdminTopbarProps) {
  const sidebar = useAdminSidebar();
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-bg px-4 py-3.5 md:px-8 md:py-[18px]">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => sidebar?.open()}
          aria-label="Buka menu"
          className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-surface-sunken text-fg-soft transition-colors hover:text-fg lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0">
          {crumbs && crumbs.length > 0 && (
            <nav className="mb-0.5 flex items-center gap-2 font-sans text-[11px] text-fg-subtle">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-fg">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-gold">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span className="text-border-strong">/</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
              {eyebrow}
            </span>
          )}
          <h1 className="truncate font-display text-xl font-bold uppercase italic text-fg md:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showTools && (
          <>
            <div className="hidden h-[42px] min-w-[220px] items-center gap-2.5 border border-border bg-surface-sunken px-3.5 xl:flex">
              <Search className="h-4 w-4 text-fg-faint" />
              <span className="font-sans text-[13px] text-fg-faint">
                Cari produk, lead, order…
              </span>
            </div>
            <button
              type="button"
              className="hidden h-[42px] items-center gap-1.5 border border-border bg-surface-sunken px-3.5 font-sans text-[12.5px] font-semibold text-fg-soft sm:flex"
            >
              30 Hari <ChevronDown className="h-3.5 w-3.5 text-gold" />
            </button>
            <button
              type="button"
              aria-label="Notifikasi"
              className="relative grid h-[42px] w-[42px] place-items-center border border-border bg-surface-sunken text-fg-soft"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 h-[7px] w-[7px] rounded-full border-2 border-surface-sunken bg-red" />
            </button>
          </>
        )}
        {actions}
      </div>
    </header>
  );
}
