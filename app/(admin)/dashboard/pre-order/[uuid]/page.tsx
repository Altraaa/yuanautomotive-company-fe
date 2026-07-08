import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/common/cta-button";
import { getAdminOrder } from "@/services/admin/orders";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { OrderDetailView } from "@/features/admin/orders/order-detail-view";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const order = await getAdminOrder(uuid);
  return { title: order ? `Pre-Order — ${order.customerName}` : "Pre-Order Tidak Ditemukan" };
}

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const order = await getAdminOrder(uuid);
  if (!order) notFound();

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pre-Order", href: "/dashboard/pre-order" },
          { label: order.customerName },
        ]}
        title="Detail Pre-Order"
        actions={
          <CtaButton href="/dashboard/pre-order" variant="outline" className="hidden sm:inline-grid">
            Kembali
          </CtaButton>
        }
      />
      <OrderDetailView order={order} />
    </>
  );
}
