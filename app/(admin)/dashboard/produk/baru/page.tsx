import type { Metadata } from "next";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductEditForm } from "@/features/admin/components/product-edit-form";
import {
  ProductFormProvider,
  ProductSaveButton,
} from "@/features/admin/components/product-form-context";
import { emptyProductFormValues } from "@/features/admin/product-schema";

export const metadata: Metadata = {
  title: "Tambah Produk",
};

export default function CreateProductPage() {
  return (
    <ProductFormProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produk", href: "/dashboard/produk" },
          { label: "Baru" },
        ]}
        title="Tambah Produk"
        actions={
          <>
            <CtaButton href="/dashboard/produk" variant="outline" className="hidden sm:inline-grid">
              Batal
            </CtaButton>
            <ProductSaveButton label="Simpan Produk" />
          </>
        }
      />
      <ProductEditForm
        productUuid={null}
        defaultValues={emptyProductFormValues}
        redirectTo="/dashboard/produk"
      />
    </ProductFormProvider>
  );
}
