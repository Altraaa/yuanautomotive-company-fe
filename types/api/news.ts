/**
 * API news types — mirror the backend JSON EXACTLY (snake_case, dates as ISO
 * strings). Instagram content: `Reels` (video) or `Poster` (image). Mappers in
 * the service layer bridge these to the UI types.
 */

export type ApiNewsCard = {
  slug: string;
  title: string;
  type: string; // "Reels" | "Poster"
  thumbnail_url: string | null;
  instagram_url: string;
  published_at: string;
  mark_new: boolean;
};

export type ApiNewsDetail = ApiNewsCard & {
  caption: string;
};

/** Admin list row — like the public card but carries the uuid + publish state. */
export type ApiAdminNewsRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  thumbnail_url: string | null;
  instagram_url: string;
  published_at: string | null;
  mark_new: boolean;
  is_published: boolean;
};

/** Admin detail (includes drafts) — everything the editor needs to hydrate. */
export type ApiAdminNewsDetail = {
  id: string;
  slug: string;
  title: string;
  type: string;
  caption: string;
  thumbnail_url: string | null;
  thumbnail_uuid: string | null;
  instagram_url: string;
  mark_new: boolean;
  is_published: boolean;
  published_at: string | null;
};
