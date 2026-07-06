import type { Metadata } from "next";
import { Check } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductEditForm } from "@/features/admin/components/product-edit-form";
import { emptyProductFormValues } from "@/features/admin/product-schema";

export const metadata: Metadata = {
  title: "Tambah Produk",
};

export default function CreateProductPage() {
  return (
    <>
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
            <CtaButton type="submit" form="product-form">
              <Check className="h-4 w-4" /> Simpan Produk
            </CtaButton>
          </>
        }
      />
      <ProductEditForm defaultValues={emptyProductFormValues} redirectTo="/dashboard/produk" />
    </>
  );
}
