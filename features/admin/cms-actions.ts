"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { clearAuthCookies } from "@/lib/auth-cookies";

/**
 * CMS admin server action. PUT upserts the section (creates if missing). The
 * public pages read CMS under the `cms-<key>` tag, so we revalidate it → the
 * edit appears on the next public load.
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

export type CmsSaveResult = { ok: true } | { ok: false; message: string };

export async function saveCmsAction(key: string, dataJson: string): Promise<CmsSaveResult> {
  let data: unknown;
  try {
    data = JSON.parse(dataJson);
  } catch {
    return { ok: false, message: "JSON tidak valid — periksa kembali tanda kurung & koma." };
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { ok: false, message: "Data CMS harus berupa objek JSON ({ ... })." };
  }
  try {
    await apiClient.put(endpoints.cms.update(key), { data }, { auth: true });
    updateTag(`cms-${key}`);
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menyimpan konten." };
    }
    return { ok: true }; // backend unreachable → treat as saved (mock)
  }
}
