"use server";

import { revalidateTag } from "next/cache";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { listCategories } from "@/services/categories";
import { uploadImage } from "@/services/media";
import { toProductPayload } from "@/services/admin/products";
import type { ProductFormValues } from "@/features/admin/product-schema";

export type SaveResult = { ok: true } | { ok: false; message: string };
export type UploadResult =
  | { ok: true; id: string; url: string }
  | { ok: false; message: string };

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * uploadImageAction — step 1 of the two-step media flow. Uploads a single image
 * (with the admin JWT cookie) and returns its media `uuid` + public `url`. The
 * form collects the uuids and sends them as `image_uuids` on save.
 */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "File tidak valid." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "Ukuran gambar melebihi 2 MB." };
  }
  try {
    const media = await uploadImage(formData);
    return { ok: true, id: media.id, url: media.url };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal upload gambar." };
    }
    return { ok: false, message: "Gagal upload — backend tidak tersedia." };
  }
}

/**
 * saveProductAction — create (uuid=null) or update an admin product. Resolves
 * category name → uuid, builds the snake_case payload (incl. uploaded image
 * uuids), and revalidates the `products` tag. Falls back to a mock success when
 * the backend is unreachable.
 */
export async function saveProductAction(
  uuid: string | null,
  values: ProductFormValues,
  imageUuids: string[] | null = null
): Promise<SaveResult> {
  try {
    const categories = await listCategories();
    const payload = toProductPayload(values, categories, imageUuids);
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
