/**
 * UI cart types — the pre-order basket held in client state (localStorage-backed).
 * A CartItem is a ProductCard snapshot plus a quantity.
 */
import type { ProductCategory } from "@/types/ui/product";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  qty: number;
};
