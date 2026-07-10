import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiNewsCard, ApiNewsDetail } from "@/types/api/news";
import type { NewsCardData, NewsDetailData, NewsType } from "@/types/ui/news";
import * as mock from "@/features/news/data";

/**
 * PUBLIC news service (RSC), API-first with mock fallback. Instagram content.
 *
 * The backend `/news` endpoints are not wired yet, so every read uses
 * `alwaysFallback` → a missing route (404) transparently serves the mock set,
 * exactly like the admin news service. Once the NestJS `/news` routes are live
 * (matching `ApiNewsCard`/`ApiNewsDetail`), real data is used automatically:
 * a genuine 404 for an unknown slug still falls back to the mock, which returns
 * `undefined` for unknown slugs → the detail page calls `notFound()`.
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

export function getAllNewsCards(): Promise<NewsCardData[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiNewsCard>>(endpoints.news.list, {
        revalidate: 3600,
        tags: ["news"],
        query: { limit: 50 },
      });
      return res.items.map(toCard);
    },
    () => mock.getAllNewsCards(),
    { alwaysFallback: true }
  );
}

export function getNewsBySlug(slug: string): Promise<NewsDetailData | undefined> {
  return withFallback(
    async () => {
      const n = await apiClient.get<ApiNewsDetail>(endpoints.news.detailBySlug(slug), {
        revalidate: 3600,
        tags: ["news"],
      });
      return toDetail(n);
    },
    () => mock.getNewsBySlug(slug),
    { alwaysFallback: true }
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
    () => mock.getRelatedNews(slug),
    { alwaysFallback: true }
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
    () => mock.news.map((n) => n.slug),
    { alwaysFallback: true }
  );
}
