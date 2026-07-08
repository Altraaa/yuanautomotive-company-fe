import { z } from "zod";
import type { AdminBlogDetail } from "@/types/ui/blog";

/** Zod schema for the blog editor (create + edit). */
export const blogFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter.").max(255, "Judul maksimal 255 karakter."),
  category: z.enum(["Tips", "Rilis", "Panduan", "Berita"]),
  excerpt: z
    .string()
    .min(10, "Ringkasan minimal 10 karakter.")
    .max(500, "Ringkasan maksimal 500 karakter."),
  contentHtml: z.string().min(20, "Konten artikel masih terlalu pendek."),
  author: z.string().min(2, "Nama penulis minimal 2 karakter.").max(191),
  readingMinutes: z.string().min(1, "Isi estimasi waktu baca."),
  status: z.enum(["Published", "Draft"]),
  /** ISO date string; optional (defaults to now on publish). */
  publishedAt: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export const emptyBlogForm: BlogFormValues = {
  title: "",
  category: "Tips",
  excerpt: "",
  contentHtml: "",
  author: "Tim Yuan Dewata",
  readingMinutes: "4",
  status: "Draft",
  publishedAt: "",
};

export function toBlogFormValues(d: AdminBlogDetail): BlogFormValues {
  return {
    title: d.title,
    category: d.category,
    excerpt: d.excerpt,
    contentHtml: d.contentHtml,
    author: d.author,
    readingMinutes: String(d.readingMinutes),
    status: d.status,
    publishedAt: d.publishedAt ?? "",
  };
}
