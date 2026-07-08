/** API types mirror backend JSON exactly (snake_case, decimals as strings). */

export type ApiOrderStatus = "NEW" | "PROCESSED" | "DONE" | "CANCELLED";

export type ApiOrderItem = {
  product_slug: string;
  product_name: string;
  price_snapshot: string; // decimal string snapshot
  quantity: number;
};

export type ApiOrder = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  vehicle_model: string | null;
  note: string | null;
  status: ApiOrderStatus;
  created_at: string; // ISO
  items: ApiOrderItem[];
};
