"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Pencil, Search, Trash2 } from "lucide-react";
import type { AdminBlogRow } from "@/types/ui/blog";
import { BLOG_CATEGORIES } from "@/types/ui/blog";
import { cn, formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bulkDeleteBlogsAction, deleteBlogAction } from "@/features/admin/blog-actions";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { toast } from "sonner";

const GRID = "grid grid-cols-[36px_2.6fr_1fr_1.1fr_1fr_78px] items-center gap-3.5";
const PAGE_SIZE = 25;

export function BlogManager({ rows }: { rows: AdminBlogRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogRow | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false;
      if (category !== "Semua" && r.category !== category) return false;
      if (status !== "Semua" && r.status !== status) return false;
      return true;
    });
  }, [rows, search, category, status]);

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
      const res = await deleteBlogAction(target.uuid);
      if (res.ok) {
        toast.success("Artikel dihapus.");
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
      const res = await bulkDeleteBlogsAction([...selected]);
      if (res.ok) {
        toast.success(`${selected.size} artikel dihapus.`);
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
            placeholder="Cari judul artikel…"
            className="h-auto flex-1 border-0 bg-transparent px-0 py-0 text-[13px] placeholder:text-fg-faint focus:border-transparent"
          />
        </label>
        <FilterSelect label="Kategori" value={category} onChange={(v) => { setCategory(v); setPage(1); }} options={["Semua", ...BLOG_CATEGORIES]} />
        <FilterSelect label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["Semua", "Published", "Draft"]} />
      </div>

      {selected.size > 0 && (
        <div className="flex animate-fade-in flex-wrap items-center justify-between gap-3 border border-border border-l-[3px] border-l-red bg-gradient-to-r from-red/12 to-gold/10 px-4 py-2.5">
          <span className="font-sans text-[12.5px] text-fg-soft">
            <b className="text-gold">{selected.size}</b> artikel dipilih
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
          <div className="min-w-[820px]">
            <div className={cn(GRID, "border-b border-border bg-surface-sunken px-[18px] py-3.5")}>
              <button type="button" onClick={toggleAll} aria-label="Pilih semua" className="justify-self-start">
                <Checkbox checked={allSelected} />
              </button>
              {["Artikel", "Kategori", "Terbit", "Status"].map((h) => (
                <HeadCell key={h}>{h}</HeadCell>
              ))}
              <HeadCell className="text-right">Aksi</HeadCell>
            </div>

            {pageRows.map((row) => {
              const isChecked = selected.has(row.uuid);
              return (
                <div
                  key={row.uuid}
                  className={cn(GRID, "border-b border-border/70 px-[18px] py-3", isChecked && "bg-surface-raised")}
                >
                  <button type="button" onClick={() => toggle(row.uuid)} aria-label={`Pilih ${row.title}`} className="justify-self-start">
                    <Checkbox checked={isChecked} />
                  </button>

                  <div className="flex min-w-0 items-center gap-3">
                    {row.imageUrl ? (
                      <div className="relative aspect-[4/3] w-14 shrink-0 overflow-hidden border border-border bg-surface-sunken">
                        <Image src={row.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] w-14 shrink-0 border border-border bg-gradient-to-br from-border to-surface-sunken" />
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/blog/${row.uuid}/edit`}
                        className="block truncate font-sans text-[13px] font-semibold text-fg transition-colors hover:text-gold"
                      >
                        {row.title}
                      </Link>
                      <div className="truncate font-sans text-[10.5px] text-fg-subtle">
                        {row.readingMinutes} menit · {row.author}
                      </div>
                    </div>
                  </div>

                  <span className="font-sans text-[12.5px] text-fg-soft">{row.category}</span>
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
                    <RowAction label="Edit" tone="gold" href={`/dashboard/blog/${row.uuid}/edit`}>
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
                Tidak ada artikel yang cocok dengan filter.
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
        title="Hapus Artikel"
        description={deleteTarget ? `Artikel "${deleteTarget.title}" akan dihapus.` : undefined}
        pending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={bulkOpen}
        title="Hapus Artikel Terpilih"
        description={`${selected.size} artikel akan dihapus.`}
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
  tone: "gold" | "red";
  href?: string;
  onClick?: () => void;
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
    <button type="button" onClick={onClick} title={label} aria-label={label} className={className}>
      {children}
    </button>
  );
}
