/**
 * API types mirror the backend JSON EXACTLY (snake_case, `price` as string,
 * dates as ISO strings). Mappers in the service layer bridge these to UI types.
 */

export type ApiMeta = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type ApiPaginated<T> = {
  items: T[];
  meta: ApiMeta;
};
