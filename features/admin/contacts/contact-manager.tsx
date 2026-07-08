"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Car, Check, Mail, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import type { ContactRow, ContactStatus } from "@/types/ui/contact";
import { CONTACT_STATUSES, CONTACT_STATUS_LABEL } from "@/types/ui/contact";
import { cn, formatDateTime } from "@/lib/utils";
import {
  bulkDeleteContactsAction,
  deleteContactAction,
  updateContactStatusAction,
} from "@/features/admin/contact-actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPill } from "@/features/admin/components/status-pill";
import { StatusTabs } from "@/features/admin/components/status-tabs";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { toast } from "sonner";

/** Build a wa.me link from an Indonesian phone number (0812… → 62812…). */
function waLink(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const intl = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export function ContactManager({ rows }: { rows: ContactRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<ContactRow | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const base: Record<string, number> = { ALL: rows.length, NEW: 0, CONTACTED: 0, CLOSED: 0 };
    for (const r of rows) base[r.status] += 1;
    return base;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab !== "ALL" && r.status !== tab) return false;
      if (q && !`${r.name} ${r.phone} ${r.email} ${r.vehicleModel ?? ""} ${r.message}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [rows, tab, search]);

  function changeStatus(row: ContactRow, status: ContactStatus) {
    if (status === row.status) return;
    startTransition(async () => {
      const res = await updateContactStatusAction(row.uuid, status);
      if (res.ok) {
        toast.success(`Status "${row.name}" → ${CONTACT_STATUS_LABEL[status]}.`);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  function toggle(uuid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const res = await deleteContactAction(target.uuid);
      if (res.ok) {
        toast.success("Lead dihapus.");
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
      const res = await bulkDeleteContactsAction([...selected]);
      if (res.ok) {
        toast.success(`${selected.size} lead dihapus.`);
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
    ...CONTACT_STATUSES.map((s) => ({ value: s, label: CONTACT_STATUS_LABEL[s], count: counts[s] })),
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      <StatusTabs tabs={tabs} active={tab} onChange={setTab} />

      <label className="flex h-11 max-w-sm items-center gap-2.5 border border-border bg-surface px-4 focus-within:border-gold">
        <Search className="h-4 w-4 shrink-0 text-fg-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, email, kendaraan, pesan…"
          className="h-auto flex-1 border-0 bg-transparent px-0 py-0 text-[13px] placeholder:text-fg-faint focus:border-transparent"
        />
      </label>

      {selected.size > 0 && (
        <div className="flex animate-fade-in flex-wrap items-center justify-between gap-3 border border-border border-l-[3px] border-l-red bg-gradient-to-r from-red/12 to-gold/10 px-4 py-2.5">
          <span className="font-sans text-[12.5px] text-fg-soft">
            <b className="text-gold">{selected.size}</b> lead dipilih
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

      <div className="flex flex-col gap-3">
        {filtered.map((row) => {
          const isChecked = selected.has(row.uuid);
          return (
            <article
              key={row.uuid}
              className={cn(
                "border border-border bg-surface p-4 transition-colors md:p-5",
                row.status === "NEW" && "border-l-[3px] border-l-gold",
                isChecked && "bg-surface-raised"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(row.uuid)}
                    aria-label={`Pilih ${row.name}`}
                    className="mt-1 shrink-0"
                  >
                    <Checkbox checked={isChecked} />
                  </button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-sans text-sm font-semibold text-fg">{row.name}</h3>
                      <StatusPill status={row.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-sans text-[11.5px] text-fg-subtle">
                      <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {row.phone}</span>
                      <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {row.email}</span>
                      {row.vehicleModel && (
                        <span className="inline-flex items-center gap-1"><Car className="h-3 w-3" /> {row.vehicleModel}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="shrink-0 whitespace-nowrap font-sans text-[10.5px] text-fg-faint">
                  {formatDateTime(row.createdAt)}
                </span>
              </div>

              <p className="mt-3 border-l-2 border-border pl-3 font-sans text-[13px] leading-relaxed text-fg-soft">
                {row.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={waLink(row.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-whatsapp px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.05em] text-fg transition-[filter] hover:brightness-110"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Balas WhatsApp
                </a>

                <div className="flex items-center gap-2">
                  <StatusSelect value={row.status} disabled={isPending} onChange={(s) => changeStatus(row, s)} />
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(row)}
                    aria-label={`Hapus ${row.name}`}
                    className="grid h-[34px] w-[34px] place-items-center border border-border bg-surface-sunken text-red-soft transition-colors hover:border-red/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="border border-border bg-surface px-5 py-14 text-center font-sans text-sm text-fg-muted">
            Tidak ada lead pada filter ini.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Lead"
        description={deleteTarget ? `Lead dari "${deleteTarget.name}" akan dihapus permanen.` : undefined}
        pending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={bulkOpen}
        title="Hapus Lead Terpilih"
        description={`${selected.size} lead akan dihapus permanen.`}
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
  value: ContactStatus;
  disabled?: boolean;
  onChange: (s: ContactStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ContactStatus)} disabled={disabled}>
      <SelectTrigger
        aria-label="Ubah status lead"
        className="h-[34px] w-auto gap-1.5 px-3 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-fg-soft hover:border-border-strong [&>svg]:h-3 [&>svg]:w-3"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CONTACT_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {CONTACT_STATUS_LABEL[s]}
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
