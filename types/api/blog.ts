export type ApiBlogCard = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image_url: string | null;
  published_at: string;
  reading_minutes: number;
};

export type ApiBlogDetail = ApiBlogCard & {
  content_html: string;
  author: string;
};

/** Admin list row — like the public card but carries the uuid + publish state. */
export type ApiAdminBlogRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image_url: string | null;
  published_at: string | null;
  reading_minutes: number;
  is_published: boolean;
  author: string;
};

/** Admin detail (includes drafts) — everything the editor needs to hydrate. */
export type ApiAdminBlogDetail = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content_html: string;
  image_url: string | null;
  cover_uuid: string | null;
  author: string;
  reading_minutes: number;
  is_published: boolean;
  published_at: string | null;
};
