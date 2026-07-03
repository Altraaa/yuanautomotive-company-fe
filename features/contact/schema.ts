import { z } from "zod";

/** Contact lead schema — one source of truth; form types are inferred from it. */
export const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z
    .string()
    .min(8, "Nomor telepon tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Hanya angka dan simbol telepon"),
  email: z.string().email("Format email tidak valid"),
  vehicleModel: z.string().optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
