import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import { clearAuthCookies } from "@/lib/auth-cookies";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiAdminNewsDetail, ApiAdminNewsRow } from "@/types/api/news";
import type { AdminNewsDetail, AdminNewsRow, NewsType } from "@/types/ui/news";
import type { NewsFormValues } from "@/features/admin/news-schema";

/**
 * ADMIN news service — server-side reads (RSC) + mappers + payload builder.
 * Talks to the live backend directly (no mock). A 401 ends the session and
 * bounces to /login; a 404 detail returns `undefined` → the page calls
 * `notFound()`. Mutations live in `features/admin/news-actions.ts`.
 */

async function endSessionIfUnauthorized(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    await clearAuthCookies();
    redirect("/login");
  }
}

function toRow(n: ApiAdminNewsRow): AdminNewsRow {
  return {
    uuid: n.id,
    slug: n.slug,
    title: n.title,
    type: n.type as NewsType,
    thumbnailUrl: n.thumbnail_url ?? undefined,
    instagramUrl: n.instagram_url,
    publishedAt: n.published_at ?? undefined,
    markNew: n.mark_new,
    status: n.is_published ? "Published" : "Draft",
  };
}

function toDetail(n: ApiAdminNewsDetail): AdminNewsDetail {
  return {
    uuid: n.id,
    slug: n.slug,
    title: n.title,
    type: n.type as NewsType,
    thumbnailUrl: n.thumbnail_url ?? undefined,
    thumbnailUuid: n.thumbnail_uuid ?? undefined,
    instagramUrl: n.instagram_url,
    publishedAt: n.published_at ?? undefined,
    markNew: n.mark_new,
    status: n.is_published ? "Published" : "Draft",
    caption: n.caption,
  };
}

export async function listAdminNews(params: { page?: number; limit?: number }) {
  const limit = params.limit ?? 100;
  try {
    const res = await apiClient.get<ApiPaginated<ApiAdminNewsRow>>(endpoints.news.adminList, {
      auth: true,
      query: { page: params.page ?? 1, limit },
    });
    return flattenPage(res, toRow);
  } catch (err) {
    await endSessionIfUnauthorized(err);
    throw err;
  }
}

export async function getAdminNews(uuid: string): Promise<AdminNewsDetail | undefined> {
  try {
    const n = await apiClient.get<ApiAdminNewsDetail>(endpoints.news.adminDetail(uuid), {
      auth: true,
    });
    return toDetail(n);
  } catch (err) {
    await endSessionIfUnauthorized(err);
    if (err instanceof ApiError && err.status === 404) return undefined;
    throw err;
  }
}

/** Map the editor form values → backend create/update payload. */
export function toNewsPayload(v: NewsFormValues, thumbnailUuid: string | null) {
  return {
    title: v.title,
    type: v.type,
    caption: v.caption,
    instagram_url: v.instagramUrl,
    mark_new: v.markNew,
    is_published: v.status === "Published",
    thumbnail_uuid: thumbnailUuid ?? undefined,
    published_at:
      v.status === "Published" ? (v.publishedAt || new Date().toISOString()) : undefined,
  };
}
