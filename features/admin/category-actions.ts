"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { clearAuthCookies } from "@/lib/auth-cookies";
import type { ApiCategory } from "@/types/api/category";
import type { CategoryOption } from "@/services/categories";

/**
 * Category admin server actions (create / update / delete). Categories drive the
 * product filter dropdowns, so every mutation revalidates the `products` tag.
 * Delete is SUPERADMIN-only on the backend — a 403 surfaces as a normal error.
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

export type CategoryResult =
  | { ok: true; category: CategoryOption }
  | { ok: false; message: string };

export type MutateResult = { ok: true } | { ok: false; message: string };

function toOption(c: ApiCategory): CategoryOption {
  return { uuid: c.id, name: c.name, slug: c.slug };
}

export async function createCategoryAction(name: string): Promise<CategoryResult> {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 120) {
    return { ok: false, message: "Nama kategori harus 2–120 karakter." };
  }
  try {
    const created = await apiClient.post<ApiCategory>(
      endpoints.categories.create,
      { name: trimmed },
      { auth: true }
    );
    updateTag("products");
    return { ok: true, category: toOption(created) };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menambah kategori." };
    }
    return { ok: false, message: "Backend tidak tersedia — kategori tidak tersimpan." };
  }
}

export async function updateCategoryAction(uuid: string, name: string): Promise<CategoryResult> {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 120) {
    return { ok: false, message: "Nama kategori harus 2–120 karakter." };
  }
  try {
    const updated = await apiClient.patch<ApiCategory>(
      endpoints.categories.update(uuid),
      { name: trimmed },
      { auth: true }
    );
    updateTag("products");
    return { ok: true, category: toOption(updated) };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal memperbarui kategori." };
    }
    return { ok: false, message: "Backend tidak tersedia — perubahan tidak tersimpan." };
  }
}

export async function deleteCategoryAction(uuid: string): Promise<MutateResult> {
  try {
    await apiClient.delete(endpoints.categories.delete(uuid), { auth: true });
    updateTag("products");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus kategori." };
    }
    return { ok: false, message: "Backend tidak tersedia — kategori tidak dihapus." };
  }
}
