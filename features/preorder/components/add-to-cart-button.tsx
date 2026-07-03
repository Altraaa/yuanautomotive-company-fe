"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { ProductCardData } from "@/types/ui/product";
import { CtaButton } from "@/components/common/cta-button";
import { useCart } from "@/features/preorder/store/cart-context";

/**
 * AddToCartButton — product-detail action: quantity stepper + add to the
 * pre-order basket, then reveal the cart drawer. Leaf client component so the
 * detail page stays an RSC.
 */
export function AddToCartButton({ product }: { product: ProductCardData }) {
  const { addItem, open } = useCart();
  const [qty, setQty] = useState(1);

  function onAdd() {
    addItem(product, qty);
    setQty(1);
    open();
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div className="flex items-center border border-border bg-surface-sunken">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Kurangi jumlah"
          className="grid h-[52px] w-12 place-items-center text-fg-muted transition-colors hover:text-fg"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span
          aria-live="polite"
          className="grid w-12 place-items-center font-display text-lg font-bold text-fg"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Tambah jumlah"
          className="grid h-[52px] w-12 place-items-center text-fg-muted transition-colors hover:text-fg"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <CtaButton onClick={onAdd} size="lg" className="w-full sm:w-auto">
        <ShoppingCart className="h-4 w-4" />
        Tambah ke Keranjang
      </CtaButton>
    </div>
  );
}
