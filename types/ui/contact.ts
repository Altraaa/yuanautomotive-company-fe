/** UI contact (lead) types consumed by admin components. */

export type ContactStatus = "NEW" | "CONTACTED" | "CLOSED";

export const CONTACT_STATUSES: ContactStatus[] = ["NEW", "CONTACTED", "CLOSED"];

export const CONTACT_STATUS_LABEL: Record<ContactStatus, string> = {
  NEW: "Baru",
  CONTACTED: "Dihubungi",
  CLOSED: "Selesai",
};

export type ContactRow = {
  uuid: string;
  name: string;
  phone: string;
  email: string;
  vehicleModel?: string;
  message: string;
  status: ContactStatus;
  createdAt: string; // ISO
};
