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
