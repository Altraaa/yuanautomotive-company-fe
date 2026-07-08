"use server";

import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { clearAuthCookies } from "@/lib/auth-cookies";
import type { ContactStatus } from "@/types/ui/contact";

/**
 * Contact (lead) admin server actions. Admin-only data (no public ISR consumer),
 * so callers `router.refresh()` after a mutation to re-run the RSC read.
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

export type MutateResult = { ok: true } | { ok: false; message: string };

export async function updateContactStatusAction(
  uuid: string,
  status: ContactStatus
): Promise<MutateResult> {
  try {
    await apiClient.patch(endpoints.contacts.adminUpdate(uuid), { status }, { auth: true });
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal memperbarui status." };
    }
    return { ok: true };
  }
}

export async function deleteContactAction(uuid: string): Promise<MutateResult> {
  try {
    await apiClient.delete(endpoints.contacts.adminDelete(uuid), { auth: true });
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus lead." };
    }
    return { ok: true };
  }
}

export async function bulkDeleteContactsAction(ids: string[]): Promise<MutateResult> {
  try {
    await apiClient.post(endpoints.contacts.adminBulkDelete, { ids }, { auth: true });
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus lead." };
    }
    return { ok: true };
  }
}
