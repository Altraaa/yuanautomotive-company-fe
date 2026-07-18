"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { toFaqPayload } from "@/services/admin/faqs";
import type { FaqFormValues } from "@/features/admin/faq-schema";

/**
 * FAQ admin server actions (create / update / delete / bulk delete). The public
 * FAQ page is ISR-cached under the `faqs` tag, so every mutation revalidates it
 * → edits appear on the next public load. (The backend also fires its own ISR
 * revalidate; this keeps the FE consistent immediately after a write.)
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

export type SaveResult = { ok: true } | { ok: false; message: string };
export type MutateResult = { ok: true } | { ok: false; message: string };

export async function saveFaqAction(
  uuid: string | null,
  values: FaqFormValues
): Promise<SaveResult> {
  try {
    const payload = toFaqPayload(values);
    if (uuid) {
      await apiClient.patch(endpoints.faqs.adminUpdate(uuid), payload, { auth: true });
    } else {
      await apiClient.post(endpoints.faqs.adminCreate, payload, { auth: true });
    }
    updateTag("faqs");
    // Purge admin route cache so the edit shows immediately on navigate-back.
    revalidatePath("/dashboard/faq", "layout");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menyimpan FAQ." };
    }
    return { ok: false, message: "Gagal terhubung ke server. Coba lagi." };
  }
}

export async function deleteFaqAction(uuid: string): Promise<MutateResult> {
  try {
    await apiClient.delete(endpoints.faqs.adminDelete(uuid), { auth: true });
    updateTag("faqs");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus FAQ." };
    }
    return { ok: false, message: "Gagal terhubung ke server. Coba lagi." };
  }
}

export async function bulkDeleteFaqAction(ids: string[]): Promise<MutateResult> {
  try {
    await apiClient.post(endpoints.faqs.adminBulkDelete, { ids }, { auth: true });
    updateTag("faqs");
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus FAQ." };
    }
    return { ok: false, message: "Gagal terhubung ke server. Coba lagi." };
  }
}
