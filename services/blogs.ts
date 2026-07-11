import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiBlogCard, ApiBlogDetail } from "@/types/api/blog";
import type { BlogCardData, BlogCategory, BlogDetailData } from "@/types/ui/blog";
import * as mock from "@/features/blog/data";

/** PUBLIC blog service (RSC), API-first with mock fallback. */

function toCard(b: ApiBlogCard): BlogCardData {
  return {
    slug: b.slug,
    title: b.title,
    category: b.category as BlogCategory,
    excerpt: b.excerpt,
    imageUrl: b.image_url ?? "/placeholder-product-1.png",
    publishedAt: b.published_at,
    readingMinutes: b.reading_minutes,
  };
}

function toDetail(b: ApiBlogDetail): BlogDetailData {
  return { ...toCard(b), contentHtml: b.content_html, author: b.author };
}

/** Backend `category` filter values (`@IsIn`-style map → invalid would 400). */
const BLOG_CATEGORY_VALUES = new Set(["tips", "rilis", "panduan", "berita"]);

export function getAllBlogCards(category?: string): Promise<BlogCardData[]> {
  const c =
    category && BLOG_CATEGORY_VALUES.has(category.toLowerCase())
      ? category.toLowerCase()
      : undefined;
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiBlogCard>>(endpoints.blogs.list, {
        revalidate: 3600,
        tags: ["blogs"],
        query: { limit: 50, category: c },
      });
      return res.items.map(toCard);
    },
    () => {
      const all = mock.getAllBlogCards();
      return c ? all.filter((b) => b.category.toLowerCase() === c) : all;
    }
  );
}

export function getBlogBySlug(slug: string): Promise<BlogDetailData | undefined> {
  return withFallback(
    async () => {
      try {
        const b = await apiClient.get<ApiBlogDetail>(endpoints.blogs.detailBySlug(slug), {
          revalidate: 3600,
          tags: ["blogs"],
        });
        return toDetail(b);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    () => mock.getBlogBySlug(slug)
  );
}

export function getRelatedBlogs(slug: string): Promise<BlogCardData[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiBlogCard>>(endpoints.blogs.list, {
        revalidate: 3600,
        tags: ["blogs"],
        query: { limit: 4 },
      });
      return res.items
        .map(toCard)
        .filter((b) => b.slug !== slug)
        .slice(0, 3);
    },
    () => mock.getRelatedBlogs(slug)
  );
}

export function getAllBlogSlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiBlogCard>>(endpoints.blogs.list, {
        revalidate: 3600,
        tags: ["blogs"],
        query: { limit: 100 },
      });
      return res.items.map((b) => b.slug);
    },
    () => mock.blogs.map((b) => b.slug)
  );
}
