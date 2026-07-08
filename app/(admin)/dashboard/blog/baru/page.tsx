import type { Metadata } from "next";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { BlogEditorForm } from "@/features/admin/blog/blog-editor-form";
import {
  FormSaveButton,
  FormSubmitProvider,
} from "@/features/admin/components/form-submit-context";
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
        actions={
          <>
            <CtaButton href="/dashboard/blog" variant="outline" className="hidden sm:inline-grid">
              Batal
            </CtaButton>
            <FormSaveButton label="Simpan Artikel" formId="blog-form" />
          </>
        }
      />
      <BlogEditorForm blogUuid={null} defaultValues={emptyBlogForm} redirectTo="/dashboard/blog" />
    </FormSubmitProvider>
  );
}
