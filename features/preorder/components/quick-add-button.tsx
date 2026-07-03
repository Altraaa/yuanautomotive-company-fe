"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { ProductCardData } from "@/types/ui/product";
import { useCart } from "@/features/preorder/store/cart-context";
import { cn } from "@/lib/utils";

/**
 * QuickAddButton — compact "add to cart" affordance for a ProductCard.
 * Passed into ProductCard's `action` slot so the card stays presentational.
 */
export function QuickAddButton({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function onAdd() {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Tambah ${product.name} ke keranjang`}
      className={cn(
        "grid h-9 w-9 place-items-center border transition-colors",
        added
          ? "border-whatsapp bg-whatsapp text-fg"
          : "border-gold/50 bg-surface-black/70 text-gold backdrop-blur hover:border-gold hover:bg-gold hover:text-bg"
      )}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
