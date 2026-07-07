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
