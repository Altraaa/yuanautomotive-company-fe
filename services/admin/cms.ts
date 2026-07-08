import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import type { ApiCmsEntry } from "@/types/api/cms";

/**
 * CMS read (admin). Reads with `auth: true` (→ no-store) so the editor always
 * shows the latest saved data, not an ISR-cached copy. Returns `null` for a key
 * that doesn't exist yet (backend 404) — the editor then starts from an empty
 * object. Mutations live in `features/admin/cms-actions.ts`.
 */
export async function getCmsSection(key: string): Promise<Record<string, unknown> | null> {
  try {
    const entry = await apiClient.get<ApiCmsEntry>(endpoints.cms.bySection(key), { auth: true });
    return entry.data ?? {};
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    // Backend unreachable while wiring → treat as empty so the page still renders.
    return null;
  }
}

/** Known CMS section keys surfaced as quick-select chips in the editor. */
export const CMS_SECTIONS: { key: string; label: string }[] = [
  { key: "hero", label: "Hero Beranda" },
  { key: "about", label: "Tentang" },
  { key: "contact", label: "Kontak" },
  { key: "footer", label: "Footer" },
  { key: "stats", label: "Statistik" },
];
