import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiNewsCard, ApiNewsDetail } from "@/types/api/news";
import type { NewsCardData, NewsDetailData, NewsType } from "@/types/ui/news";
import * as mock from "@/features/news/data";

/**
 * PUBLIC news service (RSC), API-first with mock fallback. Instagram content.
 *
 * Backend `/news` is live, so reads hit it directly. `withFallback` (no
 * `alwaysFallback`) keeps the site up only when the backend is truly down
 * (5xx / unreachable) — 4xx propagate normally (detail 404 → `notFound()`),
 * exactly like the public blog/product services.
 */

function toCard(n: ApiNewsCard): NewsCardData {
  return {
    slug: n.slug,
    title: n.title,
    type: n.type as NewsType,
    thumbnailUrl: n.thumbnail_url ?? "/placeholder-product-1.png",
    instagramUrl: n.instagram_url,
    publishedAt: n.published_at,
    markNew: n.mark_new,
  };
}

function toDetail(n: ApiNewsDetail): NewsDetailData {
  return { ...toCard(n), caption: n.caption };
}

/** Backend `type` filter values (`@IsIn` there → invalid values would 400). */
const NEWS_TYPE_VALUES = new Set(["reels", "poster"]);

export function getAllNewsCards(type?: string): Promise<NewsCardData[]> {
  const t = type && NEWS_TYPE_VALUES.has(type.toLowerCase()) ? type.toLowerCase() : undefined;
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiNewsCard>>(endpoints.news.list, {
        revalidate: 3600,
        tags: ["news"],
        query: { limit: 50, type: t },
      });
      return res.items.map(toCard);
    },
    () => {
      const all = mock.getAllNewsCards();
      return t ? all.filter((n) => n.type.toLowerCase() === t) : all;
    }
  );
}

export function getNewsBySlug(slug: string): Promise<NewsDetailData | undefined> {
  return withFallback(
    async () => {
      try {
        const n = await apiClient.get<ApiNewsDetail>(endpoints.news.detailBySlug(slug), {
          revalidate: 3600,
          tags: ["news"],
        });
        return toDetail(n);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    () => mock.getNewsBySlug(slug)
  );
}

export function getRelatedNews(slug: string): Promise<NewsCardData[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiNewsCard>>(endpoints.news.list, {
        revalidate: 3600,
        tags: ["news"],
        query: { limit: 4 },
      });
      return res.items
        .map(toCard)
        .filter((n) => n.slug !== slug)
        .slice(0, 3);
    },
    () => mock.getRelatedNews(slug)
  );
}

export function getAllNewsSlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiNewsCard>>(endpoints.news.list, {
        revalidate: 3600,
        tags: ["news"],
        query: { limit: 100 },
      });
      return res.items.map((n) => n.slug);
    },
    () => mock.news.map((n) => n.slug)
  );
}
