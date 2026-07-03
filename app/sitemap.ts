import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { products } from "@/features/products/data";
import { blogs } from "@/features/blog/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/produk`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/tentang`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.url}/produk/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${site.url}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
