import { z } from "zod";
import type { AdminFaqDetail } from "@/types/ui/faq";

/** Zod schema for the FAQ editor (create + edit). Mirrors the backend DTO. */
export const faqFormSchema = z.object({
  question: z
    .string()
    .min(3, "Pertanyaan minimal 3 karakter.")
    .max(255, "Pertanyaan maksimal 255 karakter."),
  answer: z.string().min(3, "Jawaban minimal 3 karakter."),
  /** Optional grouping label; empty string = ungrouped (sent as null). */
  category: z.string().max(100, "Kategori maksimal 100 karakter."),
  sortOrder: z
    .number({ error: "Urutan harus berupa angka." })
    .int("Urutan harus bilangan bulat.")
    .min(0, "Urutan minimal 0."),
  status: z.enum(["Published", "Draft"]),
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;

export const emptyFaqForm: FaqFormValues = {
  question: "",
  answer: "",
  category: "",
  sortOrder: 0,
  status: "Published",
};

export function toFaqFormValues(d: AdminFaqDetail): FaqFormValues {
  return {
    question: d.question,
    answer: d.answer,
    category: d.category ?? "",
    sortOrder: d.sortOrder,
    status: d.status,
  };
}
