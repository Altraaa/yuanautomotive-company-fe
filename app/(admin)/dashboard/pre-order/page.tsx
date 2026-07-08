import type { Metadata } from "next";
import { listAdminOrders } from "@/services/admin/orders";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { OrderManager } from "@/features/admin/orders/order-manager";

export const metadata: Metadata = {
  title: "Kelola Pre-Order",
};

export default async function ManageOrdersPage() {
  const { items } = await listAdminOrders({ page: 1, limit: 100 });
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Pre-Order" }]}
        title="Kelola Pre-Order"
      />
      <div className="p-4 md:p-8">
        <OrderManager rows={items} />
      </div>
    </>
  );
}
