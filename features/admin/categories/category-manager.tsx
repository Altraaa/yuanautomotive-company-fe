"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, FolderTree, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import type { CategoryOption } from "@/services/categories";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/features/admin/category-actions";
import { toast } from "sonner";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const boxClass =
  "flex h-11 items-center gap-2.5 border border-border bg-surface px-4 transition-colors focus-within:border-gold";
const inputClass =
  "h-auto w-full border-0 bg-transparent px-0 py-0 font-sans text-[13px] text-fg outline-none placeholder:text-fg-faint focus:border-transparent";

export function CategoryManager({ initial }: { initial: CategoryOption[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [pendingTarget, setPendingTarget] = useState<CategoryOption | null>(null);
  const [isCreating, startCreate] = useTransition();
  const [isSaving, startSave] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initial;
    return initial.filter((c) => `${c.name} ${c.slug}`.toLowerCase().includes(q));
  }, [initial, search]);

  function handleCreate() {
    const name = draft.trim();
    if (!name) return;
    startCreate(async () => {
      const res = await createCategoryAction(name);
      if (res.ok) {
        toast.success(`Kategori "${res.category.name}" ditambahkan.`);
        setDraft("");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  function startEdit(cat: CategoryOption) {
    setEditingUuid(cat.uuid);
    setEditValue(cat.name);
  }

  function handleSaveEdit(cat: CategoryOption) {
    const name = editValue.trim();
    if (!name || name === cat.name) {
      setEditingUuid(null);
      return;
    }
    startSave(async () => {
      const res = await updateCategoryAction(cat.uuid, name);
      if (res.ok) {
        toast.success("Kategori diperbarui.");
        setEditingUuid(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  function handleDelete() {
    if (!pendingTarget) return;
    const target = pendingTarget;
    startDelete(async () => {
      const res = await deleteCategoryAction(target.uuid);
      if (res.ok) {
        toast.success(`Kategori "${target.name}" dihapus.`);
        setPendingTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
        setPendingTarget(null);
      }
    });
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Add new */}
      <div className="border border-border border-t-[3px] border-t-gold bg-surface p-4 md:p-5">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-fg-muted">
          Tambah Kategori Baru
        </span>
        <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
          <div className={cn(boxClass, "flex-1")}>
            <FolderTree className="h-4 w-4 shrink-0 text-fg-faint" />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              placeholder="Nama kategori, mis. Sparepart"
              className={inputClass}
              maxLength={120}
            />
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isCreating || !draft.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 bg-red px-5 font-display text-xs font-bold uppercase tracking-[0.06em] text-fg transition-colors hover:bg-red-soft disabled:opacity-50"
          >
            {isCreating ? (
              "Menyimpan…"
            ) : (
              <>
                <Plus className="h-4 w-4" /> Tambah
              </>
            )}
          </button>
        </div>
        <p className="mt-2 font-sans text-[11px] text-fg-faint">
          Slug URL dibuat otomatis dari nama. Kategori dipakai di filter & form produk.
        </p>
      </div>

      {/* Search */}
      <label className={cn(boxClass, "max-w-sm")}>
        <Search className="h-4 w-4 shrink-0 text-fg-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kategori…"
          className={inputClass}
        />
      </label>

      {/* List */}
      <div className="border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border bg-surface-sunken px-5 py-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
            {filtered.length} Kategori
          </span>
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
            Aksi
          </span>
        </div>

        {filtered.map((cat) => {
          const isEditing = editingUuid === cat.uuid;
          return (
            <div
              key={cat.uuid}
              className="flex items-center gap-3 border-b border-border/70 px-5 py-3 last:border-b-0"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center border border-border bg-surface-sunken text-gold">
                <FolderTree className="h-4 w-4" />
              </span>

              {isEditing ? (
                <div className={cn(boxClass, "h-10 flex-1")}>
                  <Input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveEdit(cat);
                      }
                      if (e.key === "Escape") setEditingUuid(null);
                    }}
                    className={inputClass}
                    maxLength={120}
                  />
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[13px] font-semibold text-fg">
                    {cat.name}
                  </div>
                  <div className="truncate font-mono text-[11px] text-fg-subtle">/{cat.slug}</div>
                </div>
              )}

              <div className="flex shrink-0 items-center gap-1.5">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat)}
                      disabled={isSaving}
                      aria-label="Simpan"
                      className="grid h-[30px] w-[30px] place-items-center border border-border bg-surface-sunken text-whatsapp transition-colors hover:border-border-strong disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUuid(null)}
                      aria-label="Batal"
                      className="grid h-[30px] w-[30px] place-items-center border border-border bg-surface-sunken text-fg-subtle transition-colors hover:text-fg"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      aria-label={`Edit ${cat.name}`}
                      className="grid h-[30px] w-[30px] place-items-center border border-border bg-surface-sunken text-gold transition-colors hover:border-border-strong"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingTarget(cat)}
                      aria-label={`Hapus ${cat.name}`}
                      className="grid h-[30px] w-[30px] place-items-center border border-border bg-surface-sunken text-red-soft transition-colors hover:border-red/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center font-sans text-sm text-fg-muted">
            {search ? "Tidak ada kategori yang cocok." : "Belum ada kategori. Tambahkan di atas."}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingTarget !== null}
        title="Hapus Kategori"
        description={
          pendingTarget
            ? `Kategori "${pendingTarget.name}" akan dihapus permanen. Produk yang memakainya bisa terpengaruh.`
            : undefined
        }
        pending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingTarget(null)}
      />
    </div>
  );
}
