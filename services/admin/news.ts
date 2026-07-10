import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiAdminNewsDetail, ApiAdminNewsRow } from "@/types/api/news";
import type { AdminNewsDetail, AdminNewsRow, NewsType } from "@/types/ui/news";
import type { NewsFormValues } from "@/features/admin/news-schema";
import * as mock from "@/features/news/data";

/**
 * ADMIN news service — server-side reads (RSC) + mappers + payload builder.
 * Mutations live in `features/admin/news-actions.ts`. Falls back to the mock news
 * set (uuid = slug) while the backend is being wired.
 */

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

export function listAdminNews(params: { page?: number; limit?: number }) {
  const limit = params.limit ?? 100;
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiAdminNewsRow>>(endpoints.news.adminList, {
        auth: true,
        query: { page: params.page ?? 1, limit },
      });
      return flattenPage(res, toRow);
    },
    () => {
      const items: AdminNewsRow[] = mock.news.map((n) => ({
        uuid: n.slug,
        slug: n.slug,
        title: n.title,
        type: n.type,
        thumbnailUrl: n.thumbnailUrl,
        instagramUrl: n.instagramUrl,
        publishedAt: n.publishedAt,
        markNew: n.markNew,
        status: "Published",
      }));
      return { items, total: items.length, totalPages: 1, page: 1 };
    },
    { alwaysFallback: true }
  );
}

export function getAdminNews(uuid: string): Promise<AdminNewsDetail | undefined> {
  return withFallback(
    async () => {
      try {
        const n = await apiClient.get<ApiAdminNewsDetail>(endpoints.news.adminDetail(uuid), {
          auth: true,
        });
        return toDetail(n);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    () => {
      const n = mock.news.find((x) => x.slug === uuid);
      if (!n) return undefined;
      return {
        uuid: n.slug,
        slug: n.slug,
        title: n.title,
        type: n.type,
        thumbnailUrl: n.thumbnailUrl,
        instagramUrl: n.instagramUrl,
        publishedAt: n.publishedAt,
        markNew: n.markNew,
        status: "Published" as const,
        caption: n.caption,
      };
    },
    { alwaysFallback: true }
  );
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
