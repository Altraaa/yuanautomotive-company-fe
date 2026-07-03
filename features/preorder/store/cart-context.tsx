"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/ui/cart";
import type { ProductCardData } from "@/types/ui/product";

const STORAGE_KEY = "yda-cart-v1";
const MAX_QTY = 99;

type CartContextValue = {
  items: CartItem[];
  /** Total units across all line items. */
  count: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  addItem: (product: ProductCardData, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(qty: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.round(qty)));
}

/**
 * CartProvider — holds the pre-order basket in client state, persisted to
 * localStorage so it survives navigation/reload. Also owns the cart drawer's
 * open/close state so any "add to cart" action can reveal it.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration to avoid clobbering with []).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage may be unavailable (private mode) — non-fatal
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: ProductCardData, qty = 1) => {
    const add = clampQty(qty);
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: clampQty(i.qty + add) } : i
        );
      }
      const next: CartItem = {
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        qty: add,
      };
      return [...prev, next];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, qty: clampQty(qty) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.qty, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      setQty,
      clear,
      open,
      close,
      toggle,
    }),
    [items, count, subtotal, isOpen, hydrated, addItem, removeItem, setQty, clear, open, close, toggle]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
