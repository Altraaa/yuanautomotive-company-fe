import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { flattenPage } from "@/lib/paginate";
import { withFallback } from "@/lib/api-fallback";
import type { ApiPaginated } from "@/types/api/common";
import type { ApiContact } from "@/types/api/contact";
import type { ContactRow } from "@/types/ui/contact";

/**
 * ADMIN contacts (leads) service — server-side reads (RSC) + mapper. Mutations
 * live in `features/admin/contact-actions.ts`. Mock fallback while wiring.
 */

function toRow(c: ApiContact): ContactRow {
  return {
    uuid: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    vehicleModel: c.vehicle_model ?? undefined,
    message: c.message,
    status: c.status,
    createdAt: c.created_at,
  };
}

export function listAdminContacts(params: { page?: number; limit?: number; status?: string }) {
  const limit = params.limit ?? 100;
  return withFallback(
    async () => {
      const res = await apiClient.get<ApiPaginated<ApiContact>>(endpoints.contacts.adminList, {
        auth: true,
        query: { page: params.page ?? 1, limit, status: params.status },
      });
      return flattenPage(res, toRow);
    },
    () => ({
      items: mockContacts.map(toRow),
      total: mockContacts.length,
      totalPages: 1,
      page: 1,
    }),
    { alwaysFallback: true }
  );
}

// ── Mock fallback dataset (auto-dropped once the backend is healthy) ──
const mockContacts: ApiContact[] = [
  {
    id: "lead-2001",
    name: "Bagus Santoso",
    phone: "0812-7788-9900",
    email: "bagus.santoso@mail.com",
    vehicle_model: "Wuling Air EV",
    message: "Halo, apakah charger 7kW ready stok? Butuh untuk minggu depan.",
    status: "NEW",
    created_at: "2026-07-07T07:12:00.000Z",
  },
  {
    id: "lead-2002",
    name: "Komunitas EV Nusantara",
    phone: "0821-1234-5678",
    email: "info@evnusantara.id",
    vehicle_model: "Hyundai Ioniq 5",
    message: "Kami tertarik kerja sama pembelian aksesoris untuk anggota komunitas.",
    status: "NEW",
    created_at: "2026-07-06T14:45:00.000Z",
  },
  {
    id: "lead-2003",
    name: "Dewi Pratama",
    phone: "0857-9090-1212",
    email: "dewi.p@mail.com",
    vehicle_model: "BYD Atto 3",
    message: "Mau tanya kompatibilitas velg aero 18 inch untuk Atto 3.",
    status: "CONTACTED",
    created_at: "2026-07-05T09:30:00.000Z",
  },
  {
    id: "lead-2004",
    name: "Bengkel Rama Watts",
    phone: "0813-4545-6767",
    email: "ramawatts@mail.com",
    vehicle_model: "MG 4 EV",
    message: "Minta katalog lengkap + harga reseller.",
    status: "CLOSED",
    created_at: "2026-07-04T11:05:00.000Z",
  },
];
