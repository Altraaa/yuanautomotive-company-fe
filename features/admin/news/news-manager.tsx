"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Eye, Pencil, Play, Search, Trash2 } from "lucide-react";
import type { AdminNewsRow } from "@/types/ui/news";
import { NEWS_TYPES, isNews } from "@/types/ui/news";
import { cn, formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bulkDeleteNewsAction, deleteNewsAction } from "@/features/admin/news-actions";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { toast } from "sonner";

const GRID = "grid grid-cols-[36px_2.6fr_0.9fr_1.1fr_1fr_112px] items-center gap-3.5";
const PAGE_SIZE = 10;

export function NewsManager({ rows }: { rows: AdminNewsRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<AdminNewsRow | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false;
      if (type !== "Semua" && r.type !== type) return false;
      if (status !== "Semua" && r.status !== status) return false;
      return true;
    });
  }, [rows, search, type, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(r.uuid));

  function toggle(uuid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) pageRows.forEach((r) => next.delete(r.uuid));
      else pageRows.forEach((r) => next.add(r.uuid));
      return next;
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const res = await deleteNewsAction(target.uuid);
      if (res.ok) {
        toast.success("Konten dihapus.");
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(target.uuid);
          return next;
        });
        router.refresh();
      } else {
        toast.error(res.message);
      }
      setDeleteTarget(null);
    });
  }

  function confirmBulkDelete() {
    if (selected.size === 0) return;
    startTransition(async () => {
      const res = await bulkDeleteNewsAction([...selected]);
      if (res.ok) {
        toast.success(`${selected.size} konten dihapus.`);
        setSelected(new Set());
        router.refresh();
      } else {
        toast.error(res.message);
      }
      setBulkOpen(false);
    });
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-11 min-w-[220px] flex-1 items-center gap-2.5 border border-border bg-surface px-4 focus-within:border-gold">
          <Search className="h-4 w-4 shrink-0 text-fg-faint" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari judul konten…"
            className="h-auto flex-1 border-0 bg-transparent px-0 py-0 text-[13px] placeholder:text-fg-faint focus:border-transparent"
          />
        </label>
        <FilterSelect label="Tipe" value={type} onChange={(v) => { setType(v); setPage(1); }} options={["Semua", ...NEWS_TYPES]} />
        <FilterSelect label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["Semua", "Published", "Draft"]} />
      </div>

      {selected.size > 0 && (
        <div className="flex animate-fade-in flex-wrap items-center justify-between gap-3 border border-border border-l-[3px] border-l-red bg-gradient-to-r from-red/12 to-gold/10 px-4 py-2.5">
          <span className="font-sans text-[12.5px] text-fg-soft">
            <b className="text-gold">{selected.size}</b> konten dipilih
          </span>
          <button
            type="button"
            onClick={() => setBulkOpen(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 font-display text-[11.5px] font-bold uppercase tracking-[0.04em] text-red-soft disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Hapus Terpilih
          </button>
        </div>
      )}

      <div className="border border-border bg-surface">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className={cn(GRID, "border-b border-border bg-surface-sunken px-[18px] py-3.5")}>
              <button type="button" onClick={toggleAll} aria-label="Pilih semua" className="justify-self-start">
                <Checkbox checked={allSelected} />
              </button>
              {["Konten", "Tipe", "Terbit", "Status"].map((h) => (
                <HeadCell key={h}>{h}</HeadCell>
              ))}
              <HeadCell className="text-right">Aksi</HeadCell>
            </div>

            {pageRows.map((row) => {
              const isChecked = selected.has(row.uuid);
              const showNew = isNews(row);
              return (
                <div
                  key={row.uuid}
                  className={cn(GRID, "border-b border-border/70 px-[18px] py-3", isChecked && "bg-surface-raised")}
                >
                  <button type="button" onClick={() => toggle(row.uuid)} aria-label={`Pilih ${row.title}`} className="justify-self-start">
                    <Checkbox checked={isChecked} />
                  </button>

                  <div className="flex min-w-0 items-center gap-3">
                    {row.thumbnailUrl ? (
                      <div className="relative aspect-[4/5] w-11 shrink-0 overflow-hidden border border-border bg-surface-sunken">
                        <Image src={row.thumbnailUrl} alt="" fill sizes="44px" className="object-cover" />
                        {row.type === "Reels" && (
                          <span className="absolute inset-0 grid place-items-center">
                            <Play className="h-4 w-4 fill-fg text-fg drop-shadow" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-[4/5] w-11 shrink-0 border border-border bg-gradient-to-br from-border to-surface-sunken" />
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/news/${row.uuid}`}
                        className="block truncate font-sans text-[13px] font-semibold text-fg transition-colors hover:text-gold"
                      >
                        {row.title}
                      </Link>
                      <div className="flex items-center gap-1.5 truncate font-sans text-[10.5px] text-fg-subtle">
                        Instagram
                        {showNew && (
                          <span className="font-display text-[9px] font-bold uppercase tracking-[0.08em] text-red-soft">
                            · Baru
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="font-sans text-[12.5px] text-fg-soft">{row.type}</span>
                  <span className="font-sans text-[12px] text-fg-soft">
                    {row.publishedAt ? formatDate(row.publishedAt) : "—"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 font-sans text-[11.5px] font-semibold",
                      row.status === "Published" ? "text-whatsapp" : "text-fg-subtle"
                    )}
                  >
                    <span className="h-[7px] w-[7px] rounded-full bg-current" />
                    {row.status === "Published" ? "Terbit" : "Draft"}
                  </span>

                  <div className="flex items-center justify-end gap-1.5">
                    <RowAction label="Detail" tone="grey" href={`/dashboard/news/${row.uuid}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </RowAction>
                    <RowAction label="Edit" tone="gold" href={`/dashboard/news/${row.uuid}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </RowAction>
                    <RowAction label="Hapus" tone="red" onClick={() => setDeleteTarget(row)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </RowAction>
                  </div>
                </div>
              );
            })}

            {pageRows.length === 0 && (
              <div className="px-[18px] py-12 text-center font-sans text-sm text-fg-muted">
                Tidak ada konten yang cocok dengan filter.
              </div>
            )}
          </div>
        </div>

        <AdminPagination
          page={currentPage}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Konten"
        description={deleteTarget ? `Konten "${deleteTarget.title}" akan dihapus.` : undefined}
        pending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={bulkOpen}
        title="Hapus Konten Terpilih"
        description={`${selected.size} konten akan dihapus.`}
        pending={isPending}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkOpen(false)}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className="h-11 w-auto gap-1.5 bg-surface font-sans text-[12.5px] font-semibold text-gold"
      >
        <span className="text-fg-soft">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
    <span className={cn("font-display text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle", className)}>
      {children}
    </span>
  );
}

function RowAction({
  children,
  label,
  tone,
  href,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  tone: "gold" | "red" | "grey";
  href?: string;
  onClick?: () => void;
}) {
  const toneClass =
    tone === "gold" ? "text-gold" : tone === "red" ? "text-red-soft" : "text-fg-subtle";
  const className = cn(
    "grid h-[30px] w-[30px] place-items-center border border-border bg-surface-sunken transition-colors hover:border-border-strong",
    toneClass
  );
  if (href) {
    return (
      <Link href={href} title={label} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} title={label} aria-label={label} className={className}>
      {children}
    </button>
  );
}
