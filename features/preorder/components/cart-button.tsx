"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/preorder/store/cart-context";

/** CartButton — header trigger that opens the cart drawer and shows a live count badge. */
export function CartButton() {
  const { count, hydrated, toggle } = useCart();
  const showBadge = hydrated && count > 0;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Buka keranjang${showBadge ? ` (${count} item)` : ""}`}
      className="relative grid h-10 w-10 place-items-center text-fg transition-colors hover:text-gold"
    >
      <ShoppingCart className="h-5 w-5" />
      {showBadge ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center bg-red px-1 font-display text-[10px] font-bold leading-none text-fg">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
