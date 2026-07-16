import type { Metadata } from "next";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { FaqEditorForm } from "@/features/admin/faqs/faq-editor-form";
import {
  FormSaveButton,
  FormSubmitProvider,
} from "@/features/admin/components/form-submit-context";
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
        actions={
          <>
            <CtaButton href="/dashboard/faq" variant="outline" className="hidden sm:inline-grid">
              Batal
            </CtaButton>
            <FormSaveButton label="Simpan FAQ" formId="faq-form" />
          </>
        }
      />
      <FaqEditorForm
        faqUuid={null}
        defaultValues={emptyFaqForm}
        categories={categories}
        redirectTo="/dashboard/faq"
      />
    </FormSubmitProvider>
  );
}
