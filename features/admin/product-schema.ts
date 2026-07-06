import { z } from "zod";
import type { AdminProductDetail } from "@/types/ui/admin";

/**
 * Admin product form schema — single source of truth for create/edit.
 * Prices are kept as grouped strings (e.g. "8.450.000") to match the input UX;
 * the service mapper parses them to numbers before hitting the API.
 */
export const productFormSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  sku: z.string().min(2, "SKU wajib diisi"),
  category: z.enum(["Sparepart", "Body Part", "Aksesoris"]),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  retailPrice: z.string().min(1, "Harga retail wajib diisi"),
  wholesalePrice: z.string().optional(),
  stock: z.string().min(1, "Stok wajib diisi"),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  compatibility: z.array(z.string()),
  status: z.enum(["Published", "Draft"]),
  badge: z.string(),
  featured: z.boolean(),
  slug: z.string().min(1, "Slug wajib diisi"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

const groupThousands = (n: number) => new Intl.NumberFormat("id-ID").format(n);

/** Map a fetched product record into editable form values. */
export function toProductFormValues(detail: AdminProductDetail): ProductFormValues {
  return {
    name: detail.name,
    sku: detail.sku,
    category: detail.category,
    description: detail.description,
    retailPrice: groupThousands(detail.retailPrice),
    wholesalePrice: groupThousands(detail.wholesalePrice),
    stock: String(detail.stock),
    specs: detail.specs.length > 0 ? detail.specs : [{ label: "", value: "" }],
    compatibility: detail.compatibility,
    status: detail.status,
    badge: detail.badge ?? "",
    featured: detail.featured,
    slug: detail.slug,
  };
}

/** Blank defaults for the "Tambah Produk" (create) flow. */
export const emptyProductFormValues: ProductFormValues = {
  name: "",
  sku: "",
  category: "Sparepart",
  description: "",
  retailPrice: "",
  wholesalePrice: "",
  stock: "",
  specs: [{ label: "", value: "" }],
  compatibility: [],
  status: "Draft",
  badge: "",
  featured: false,
  slug: "",
};
