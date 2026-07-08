"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/services/api";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { deleteMedia, uploadImage } from "@/services/media";

/**
 * Media library server actions — a thin wrapper over the two-step media flow used
 * directly by the Media page (upload + copy URL + delete). Product/blog forms use
 * `uploadImageAction` in features/admin/actions.ts.
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB (backend default)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];

export type MediaUploadResult =
  | { ok: true; id: string; url: string; filename: string; sizeBytes: number; mimeType: string }
  | { ok: false; message: string };

export async function uploadMediaAction(formData: FormData): Promise<MediaUploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "File tidak valid." };
  }
  if (!ALLOWED.includes(file.type)) {
    return { ok: false, message: "Format tidak didukung (JPG/PNG/WebP/AVIF/PDF)." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "Ukuran file melebihi 10 MB." };
  }
  try {
    const media = await uploadImage(formData);
    return {
      ok: true,
      id: media.id,
      url: media.url,
      filename: media.filename,
      sizeBytes: media.size_bytes,
      mimeType: media.mime_type,
    };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal mengunggah file." };
    }
    return { ok: false, message: "Backend tidak tersedia — file tidak diunggah." };
  }
}

export type MediaDeleteResult = { ok: true } | { ok: false; message: string };

export async function deleteMediaAction(uuid: string): Promise<MediaDeleteResult> {
  try {
    await deleteMedia(uuid);
    return { ok: true };
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Gagal menghapus file." };
    }
    return { ok: false, message: "Backend tidak tersedia — file tidak dihapus." };
  }
}
