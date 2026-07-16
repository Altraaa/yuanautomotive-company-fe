import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import { clearAuthCookies } from "@/lib/auth-cookies";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiAdminFaqDetail, ApiAdminFaqRow } from "@/types/api/faq";
import type { AdminFaqDetail, AdminFaqRow } from "@/types/ui/faq";
import type { FaqFormValues } from "@/features/admin/faq-schema";

/**
 * ADMIN FAQ service — server-side reads (RSC) + mappers + payload builder.
 * Talks to the live backend directly (no mock). A 401 ends the session and
 * bounces to /login; a 404 detail returns `undefined` → the page calls
 * `notFound()`. Mutations live in `features/admin/faq-actions.ts`.
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

function toRow(f: ApiAdminFaqRow): AdminFaqRow {
  return {
    uuid: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    sortOrder: f.sort_order,
    status: f.is_published ? "Published" : "Draft",
    createdAt: f.created_at,
  };
}

function toDetail(f: ApiAdminFaqDetail): AdminFaqDetail {
  return toRow(f);
}

export async function listAdminFaqs(params: { page?: number; limit?: number }) {
  const limit = params.limit ?? 100;
  try {
    const res = await apiClient.get<ApiPaginated<ApiAdminFaqRow>>(endpoints.faqs.adminList, {
      auth: true,
      query: { page: params.page ?? 1, limit },
    });
    return flattenPage(res, toRow);
  } catch (err) {
    await endSessionIfUnauthorized(err);
    throw err;
  }
}

/** Distinct, sorted category labels from every FAQ — powers editor autocomplete. */
export async function listAdminFaqCategories(): Promise<string[]> {
  try {
    const { items } = await listAdminFaqs({ page: 1, limit: 200 });
    const set = new Set<string>();
    items.forEach((f) => {
      const c = f.category?.trim();
      if (c) set.add(c);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  } catch {
    // Autocomplete is non-critical — never block the editor if this read fails.
    return [];
  }
}

export async function getAdminFaq(uuid: string): Promise<AdminFaqDetail | undefined> {
  try {
    const f = await apiClient.get<ApiAdminFaqDetail>(endpoints.faqs.adminDetail(uuid), {
      auth: true,
    });
    return toDetail(f);
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError && err.status === 404) return undefined;
    throw err;
  }
}

/** Map the editor form values → backend create/update payload. */
export function toFaqPayload(v: FaqFormValues) {
  const category = v.category.trim();
  return {
    question: v.question,
    answer: v.answer,
    // Empty input → null clears the grouping label on the backend.
    category: category.length > 0 ? category : null,
    sort_order: v.sortOrder,
    is_published: v.status === "Published",
  };
}
