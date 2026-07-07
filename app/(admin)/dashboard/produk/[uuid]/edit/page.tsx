import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductEditForm } from "@/features/admin/components/product-edit-form";
import {
  ProductFormProvider,
  ProductSaveButton,
} from "@/features/admin/components/product-form-context";
import { getAdminProduct } from "@/services/admin/products";
import { toProductFormValues } from "@/features/admin/product-schema";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const detail = await getAdminProduct(uuid);
  return { title: detail ? `Edit — ${detail.name}` : "Produk Tidak Ditemukan" };
}

export default async function EditProductPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const detail = await getAdminProduct(uuid);
  if (!detail) notFound();

  const backHref = `/dashboard/produk/${detail.uuid}`;

  return (
    <ProductFormProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produk", href: "/dashboard/produk" },
          { label: detail.name, href: backHref },
          { label: "Edit" },
        ]}
        title="Edit Produk"
        actions={
          <>
            <CtaButton href={backHref} variant="outline" className="hidden sm:inline-grid">
              Batal
            </CtaButton>
            <ProductSaveButton label="Simpan Perubahan" />
          </>
        }
      />
      <ProductEditForm
        productUuid={detail.uuid}
        defaultValues={toProductFormValues(detail)}
        initialImages={detail.galleryMedia}
        redirectTo={backHref}
      />
    </ProductFormProvider>
  );
}
