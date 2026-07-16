import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { listAdminFaqs } from "@/services/admin/faqs";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { FaqManager } from "@/features/admin/faqs/faq-manager";

export const metadata: Metadata = {
  title: "Kelola FAQ",
};

export default async function ManageFaqPage() {
  const { items } = await listAdminFaqs({ page: 1, limit: 100 });
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "FAQ" }]}
        title="Kelola FAQ"
        actions={
          <CtaButton href="/dashboard/faq/baru">
            <Plus className="h-4 w-4" /> Tambah FAQ
          </CtaButton>
        }
      />
      <div className="p-4 md:p-8">
        <FaqManager rows={items} />
      </div>
    </>
  );
}
