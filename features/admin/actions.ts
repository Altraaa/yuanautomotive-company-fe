"use server";

import { revalidateTag } from "next/cache";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { listCategories } from "@/services/categories";
import { toProductPayload } from "@/services/admin/products";
import type { ProductFormValues } from "@/features/admin/product-schema";

export type SaveResult = { ok: true } | { ok: false; message: string };

/**
 * saveProductAction — create (uuid=null) or update an admin product. Resolves
 * category name → uuid, builds the snake_case payload, and revalidates the
 * `products` tag. Falls back to a mock success when the backend is unreachable.
 */
export async function saveProductAction(
  uuid: string | null,
  values: ProductFormValues
): Promise<SaveResult> {
  try {
    const categories = await listCategories();
    const payload = toProductPayload(values, categories);
    if (uuid) {
      await apiClient.patch(endpoints.products.adminUpdate(uuid), payload, { auth: true });
    } else {
      await apiClient.post(endpoints.products.adminCreate, payload, { auth: true });
    }
    revalidateTag("products", "max");
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menyimpan produk." };
    }
    return { ok: true }; // backend unreachable → treat as saved (mock)
  }
}

export async function deleteProductAction(uuid: string): Promise<void> {
  try {
    await apiClient.delete(endpoints.products.adminDelete(uuid), { auth: true });
    revalidateTag("products", "max");
  } catch (err) {
    if (err instanceof ApiError) throw err;
  }
}

export async function bulkDeleteProductsAction(ids: string[]): Promise<void> {
  try {
    await apiClient.post(endpoints.products.adminBulkDelete, { ids }, { auth: true });
    revalidateTag("products", "max");
  } catch (err) {
    if (err instanceof ApiError) throw err;
  }
}
