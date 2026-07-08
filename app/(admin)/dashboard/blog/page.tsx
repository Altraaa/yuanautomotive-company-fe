import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { listAdminBlogs } from "@/services/admin/blogs";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { BlogManager } from "@/features/admin/blog/blog-manager";

export const metadata: Metadata = {
  title: "Kelola Blog",
};

export default async function ManageBlogPage() {
  const { items } = await listAdminBlogs({ page: 1, limit: 100 });
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Blog" }]}
        title="Kelola Blog"
        actions={
          <CtaButton href="/dashboard/blog/baru">
            <Plus className="h-4 w-4" /> Tulis Artikel
          </CtaButton>
        }
      />
      <div className="p-4 md:p-8">
        <BlogManager rows={items} />
      </div>
    </>
  );
}
