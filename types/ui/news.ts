/** UI news types consumed by components. Instagram content catalog. */

export type NewsType = "Reels" | "Poster";

export const NEWS_TYPES: NewsType[] = ["Reels", "Poster"];

/** Window (days) after publish where content is considered "Baru" automatically. */
export const NEW_WINDOW_DAYS = 14;

export type NewsCardData = {
  slug: string;
  title: string;
  type: NewsType;
  thumbnailUrl: string;
  instagramUrl: string;
  publishedAt: string; // ISO date
  /** Manual "Baru" flag set by admin (overrides the date window). */
  markNew: boolean;
};

export type NewsDetailData = NewsCardData & {
  caption: string;
};

export type NewsStatus = "Published" | "Draft";

/** Admin news table row. */
export type AdminNewsRow = {
  uuid: string;
  slug: string;
  title: string;
  type: NewsType;
  thumbnailUrl?: string;
  instagramUrl: string;
  publishedAt?: string; // ISO | undefined for drafts
  markNew: boolean;
  status: NewsStatus;
};

/** Full admin news record for the editor. */
export type AdminNewsDetail = AdminNewsRow & {
  caption: string;
  thumbnailUuid?: string;
};

/**
 * Effective "Baru" state: manual toggle OR published within NEW_WINDOW_DAYS.
 * Draft/undefined dates are never auto-new (only the manual flag applies).
 */
export function isNews(item: { markNew: boolean; publishedAt?: string }): boolean {
  if (item.markNew) return true;
  if (!item.publishedAt) return false;
  const published = new Date(item.publishedAt).getTime();
  if (Number.isNaN(published)) return false;
  const ageDays = (Date.now() - published) / (1000 * 60 * 60 * 24);
  return ageDays >= 0 && ageDays <= NEW_WINDOW_DAYS;
}
