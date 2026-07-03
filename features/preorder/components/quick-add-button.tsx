"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { ProductCardData } from "@/types/ui/product";
import { CtaButton } from "@/components/common/cta-button";
import { useCart } from "@/features/preorder/store/cart-context";
import { cn } from "@/lib/utils";

/**
 * QuickAddButton — full-width red "add to cart" CTA for a ProductCard footer.
 * Passed into ProductCard's `action` slot so the card stays presentational.
 * Icon + label make the affordance explicit; a transient check confirms the add.
 */
export function QuickAddButton({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function onAdd() {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <CtaButton
      type="button"
      onClick={onAdd}
      variant={added ? "whatsapp" : "primary"}
      size="sm"
      aria-label={`Tambah ${product.name} ke keranjang`}
      className={cn("w-full", added && "pointer-events-none")}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Ditambahkan
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Tambah ke Keranjang
        </>
      )}
    </CtaButton>
  );
}
