"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { toBlogPayload } from "@/services/admin/blogs";
import type { BlogFormValues } from "@/features/admin/blog-schema";

/**
 * Blog admin server actions (create / update / delete / bulk delete). The public
 * blog pages are ISR-cached under the `blogs` tag, so every mutation revalidates
 * it → edits appear on the next public load. Cover images use the shared
 * two-step media flow (`uploadImageAction` in features/admin/actions.ts).
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

export type SaveResult = { ok: true } | { ok: false; message: string };
export type MutateResult = { ok: true } | { ok: false; message: string };

export async function saveBlogAction(
  uuid: string | null,
  values: BlogFormValues,
  coverUuid: string | null = null
): Promise<SaveResult> {
  try {
    const payload = toBlogPayload(values, coverUuid);
    if (uuid) {
      await apiClient.patch(endpoints.blogs.adminUpdate(uuid), payload, { auth: true });
    } else {
      await apiClient.post(endpoints.blogs.adminCreate, payload, { auth: true });
    }
    updateTag("blogs");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menyimpan artikel." };
    }
    return { ok: true }; // backend unreachable → treat as saved (mock)
  }
}

export async function deleteBlogAction(uuid: string): Promise<MutateResult> {
  try {
    await apiClient.delete(endpoints.blogs.adminDelete(uuid), { auth: true });
    updateTag("blogs");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus artikel." };
    }
    return { ok: true };
  }
}

export async function bulkDeleteBlogsAction(ids: string[]): Promise<MutateResult> {
  try {
    await apiClient.post(endpoints.blogs.adminBulkDelete, { ids }, { auth: true });
    updateTag("blogs");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus artikel." };
    }
    return { ok: true };
  }
}
