"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MessageSquare, Phone, Car, Trash2 } from "lucide-react";
import type { OrderDetail, OrderStatus } from "@/types/ui/order";
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/types/ui/order";
import { cn, formatDateTime, formatIDR } from "@/lib/utils";
import { deleteOrderAction, updateOrderStatusAction } from "@/features/admin/order-actions";
import { SectionCard } from "@/features/admin/components/section-card";
import { StatusPill } from "@/features/admin/components/status-pill";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { useToast } from "@/features/admin/components/toast";

export function OrderDetailView({ order }: { order: OrderDetail }) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function changeStatus(next: OrderStatus) {
    if (next === status) return;
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      const res = await updateOrderStatusAction(order.uuid, next);
      if (res.ok) {
        toast.success(`Status diubah ke ${ORDER_STATUS_LABEL[next]}.`);
        router.refresh();
      } else {
        setStatus(prev);
        toast.error(res.message);
      }
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      const res = await deleteOrderAction(order.uuid);
      if (res.ok) {
        toast.success("Pre-order dihapus.");
        router.push("/dashboard/pre-order");
        router.refresh();
      } else {
        toast.error(res.message);
        setDeleteOpen(false);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 p-4 md:p-8 lg:grid-cols-[1fr_320px]">
      {/* LEFT */}
      <div className="flex flex-col gap-[18px]">
        <SectionCard title="Detail Pelanggan" topAccent="gold" bodyClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:px-[22px]">
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Nama & Telepon" value={order.customerName} sub={order.phone} />
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={order.email ?? "—"} />
          <InfoRow icon={<Car className="h-4 w-4" />} label="Kendaraan" value={order.vehicleModel ?? "—"} />
          <InfoRow icon={<MessageSquare className="h-4 w-4" />} label="Tanggal" value={formatDateTime(order.createdAt)} />
          {order.note && (
            <div className="sm:col-span-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted">Catatan</span>
              <p className="mt-1.5 border border-border bg-surface-sunken px-3.5 py-3 font-sans text-[13px] leading-relaxed text-fg-soft">
                {order.note}
              </p>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Item Pesanan" topAccent="red" bodyClassName="flex flex-col gap-0 md:px-[22px]">
          {order.items.map((item, i) => (
            <div
              key={`${item.productSlug}-${i}`}
              className="flex items-center justify-between gap-3 border-b border-border/70 py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <div className="truncate font-sans text-[13px] font-semibold text-fg">{item.productName}</div>
                <div className="font-mono text-[11px] text-fg-subtle">/{item.productSlug}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-sans text-[12px] text-fg-soft">
                  {formatIDR(item.price)} × {item.quantity}
                </div>
                <div className="font-display text-[13px] font-bold text-gold">
                  {formatIDR(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3.5">
            <span className="font-display text-xs font-bold uppercase tracking-[0.06em] text-fg-muted">Estimasi Total</span>
            <span className="font-display text-lg font-bold text-gold">{formatIDR(order.total)}</span>
          </div>
        </SectionCard>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-[18px] lg:sticky lg:top-5">
        <SectionCard title="Status Pesanan" bodyClassName="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[12.5px] text-fg-soft">Status saat ini</span>
            <StatusPill status={status} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => changeStatus(s)}
                disabled={isPending}
                className={cn(
                  "py-2.5 text-center font-display text-[11px] font-bold uppercase tracking-[0.05em] transition-colors disabled:opacity-50",
                  status === s ? "bg-red text-fg" : "border border-border bg-surface-sunken text-fg-subtle hover:text-fg"
                )}
              >
                {ORDER_STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="flex items-center justify-between gap-3 border border-red/30 bg-red/[0.08] px-4 py-3.5">
          <div>
            <div className="font-display text-[12.5px] font-bold text-red-soft">Hapus Pre-Order</div>
            <div className="mt-0.5 font-sans text-[11px] text-fg-subtle">Tidak bisa dibatalkan</div>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex-none border border-red/50 px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.06em] text-red-soft transition-colors hover:bg-red/10"
          >
            <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Hapus
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Pre-Order"
        description={`Pre-order dari "${order.customerName}" akan dihapus permanen.`}
        pending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center border border-border bg-surface-sunken text-gold">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.1em] text-fg-muted">{label}</div>
        <div className="truncate font-sans text-[13px] font-semibold text-fg">{value}</div>
        {sub && <div className="font-sans text-[11.5px] text-fg-subtle">{sub}</div>}
      </div>
    </div>
  );
}
