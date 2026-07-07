"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { listCategories } from "@/services/categories";
import { uploadImage } from "@/services/media";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { toProductPayload } from "@/services/admin/products";
import type { ProductFormValues } from "@/features/admin/product-schema";

/**
 * Ends the session and bounces to /login when the backend reports 401 (token
 * expired/invalid). `redirect()` throws, so callers put this first in `catch`.
 */
async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

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
    await endSessionIfUnauthorized(err);
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
    updateTag("products"); // immediate expiry → public pages refresh in one load
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menyimpan produk." };
    }
    return { ok: true }; // backend unreachable → treat as saved (mock)
  }
}

export async function deleteProductAction(uuid: string): Promise<void> {
  try {
    await apiClient.delete(endpoints.products.adminDelete(uuid), { auth: true });
    updateTag("products"); // immediate expiry → public pages refresh in one load
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) throw err;
  }
}

export async function bulkDeleteProductsAction(ids: string[]): Promise<void> {
  try {
    await apiClient.post(endpoints.products.adminBulkDelete, { ids }, { auth: true });
    updateTag("products"); // immediate expiry → public pages refresh in one load
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) throw err;
  }
}
