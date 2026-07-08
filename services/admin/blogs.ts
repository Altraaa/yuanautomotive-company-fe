import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiAdminBlogDetail, ApiAdminBlogRow } from "@/types/api/blog";
import type { AdminBlogDetail, AdminBlogRow, BlogCategory } from "@/types/ui/blog";
import type { BlogFormValues } from "@/features/admin/blog-schema";
import * as mock from "@/features/blog/data";

/**
 * ADMIN blog service — server-side reads (RSC) + mappers + payload builder.
 * Mutations live in `features/admin/blog-actions.ts`. Falls back to the mock blog
 * set (uuid = slug) while the backend is being wired.
 */

function toRow(b: ApiAdminBlogRow): AdminBlogRow {
  return {
    uuid: b.id,
    slug: b.slug,
    title: b.title,
    category: b.category as BlogCategory,
    excerpt: b.excerpt,
    imageUrl: b.image_url ?? undefined,
    publishedAt: b.published_at ?? undefined,
    readingMinutes: b.reading_minutes,
    status: b.is_published ? "Published" : "Draft",
    author: b.author,
  };
}

function toDetail(b: ApiAdminBlogDetail): AdminBlogDetail {
  return {
    uuid: b.id,
    slug: b.slug,
    title: b.title,
    category: b.category as BlogCategory,
    excerpt: b.excerpt,
    imageUrl: b.image_url ?? undefined,
    publishedAt: b.published_at ?? undefined,
    readingMinutes: b.reading_minutes,
    status: b.is_published ? "Published" : "Draft",
    author: b.author,
    contentHtml: b.content_html,
    coverUuid: b.cover_uuid ?? undefined,
    coverUrl: b.image_url ?? undefined,
  };
}

export function listAdminBlogs(params: { page?: number; limit?: number }) {
  const limit = params.limit ?? 100;
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiAdminBlogRow>>(endpoints.blogs.adminList, {
        auth: true,
        query: { page: params.page ?? 1, limit },
      });
      return flattenPage(res, toRow);
    },
    () => {
      const items: AdminBlogRow[] = mock.blogs.map((b) => ({
        uuid: b.slug,
        slug: b.slug,
        title: b.title,
        category: b.category,
        excerpt: b.excerpt,
        imageUrl: b.imageUrl,
        publishedAt: b.publishedAt,
        readingMinutes: b.readingMinutes,
        status: "Published",
        author: b.author,
      }));
      return { items, total: items.length, totalPages: 1, page: 1 };
    },
    { alwaysFallback: true }
  );
}

export function getAdminBlog(uuid: string): Promise<AdminBlogDetail | undefined> {
  return withFallback(
    async () => {
      try {
        const b = await apiClient.get<ApiAdminBlogDetail>(endpoints.blogs.adminDetail(uuid), {
          auth: true,
        });
        return toDetail(b);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    () => {
      const b = mock.blogs.find((x) => x.slug === uuid);
      if (!b) return undefined;
      return {
        uuid: b.slug,
        slug: b.slug,
        title: b.title,
        category: b.category,
        excerpt: b.excerpt,
        imageUrl: b.imageUrl,
        publishedAt: b.publishedAt,
        readingMinutes: b.readingMinutes,
        status: "Published" as const,
        author: b.author,
        contentHtml: b.contentHtml,
        coverUrl: b.imageUrl,
      };
    },
    { alwaysFallback: true }
  );
}

/** Map the editor form values → backend create/update payload. */
export function toBlogPayload(v: BlogFormValues, coverUuid: string | null) {
  return {
    title: v.title,
    category: v.category,
    excerpt: v.excerpt,
    content_html: v.contentHtml,
    author: v.author,
    reading_minutes: Number(v.readingMinutes) || 1,
    is_published: v.status === "Published",
    cover_uuid: coverUuid ?? undefined,
    published_at:
      v.status === "Published" ? (v.publishedAt || new Date().toISOString()) : undefined,
  };
}
