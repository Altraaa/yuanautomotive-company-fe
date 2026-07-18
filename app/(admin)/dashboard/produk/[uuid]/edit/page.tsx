import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductEditForm } from "@/features/admin/components/product-edit-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
import { getAdminProduct } from "@/services/admin/products";
import { listCategories } from "@/services/categories";
import { toProductFormValues } from "@/features/admin/product-schema";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const detail = await getAdminProduct(uuid);
  return { title: detail ? `Edit — ${detail.name}` : "Produk Tidak Ditemukan" };
}

export default async function EditProductPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const [detail, categories] = await Promise.all([
    getAdminProduct(uuid),
    listCategories(),
  ]);
  if (!detail) notFound();

  const backHref = `/dashboard/produk/${detail.uuid}`;

  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produk", href: "/dashboard/produk" },
          { label: detail.name, href: backHref },
          { label: "Edit" },
        ]}
        title="Edit Produk"
      />
      <ProductEditForm
        productUuid={detail.uuid}
        defaultValues={toProductFormValues(detail)}
        initialImages={detail.galleryMedia}
        categories={categories.map((c) => c.name)}
      />
      <EditorActionBar formId="product-form" saveLabel="Simpan Perubahan" />
    </FormSubmitProvider>
  );
}
