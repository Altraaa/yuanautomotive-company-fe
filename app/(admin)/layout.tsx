import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerAccessToken } from "@/lib/auth-cookies";
import { AdminShell } from "@/features/admin/components/admin-shell";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

/**
 * Admin route guard: every `/dashboard/*` route requires a session cookie.
 * Not authenticated → straight to /login (no admin render, no auth'd fetch).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  return <AdminShell>{children}</AdminShell>;
}
