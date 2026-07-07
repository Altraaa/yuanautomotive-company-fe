import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllProductSlugs } from "@/services/products";
import { getAllBlogSlugs } from "@/services/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/produk`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/tentang`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [productSlugs, blogSlugs] = await Promise.all([getAllProductSlugs(), getAllBlogSlugs()]);

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${site.url}/produk/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${site.url}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
