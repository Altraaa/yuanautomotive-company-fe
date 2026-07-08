/** UI order types consumed by admin components. */

export type OrderStatus = "NEW" | "PROCESSED" | "DONE" | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = ["NEW", "PROCESSED", "DONE", "CANCELLED"];

/** Indonesian labels for order statuses (shared by manager + detail view). */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: "Baru",
  PROCESSED: "Diproses",
  DONE: "Selesai",
  CANCELLED: "Dibatalkan",
};

export type OrderItem = {
  productSlug: string;
  productName: string;
  price: number;
  quantity: number;
};

export type OrderRow = {
  uuid: string;
  customerName: string;
  phone: string;
  email?: string;
  vehicleModel?: string;
  status: OrderStatus;
  createdAt: string; // ISO
  itemCount: number;
  total: number;
};

export type OrderDetail = OrderRow & {
  note?: string;
  items: OrderItem[];
};
