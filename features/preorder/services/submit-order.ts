import type { PreorderFormValues } from "@/features/preorder/schema";
import type { CartItem } from "@/types/ui/cart";

/**
 * submitPreorder — sends a multi-item pre-order to the backend.
 *
 * NOTE: The NestJS backend is not wired yet. When `NEXT_PUBLIC_API_URL` is set,
 * swap the mock below for:
 *
 *   import { apiClient } from "@/services/api";
 *   import { endpoints } from "@/lib/endpoint";
 *   return apiClient.post(endpoints.orders.create, {
 *     customer_name: values.name,
 *     phone: values.phone,
 *     vehicle_model: values.vehicleModel,
 *     note: values.note,
 *     items: items.map((i) => ({ product_slug: i.slug, quantity: i.qty })),
 *   });
 *
 * The mapper keeps UI (camelCase) → API (snake_case) separation intact.
 */
export async function submitPreorder(
  values: PreorderFormValues,
  items: CartItem[]
): Promise<void> {
  // Simulate network latency for a realistic UX in the mock build.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (items.length === 0) {
    throw new Error("Keranjang masih kosong.");
  }
  if (!values.name || !values.phone) {
    throw new Error("Data tidak lengkap.");
  }
  // Mock success — no-op until the backend endpoint is available.
}
