import type { Metadata } from "next";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { BlogEditorForm } from "@/features/admin/blog/blog-editor-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
import { emptyBlogForm } from "@/features/admin/blog-schema";

export const metadata: Metadata = {
  title: "Tulis Artikel",
};

export default function NewBlogPage() {
  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: "/dashboard/blog" },
          { label: "Tulis Artikel" },
        ]}
        title="Tulis Artikel"
      />
      <BlogEditorForm blogUuid={null} defaultValues={emptyBlogForm} />
      <EditorActionBar formId="blog-form" saveLabel="Simpan Artikel" />
    </FormSubmitProvider>
  );
}
