"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { toNewsPayload } from "@/services/admin/news";
import type { NewsFormValues } from "@/features/admin/news-schema";

/**
 * News admin server actions (create / update / delete / bulk delete). The public
 * news pages are ISR-cached under the `news` tag, so every mutation revalidates
 * it → edits appear on the next public load. Thumbnails use the shared two-step
 * media flow (`uploadImageAction` in features/admin/actions.ts).
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

export type SaveResult = { ok: true } | { ok: false; message: string };
export type MutateResult = { ok: true } | { ok: false; message: string };

export async function saveNewsAction(
  uuid: string | null,
  values: NewsFormValues,
  thumbnailUuid: string | null = null
): Promise<SaveResult> {
  try {
    const payload = toNewsPayload(values, thumbnailUuid);
    if (uuid) {
      await apiClient.patch(endpoints.news.adminUpdate(uuid), payload, { auth: true });
    } else {
      await apiClient.post(endpoints.news.adminCreate, payload, { auth: true });
    }
    updateTag("news");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menyimpan konten." };
    }
    return { ok: false, message: "Gagal terhubung ke server. Coba lagi." };
  }
}

export async function deleteNewsAction(uuid: string): Promise<MutateResult> {
  try {
    await apiClient.delete(endpoints.news.adminDelete(uuid), { auth: true });
    updateTag("news");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus konten." };
    }
    return { ok: false, message: "Gagal terhubung ke server. Coba lagi." };
  }
}

export async function bulkDeleteNewsAction(ids: string[]): Promise<MutateResult> {
  try {
    await apiClient.post(endpoints.news.adminBulkDelete, { ids }, { auth: true });
    updateTag("news");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus konten." };
    }
    return { ok: false, message: "Gagal terhubung ke server. Coba lagi." };
  }
}
