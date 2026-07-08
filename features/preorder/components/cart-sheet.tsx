"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { PrivacyNotice } from "@/components/common/privacy-notice";
import { PreorderForm } from "@/features/preorder/components/preorder-form";
import { useCart } from "@/features/preorder/store/cart-context";
import { cn, formatIDR } from "@/lib/utils";

type Stage = "cart" | "checkout";

/**
 * CartSheet — right-side pre-order drawer. Two stages: the item list (adjust
 * quantities) and the checkout form. Rendered once in the public layout.
 */
export function CartSheet() {
  const { items, isOpen, close, removeItem, setQty, subtotal, count } = useCart();
  const [stage, setStage] = useState<Stage>("cart");
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  // Keep the drawer mounted through its slide-out animation, then unmount and
  // reset to the cart list stage.
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const t = window.setTimeout(() => {
      setMounted(false);
      setStage("cart");
    }, 260);
    return () => window.clearTimeout(t);
  }, [isOpen, mounted]);

  // Lock body scroll while the drawer is on screen.
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // Close via Escape.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!mounted) return null;

  const empty = items.length === 0;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Keranjang pre-order">
      <button
        type="button"
        aria-label="Tutup keranjang"
        onClick={close}
        className={cn(
          "absolute inset-0 bg-surface-black/70",
          closing ? "animate-fade-out" : "animate-fade-in"
        )}
      />

      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l-2 border-l-gold bg-bg shadow-2xl shadow-black/50",
          closing ? "animate-slide-out-right" : "animate-slide-in-right"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-gold" />
            <span className="font-display text-lg font-bold italic uppercase text-fg">
              {stage === "cart" ? "Keranjang" : "Pre-Order"}
            </span>
            {count > 0 ? (
              <span className="font-sans text-sm text-fg-muted">({count})</span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="grid h-9 w-9 place-items-center text-fg-muted transition-colors hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {empty ? (
          <EmptyState onClose={close} />
        ) : stage === "checkout" ? (
          <PreorderForm onBack={() => setStage("cart")} />
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {items.map((item) => (
                <li key={item.slug} className="flex animate-fade-up gap-3 p-4">
                  <Link
                    href={`/produk/${item.slug}`}
                    onClick={close}
                    className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden border border-border bg-surface"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/produk/${item.slug}`}
                        onClick={close}
                        className="font-sans text-sm font-semibold leading-snug text-fg hover:text-gold"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        aria-label={`Hapus ${item.name}`}
                        className="shrink-0 text-fg-subtle transition-colors hover:text-red-soft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="font-display text-sm font-bold text-gold">
                      {formatIDR(item.price)}
                    </span>

                    <div className="mt-auto flex items-center border border-border bg-surface-sunken w-fit">
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                        aria-label="Kurangi jumlah"
                        className="grid h-8 w-8 place-items-center text-fg-muted transition-colors hover:text-fg"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="grid w-9 place-items-center font-display text-sm font-bold text-fg">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty + 1)}
                        aria-label="Tambah jumlah"
                        className="grid h-8 w-8 place-items-center text-fg-muted transition-colors hover:text-fg"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex flex-col gap-4 border-t border-border p-5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-fg-muted">Subtotal</span>
                <span className="font-display text-xl font-bold text-gold">
                  {formatIDR(subtotal)}
                </span>
              </div>
              <CtaButton onClick={() => setStage("checkout")} size="lg" className="w-full">
                Lanjut Pre-Order
              </CtaButton>
              <p className="text-center font-sans text-xs text-fg-subtle">
                Harga belum termasuk ongkir. Tim kami mengonfirmasi total akhir.
              </p>
              <PrivacyNotice
                lead="Melanjutkan pre-order berarti Anda menyetujui "
                className="justify-center text-center"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-border bg-surface text-fg-subtle">
        <ShoppingCart className="h-7 w-7" />
      </span>
      <h3 className="font-display text-lg font-bold italic uppercase text-fg">
        Keranjang Kosong
      </h3>
      <p className="font-sans text-sm text-fg-muted">
        Belum ada produk. Jelajahi katalog dan tambahkan beberapa sekaligus.
      </p>
      <CtaButton href="/produk" onClick={onClose} variant="outline" className="w-full">
        Lihat Produk
      </CtaButton>
    </div>
  );
}
