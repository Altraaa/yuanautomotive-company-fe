import type { Metadata } from "next";
import { listAdminContacts } from "@/services/admin/contacts";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ContactManager } from "@/features/admin/contacts/contact-manager";

export const metadata: Metadata = {
  title: "Kelola Leads",
};

export default async function ManageLeadsPage() {
  const { items } = await listAdminContacts({ page: 1, limit: 100 });
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Leads" }]}
        title="Kelola Leads"
      />
      <div className="p-4 md:p-8">
        <ContactManager rows={items} />
      </div>
    </>
  );
}
