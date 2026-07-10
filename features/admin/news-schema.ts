import { z } from "zod";
import type { AdminNewsDetail } from "@/types/ui/news";

/** Zod schema for the news editor (create + edit). Instagram content. */
export const newsFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter.").max(255, "Judul maksimal 255 karakter."),
  type: z.enum(["Reels", "Poster"]),
  instagramUrl: z
    .string()
    .min(1, "Tautan Instagram wajib diisi.")
    .url("Masukkan URL Instagram yang valid."),
  caption: z
    .string()
    .min(10, "Caption minimal 10 karakter.")
    .max(2200, "Caption maksimal 2200 karakter."),
  markNew: z.boolean(),
  status: z.enum(["Published", "Draft"]),
  /** ISO date string; optional (defaults to now on publish). */
  publishedAt: z.string().optional(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export const emptyNewsForm: NewsFormValues = {
  title: "",
  type: "Reels",
  instagramUrl: "",
  caption: "",
  markNew: false,
  status: "Draft",
  publishedAt: "",
};

export function toNewsFormValues(d: AdminNewsDetail): NewsFormValues {
  return {
    title: d.title,
    type: d.type,
    instagramUrl: d.instagramUrl,
    caption: d.caption,
    markNew: d.markNew,
    status: d.status,
    publishedAt: d.publishedAt ?? "",
  };
}
