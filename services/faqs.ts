import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiFaqItem } from "@/types/api/faq";
import type { FaqItem } from "@/types/ui/faq";
import * as mock from "@/features/faq/data";

/**
 * PUBLIC FAQ service (RSC), API-first with mock fallback.
 *
 * Backend `/faqs` (no token) returns published items ordered by `sort_order`.
 * `withFallback` (no `alwaysFallback`) keeps the page up only when the backend
 * is truly down (5xx / unreachable). Cached under the `faqs` ISR tag, which the
 * backend revalidates after every write — matching the blog/news services.
 */

function toItem(f: ApiFaqItem): FaqItem {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
  };
}

/** Fetch every published FAQ (limit 100 — the accordion renders them all). */
export function getAllFaqs(): Promise<FaqItem[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiFaqItem>>(endpoints.faqs.list, {
        revalidate: 3600,
        tags: ["faqs"],
        query: { limit: 100 },
      });
      return res.items.map(toItem);
    },
    () => mock.getAllFaqs()
  );
}
