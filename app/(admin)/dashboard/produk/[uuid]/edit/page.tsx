import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductEditForm } from "@/features/admin/components/product-edit-form";
import { getAdminProductDetail } from "@/features/admin/data";
import { toProductFormValues } from "@/features/admin/product-schema";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const detail = getAdminProductDetail(uuid);
  return { title: detail ? `Edit — ${detail.name}` : "Produk Tidak Ditemukan" };
}

export default async function EditProductPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const detail = getAdminProductDetail(uuid);
  if (!detail) notFound();

  const backHref = `/dashboard/produk/${detail.uuid}`;

  return (
    <>
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
            <CtaButton type="submit" form="product-form">
              <Check className="h-4 w-4" /> Simpan Perubahan
            </CtaButton>
          </>
        }
      />
      <ProductEditForm defaultValues={toProductFormValues(detail)} redirectTo={backHref} />
    </>
  );
}
