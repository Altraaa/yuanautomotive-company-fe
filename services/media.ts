import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";

/** Two-step media upload (§12): upload → get uuid → send uuid in create/update payloads. */

export type UploadedMedia = {
  id: string;
  url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
};

export function uploadImage(form: FormData): Promise<UploadedMedia> {
  return apiClient.upload<UploadedMedia>(endpoints.media.upload, form, { auth: true });
}

export function deleteMedia(uuid: string): Promise<void> {
  return apiClient.delete<void>(endpoints.media.delete(uuid), { auth: true });
}
