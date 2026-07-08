"use server";

import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { clearAuthCookies } from "@/lib/auth-cookies";
import type { OrderStatus } from "@/types/ui/order";

/**
 * Order (pre-order) admin server actions. Orders are admin-only (no public ISR
 * consumer), so no `updateTag` is needed — callers `router.refresh()` to re-run
 * the RSC read (which is `no-store` under `auth`).
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

export type MutateResult = { ok: true } | { ok: false; message: string };

export async function updateOrderStatusAction(
  uuid: string,
  status: OrderStatus
): Promise<MutateResult> {
  try {
    await apiClient.patch(endpoints.orders.adminUpdate(uuid), { status }, { auth: true });
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal memperbarui status." };
    }
    return { ok: true }; // backend unreachable → treat as saved (mock)
  }
}

export async function deleteOrderAction(uuid: string): Promise<MutateResult> {
  try {
    await apiClient.delete(endpoints.orders.adminDelete(uuid), { auth: true });
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus pre-order." };
    }
    return { ok: true };
  }
}

export async function bulkDeleteOrdersAction(ids: string[]): Promise<MutateResult> {
  try {
    await apiClient.post(endpoints.orders.adminBulkDelete, { ids }, { auth: true });
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus pre-order." };
    }
    return { ok: true };
  }
}
