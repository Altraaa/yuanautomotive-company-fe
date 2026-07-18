import type { Metadata } from "next";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductEditForm } from "@/features/admin/components/product-edit-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
import { listCategories } from "@/services/categories";
import { emptyProductFormValues } from "@/features/admin/product-schema";

export const metadata: Metadata = {
  title: "Tambah Produk",
};

export default async function CreateProductPage() {
  const categories = await listCategories();
  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produk", href: "/dashboard/produk" },
          { label: "Baru" },
        ]}
        title="Tambah Produk"
      />
      <ProductEditForm
        productUuid={null}
        defaultValues={emptyProductFormValues}
        categories={categories.map((c) => c.name)}
      />
      <EditorActionBar formId="product-form" saveLabel="Simpan Produk" />
    </FormSubmitProvider>
  );
}
