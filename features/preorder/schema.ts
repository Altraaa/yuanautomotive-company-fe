import { z } from "zod";

/** Pre-order lead schema — one source of truth; form types inferred from it.
 * Products being ordered come from the cart, not the form fields. */
export const preorderSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z
    .string()
    .min(8, "Nomor telepon tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Hanya angka dan simbol telepon"),
  vehicleModel: z.string().optional(),
  note: z.string().optional(),
});

export type PreorderFormValues = z.infer<typeof preorderSchema>;
