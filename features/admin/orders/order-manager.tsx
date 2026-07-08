"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, Search, Trash2 } from "lucide-react";
import type { OrderRow, OrderStatus } from "@/types/ui/order";
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/types/ui/order";
import { cn, formatDateTime, formatIDR } from "@/lib/utils";
import {
  bulkDeleteOrdersAction,
  deleteOrderAction,
  updateOrderStatusAction,
} from "@/features/admin/order-actions";
import { StatusTabs } from "@/features/admin/components/status-tabs";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { useToast } from "@/features/admin/components/toast";

const GRID = "grid grid-cols-[36px_1.8fr_1.3fr_1fr_1.1fr_1fr_90px] items-center gap-3.5";
const PAGE_SIZE = 10;
const statusLabel = ORDER_STATUS_LABEL;

export function OrderManager({ rows }: { rows: OrderRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<OrderRow | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const base: Record<string, number> = { ALL: rows.length, NEW: 0, PROCESSED: 0, DONE: 0, CANCELLED: 0 };
    for (const r of rows) base[r.status] += 1;
    return base;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab !== "ALL" && r.status !== tab) return false;
      if (q && !`${r.customerName} ${r.phone} ${r.vehicleModel ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, tab, search]);

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

  function changeStatus(row: OrderRow, status: OrderStatus) {
    if (status === row.status) return;
    startTransition(async () => {
      const res = await updateOrderStatusAction(row.uuid, status);
      if (res.ok) {
        toast.success(`Status "${row.customerName}" → ${statusLabel[status]}.`);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const res = await deleteOrderAction(target.uuid);
      if (res.ok) {
        toast.success("Pre-order dihapus.");
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
      const res = await bulkDeleteOrdersAction([...selected]);
      if (res.ok) {
        toast.success(`${selected.size} pre-order dihapus.`);
        setSelected(new Set());
        router.refresh();
      } else {
        toast.error(res.message);
      }
      setBulkOpen(false);
    });
  }

  const tabs = [
    { value: "ALL", label: "Semua", count: counts.ALL },
    ...ORDER_STATUSES.map((s) => ({ value: s, label: statusLabel[s], count: counts[s] })),
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      <StatusTabs tabs={tabs} active={tab} onChange={(v) => { setTab(v); setPage(1); }} />

      <label className="flex h-11 max-w-sm items-center gap-2.5 border border-border bg-surface px-4 focus-within:border-gold">
        <Search className="h-4 w-4 shrink-0 text-fg-faint" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Cari nama, telepon, kendaraan…"
          className="w-full bg-transparent font-sans text-[13px] text-fg outline-none placeholder:text-fg-faint"
        />
      </label>

      {selected.size > 0 && (
        <div className="flex animate-fade-in flex-wrap items-center justify-between gap-3 border border-border border-l-[3px] border-l-red bg-gradient-to-r from-red/12 to-gold/10 px-4 py-2.5">
          <span className="font-sans text-[12.5px] text-fg-soft">
            <b className="text-gold">{selected.size}</b> pre-order dipilih
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
              {["Pelanggan", "Kendaraan", "Item", "Total", "Status"].map((h) => (
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
                  <button type="button" onClick={() => toggle(row.uuid)} aria-label={`Pilih ${row.customerName}`} className="justify-self-start">
                    <Checkbox checked={isChecked} />
                  </button>

                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/pre-order/${row.uuid}`}
                      className="block truncate font-sans text-[13px] font-semibold text-fg transition-colors hover:text-gold"
                    >
                      {row.customerName}
                    </Link>
                    <div className="truncate font-sans text-[10.5px] text-fg-subtle">
                      {row.phone} · {formatDateTime(row.createdAt)}
                    </div>
                  </div>

                  <span className="truncate font-sans text-[12.5px] text-fg-soft">
                    {row.vehicleModel ?? "—"}
                  </span>
                  <span className="font-sans text-[12.5px] text-fg-soft">
                    {row.itemCount} item
                  </span>
                  <span className="font-display text-[13px] font-bold text-gold">
                    {formatIDR(row.total)}
                  </span>
                  <span>
                    <StatusSelect value={row.status} disabled={isPending} onChange={(s) => changeStatus(row, s)} />
                  </span>

                  <div className="flex items-center justify-end gap-1.5">
                    <RowAction label="Detail" tone="gold" href={`/dashboard/pre-order/${row.uuid}`}>
                      <Eye className="h-3.5 w-3.5" />
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
                Tidak ada pre-order pada filter ini.
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
        title="Hapus Pre-Order"
        description={deleteTarget ? `Pre-order dari "${deleteTarget.customerName}" akan dihapus permanen.` : undefined}
        pending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={bulkOpen}
        title="Hapus Pre-Order Terpilih"
        description={`${selected.size} pre-order akan dihapus permanen.`}
        pending={isPending}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkOpen(false)}
      />
    </div>
  );
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: OrderStatus;
  disabled?: boolean;
  onChange: (s: OrderStatus) => void;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      aria-label="Ubah status"
      className="cursor-pointer appearance-none border border-border bg-surface-sunken px-2 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-fg-soft outline-none transition-colors hover:border-border-strong focus:border-gold disabled:opacity-50"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-surface text-fg">
          {statusLabel[s]}
        </option>
      ))}
    </select>
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
