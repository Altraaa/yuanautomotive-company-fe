"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/common/badge";
import type { AdminProductRow, ProductStatus } from "@/types/ui/admin";
import type { ProductBadge } from "@/types/ui/product";
import { cn, formatIDR } from "@/lib/utils";
import { ADMIN_PRODUCTS_TOTAL } from "@/features/admin/data";
import { AdminPagination } from "./admin-pagination";

const GRID = "grid grid-cols-[40px_2.4fr_1fr_1.1fr_0.9fr_1fr_96px] items-center gap-3.5";

const badgeIntent: Record<ProductBadge, "red" | "gold"> = {
  BARU: "red",
  HOT: "red",
  TERLARIS: "gold",
  "PRE-ORDER": "gold",
};

const statusStyle: Record<ProductStatus, string> = {
  Published: "text-whatsapp",
  Draft: "text-fg-subtle",
};

export function ProductManager({ rows }: { rows: AdminProductRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && selected.size === rows.length;

  function toggle(uuid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.uuid)));
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex animate-fade-in flex-wrap items-center justify-between gap-3 border border-border border-l-[3px] border-l-red bg-gradient-to-r from-red/12 to-gold/10 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="grid h-[18px] w-[18px] place-items-center bg-red text-fg">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className="font-sans text-[12.5px] text-fg-soft">
              <b className="text-gold">{selected.size}</b> produk dipilih
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button type="button" className="font-sans text-[11.5px] font-semibold text-fg-muted transition-colors hover:text-fg">
              Set Published
            </button>
            <span className="h-4 w-px bg-border" />
            <button type="button" className="font-sans text-[11.5px] font-semibold text-fg-muted transition-colors hover:text-fg">
              Set Draft
            </button>
            <span className="h-4 w-px bg-border" />
            <button
              type="button"
              className="flex items-center gap-1.5 font-display text-[11.5px] font-bold uppercase tracking-[0.04em] text-red-soft"
            >
              <Trash2 className="h-3.5 w-3.5" /> Hapus Terpilih
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border bg-surface">
        <div className="overflow-x-auto">
          <div className="min-w-[880px]">
            {/* Head */}
            <div className={cn(GRID, "border-b border-border bg-surface-sunken px-[18px] py-3.5")}>
              <button type="button" onClick={toggleAll} aria-label="Pilih semua" className="justify-self-start">
                <Checkbox checked={allSelected} />
              </button>
              {["Produk", "Kategori", "Harga", "Badge", "Status"].map((h) => (
                <HeadCell key={h}>{h}</HeadCell>
              ))}
              <HeadCell className="text-right">Aksi</HeadCell>
            </div>

            {/* Rows */}
            {rows.map((row) => {
              const isChecked = selected.has(row.uuid);
              return (
                <div
                  key={row.uuid}
                  className={cn(
                    GRID,
                    "border-b border-border/70 px-[18px] py-3 transition-colors",
                    isChecked && "bg-surface-raised"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(row.uuid)}
                    aria-label={`Pilih ${row.name}`}
                    className="justify-self-start"
                  >
                    <Checkbox checked={isChecked} />
                  </button>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-[38px] w-11 shrink-0 place-items-center border border-border bg-gradient-to-br from-border to-surface-sunken">
                      <span className="h-4 w-3/5 rounded-sm bg-surface-black/80" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/produk/${row.uuid}`}
                        className="block truncate font-sans text-[13px] font-semibold text-fg transition-colors hover:text-gold"
                      >
                        {row.name}
                      </Link>
                      <div className="font-sans text-[10.5px] text-fg-subtle">{row.sku}</div>
                    </div>
                  </div>

                  <span className="font-sans text-[12.5px] text-fg-soft">{row.category}</span>
                  <span className="font-display text-[13px] font-bold text-gold">
                    {formatIDR(row.price)}
                  </span>
                  <span>
                    {row.badge && <Badge intent={badgeIntent[row.badge]}>{row.badge}</Badge>}
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 font-sans text-[11.5px] font-semibold", statusStyle[row.status])}>
                    <span className="h-[7px] w-[7px] rounded-full bg-current" />
                    {row.status}
                  </span>

                  <div className="flex items-center justify-end gap-1.5">
                    <RowAction label="Edit" tone="gold" href={`/dashboard/produk/${row.uuid}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </RowAction>
                    <RowAction label="Hapus" tone="red">
                      <Trash2 className="h-3.5 w-3.5" />
                    </RowAction>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AdminPagination
          rangeLabel={`1–${rows.length}`}
          totalLabel={String(ADMIN_PRODUCTS_TOTAL)}
          pages={4}
          current={1}
        />
      </div>
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "grid h-4 w-4 place-items-center border transition-colors",
        checked ? "border-red bg-red text-fg" : "border-border-strong bg-transparent"
      )}
    >
      {checked && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
    </span>
  );
}

function HeadCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle",
        className
      )}
    >
      {children}
    </span>
  );
}

function RowAction({
  children,
  label,
  tone,
  href,
}: {
  children: React.ReactNode;
  label: string;
  tone: "gold" | "red";
  href?: string;
}) {
  const className = cn(
    "grid h-[30px] w-[30px] place-items-center border border-border bg-surface-sunken transition-colors hover:border-border-strong",
    tone === "gold" ? "text-gold" : "text-red-soft"
  );
  if (href) {
    return (
      <Link href={href} title={label} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" title={label} aria-label={label} className={className}>
      {children}
    </button>
  );
}
