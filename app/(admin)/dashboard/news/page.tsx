import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { listAdminNews } from "@/services/admin/news";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { NewsManager } from "@/features/admin/news/news-manager";

export const metadata: Metadata = {
  title: "Kelola News",
};

export default async function ManageNewsPage() {
  const { items } = await listAdminNews({ page: 1, limit: 100 });
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "News" }]}
        title="Kelola News"
        actions={
          <CtaButton href="/dashboard/news/baru">
            <Plus className="h-4 w-4" /> Tambah Konten
          </CtaButton>
        }
      />
      <div className="p-4 md:p-8">
        <NewsManager rows={items} />
      </div>
    </>
  );
}
