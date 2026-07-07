import type { ApiPaginated } from "@/types/api/common";

/**
 * Flatten the backend `{ items, meta }` envelope into the flat shape the FE
 * tables + pagination already consume: `{ items, total, totalPages, page }`.
 */
export function flattenPage<A, U>(res: ApiPaginated<A>, map: (a: A) => U) {
  return {
    items: res.items.map(map),
    total: res.meta.total,
    totalPages: res.meta.total_pages,
    page: res.meta.page,
  };
}
