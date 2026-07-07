import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import type { ApiCategory } from "@/types/api/category";
import { productCategories } from "@/features/products/data";

export type CategoryOption = { uuid: string; name: string; slug: string };

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function toCategory(c: ApiCategory): CategoryOption {
  return { uuid: c.id, name: c.name, slug: c.slug };
}

/** Category list — filter dropdowns, product form (name → uuid). API-first, mock fallback. */
export function listCategories(): Promise<CategoryOption[]> {
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiCategory[]>(endpoints.categories.list, {
        revalidate: 3600,
        tags: ["products"],
      });
      return res.map(toCategory);
    },
    () => productCategories.map((name) => ({ uuid: slugify(name), name, slug: slugify(name) }))
  );
}
