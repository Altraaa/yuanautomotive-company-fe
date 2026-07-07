import type { Metadata } from "next";
import { Plus, Upload } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { listAdminProducts } from "@/services/admin/products";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductManager } from "@/features/admin/components/product-manager";

export const metadata: Metadata = {
  title: "Kelola Produk",
};

export default async function ManageProductsPage() {
  // Load the catalog (max backend limit) and filter/sort/paginate client-side.
  const { items } = await listAdminProducts({ page: 1, limit: 100 });
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Produk" }]}
        title="Kelola Produk"
        actions={
          <>
            <CtaButton href="/dashboard/produk" variant="outline" className="hidden sm:inline-grid">
              <Upload className="h-4 w-4" /> Import
            </CtaButton>
            <CtaButton href="/dashboard/produk/baru">
              <Plus className="h-4 w-4" /> Tambah Produk
            </CtaButton>
          </>
        }
      />

      <div className="flex flex-col gap-[18px] p-4 md:p-8">
        <ProductManager rows={items} />
      </div>
    </>
  );
}
