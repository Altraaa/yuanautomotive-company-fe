/**
 * API FAQ types — mirror the backend JSON EXACTLY (snake_case, dates as ISO
 * strings). One `/faqs` path whose shape depends on auth (like `/news`):
 * anonymous → `ApiFaqItem` (published only), admin → `ApiAdminFaqRow` (all).
 * Mappers in the service layer bridge these to the UI types.
 */

/** Public FAQ item (GET /faqs without token). */
export type ApiFaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
};

/** Admin list row + detail — superset of the public item (same shape both). */
export type ApiAdminFaqRow = ApiFaqItem & {
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

/** Admin detail is identical to a list row (GET /faqs/:uuid). */
export type ApiAdminFaqDetail = ApiAdminFaqRow;
