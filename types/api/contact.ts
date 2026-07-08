/** API types mirror backend JSON exactly. */

export type ApiContactStatus = "NEW" | "CONTACTED" | "CLOSED";

export type ApiContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_model: string | null;
  message: string;
  status: ApiContactStatus;
  created_at: string; // ISO
};
