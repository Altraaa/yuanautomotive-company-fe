import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiOrder, ApiOrderItem } from "@/types/api/order";
import type { OrderDetail, OrderItem, OrderRow, OrderStatus } from "@/types/ui/order";

/**
 * ADMIN order (pre-order) service — server-side reads (RSC) + mappers. Mutations
 * live in `features/admin/order-actions.ts`. Falls back to a small mock set while
 * the backend is being wired so the panel never crashes.
 */

function toItem(i: ApiOrderItem): OrderItem {
  return {
    productSlug: i.product_slug,
    productName: i.product_name,
    price: Number(i.price_snapshot),
    quantity: i.quantity,
  };
}

function orderTotal(items: ApiOrderItem[]): number {
  return items.reduce((sum, i) => sum + Number(i.price_snapshot) * i.quantity, 0);
}

function toRow(o: ApiOrder): OrderRow {
  return {
    uuid: o.id,
    customerName: o.customer_name,
    phone: o.phone,
    email: o.email ?? undefined,
    vehicleModel: o.vehicle_model ?? undefined,
    status: o.status,
    createdAt: o.created_at,
    itemCount: o.items.length,
    total: orderTotal(o.items),
  };
}

function toDetail(o: ApiOrder): OrderDetail {
  return {
    ...toRow(o),
    note: o.note ?? undefined,
    items: o.items.map(toItem),
  };
}

export function listAdminOrders(params: { page?: number; limit?: number; status?: string }) {
  const limit = params.limit ?? 100;
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiOrder>>(endpoints.orders.adminList, {
        auth: true,
        query: { page: params.page ?? 1, limit, status: params.status },
      });
      return flattenPage(res, toRow);
    },
    () => ({
      items: mockOrders.map(toRow),
      total: mockOrders.length,
      totalPages: 1,
      page: 1,
    }),
    { alwaysFallback: true }
  );
}

export function getAdminOrder(uuid: string): Promise<OrderDetail | undefined> {
  return withFallback(
    async () => {
      try {
        const o = await apiClient.get<ApiOrder>(endpoints.orders.adminDetail(uuid), { auth: true });
        return toDetail(o);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    () => {
      const found = mockOrders.find((o) => o.id === uuid);
      return found ? toDetail(found) : undefined;
    },
    { alwaysFallback: true }
  );
}

/** Count of orders per status — feeds the filter tabs. */
export function countByStatus(rows: OrderRow[]): Record<OrderStatus | "ALL", number> {
  const base: Record<OrderStatus | "ALL", number> = {
    ALL: rows.length,
    NEW: 0,
    PROCESSED: 0,
    DONE: 0,
    CANCELLED: 0,
  };
  for (const r of rows) base[r.status] += 1;
  return base;
}

// ── Mock fallback dataset (removed automatically once the backend is healthy) ──
const mockOrders: ApiOrder[] = [
  {
    id: "ord-1001",
    customer_name: "Ari Wibowo",
    phone: "0812-3456-7890",
    email: "ari.wibowo@mail.com",
    vehicle_model: "Wuling Air EV",
    note: "Mohon konfirmasi ketersediaan warna gunmetal.",
    status: "NEW",
    created_at: "2026-07-06T08:24:00.000Z",
    items: [
      { product_slug: "charger-portable-7kw", product_name: "Charger Portable 7kW Type 2", price_snapshot: "8450000.00", quantity: 1 },
      { product_slug: "kabel-charging-type-2", product_name: "Kabel Charging Type 2 — 5 m", price_snapshot: "2150000.00", quantity: 1 },
    ],
  },
  {
    id: "ord-1002",
    customer_name: "PT Volt Mandiri",
    phone: "021-555-8899",
    email: "procurement@voltmandiri.co.id",
    vehicle_model: null,
    note: "Pembelian armada — minta penawaran grosir.",
    status: "PROCESSED",
    created_at: "2026-07-05T13:10:00.000Z",
    items: [
      { product_slug: "charger-22kw-wallbox", product_name: "Charger 22kW Wallbox", price_snapshot: "15900000.00", quantity: 5 },
    ],
  },
  {
    id: "ord-1003",
    customer_name: "Sinta Larasati",
    phone: "0857-1122-3344",
    email: null,
    vehicle_model: "BYD Atto 3",
    note: null,
    status: "DONE",
    created_at: "2026-07-05T09:02:00.000Z",
    items: [
      { product_slug: "karpet-premium-full-set-ev", product_name: "Karpet Premium Full-Set EV", price_snapshot: "950000.00", quantity: 1 },
    ],
  },
  {
    id: "ord-1004",
    customer_name: "Garasi Elektrik BSD",
    phone: "0813-9988-7766",
    email: "halo@garasielektrik.id",
    vehicle_model: "MG 4 EV",
    note: "Butuh sebelum akhir bulan.",
    status: "PROCESSED",
    created_at: "2026-07-04T16:40:00.000Z",
    items: [
      { product_slug: "velg-aero-18-gunmetal", product_name: 'Velg Aero 18" Gunmetal', price_snapshot: "12900000.00", quantity: 2 },
      { product_slug: "kampas-rem-regeneratif-ev", product_name: "Kampas Rem Regeneratif EV", price_snapshot: "1250000.00", quantity: 2 },
    ],
  },
  {
    id: "ord-1005",
    customer_name: "Dewi Pratama",
    phone: "0821-4455-6677",
    email: "dewi.pratama@mail.com",
    vehicle_model: "Hyundai Ioniq 5",
    note: null,
    status: "CANCELLED",
    created_at: "2026-07-03T11:15:00.000Z",
    items: [
      { product_slug: "wall-bracket-charger-portable", product_name: "Wall Bracket Charger Portable", price_snapshot: "450000.00", quantity: 1 },
    ],
  },
];
