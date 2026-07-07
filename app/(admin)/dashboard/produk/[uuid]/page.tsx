import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ProductDetailView } from "@/features/admin/components/product-detail-view";
import { getAdminProduct } from "@/services/admin/products";
import { getAdminProductUuids } from "@/features/admin/data";

type Params = Promise<{ uuid: string }>;

export function generateStaticParams() {
  return getAdminProductUuids().map((uuid) => ({ uuid }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const detail = await getAdminProduct(uuid);
  return { title: detail ? `${detail.name} — Detail` : "Produk Tidak Ditemukan" };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const detail = await getAdminProduct(uuid);
  if (!detail) notFound();

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produk", href: "/dashboard/produk" },
          { label: "Detail" },
        ]}
        title="Detail Produk"
        actions={
          <>
            <CtaButton href="/dashboard/produk" variant="outline" className="hidden sm:inline-grid">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </CtaButton>
            <Link
              href="/dashboard/produk"
              title="Hapus"
              aria-label="Hapus produk"
              className="grid h-12 w-12 place-items-center border border-border bg-surface-sunken text-red-soft transition-colors hover:border-red/50"
            >
              <Trash2 className="h-[18px] w-[18px]" />
            </Link>
            <CtaButton href={`/dashboard/produk/${detail.uuid}/edit`}>
              <Pencil className="h-4 w-4" /> Edit Produk
            </CtaButton>
          </>
        }
      />
      <ProductDetailView detail={detail} />
    </>
  );
}
