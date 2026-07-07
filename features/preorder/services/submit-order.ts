"use server";

import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import type { PreorderFormValues } from "@/features/preorder/schema";
import type { CartItem } from "@/types/ui/cart";

/**
 * submitPreorder — posts a multi-item pre-order (items from the cart, not form
 * fields). Falls back to a mock success when the backend is unreachable.
 */
export async function submitPreorder(
  values: PreorderFormValues,
  items: CartItem[]
): Promise<void> {
  if (items.length === 0) throw new Error("Keranjang masih kosong.");

  try {
    await apiClient.post(endpoints.orders.create, {
      customer_name: values.name,
      phone: values.phone,
      vehicle_model: values.vehicleModel,
      note: values.note,
      items: items.map((i) => ({ product_slug: i.slug, quantity: i.qty })),
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Backend unreachable → mock success.
  }
}
