import type { Metadata } from "next";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { FaqEditorForm } from "@/features/admin/faqs/faq-editor-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
import { listAdminFaqCategories } from "@/services/admin/faqs";
import { emptyFaqForm } from "@/features/admin/faq-schema";

export const metadata: Metadata = {
  title: "Tambah FAQ",
};

export default async function NewFaqPage() {
  const categories = await listAdminFaqCategories();
  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "FAQ", href: "/dashboard/faq" },
          { label: "Tambah FAQ" },
        ]}
        title="Tambah FAQ"
      />
      <FaqEditorForm faqUuid={null} defaultValues={emptyFaqForm} categories={categories} />
      <EditorActionBar formId="faq-form" saveLabel="Simpan FAQ" />
    </FormSubmitProvider>
  );
}
