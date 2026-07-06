import { z } from "zod";

/** Admin login schema — single source of truth; the form type is inferred from it. */
export const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
