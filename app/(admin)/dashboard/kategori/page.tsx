import type { Metadata } from "next";
import { listCategories } from "@/services/categories";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { CategoryManager } from "@/features/admin/categories/category-manager";

export const metadata: Metadata = {
  title: "Kelola Kategori",
};

export default async function ManageCategoriesPage() {
  const categories = await listCategories();
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Kategori" }]}
        title="Kelola Kategori"
      />
      <div className="p-4 md:p-8">
        <CategoryManager initial={categories} />
      </div>
    </>
  );
}
