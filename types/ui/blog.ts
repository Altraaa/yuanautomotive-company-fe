/** UI blog types consumed by components. */

export type BlogCategory = "Tips" | "Rilis" | "Panduan" | "Berita";

export type BlogCardData = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  imageUrl: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
};

export type BlogDetailData = BlogCardData & {
  /** Rendered HTML body (from Tiptap on the backend). */
  contentHtml: string;
  author: string;
};

export const BLOG_CATEGORIES: BlogCategory[] = ["Tips", "Rilis", "Panduan", "Berita"];

export type BlogStatus = "Published" | "Draft";

/** Admin blog table row. */
export type AdminBlogRow = {
  uuid: string;
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  imageUrl?: string;
  publishedAt?: string; // ISO | undefined for drafts
  readingMinutes: number;
  status: BlogStatus;
  author: string;
};

/** Full admin blog record for the editor. */
export type AdminBlogDetail = AdminBlogRow & {
  contentHtml: string;
  coverUuid?: string;
  coverUrl?: string;
};
