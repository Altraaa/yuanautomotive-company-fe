import type { Metadata } from "next";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { NewsEditorForm } from "@/features/admin/news/news-editor-form";
import {
  FormSaveButton,
  FormSubmitProvider,
} from "@/features/admin/components/form-submit-context";
import { emptyNewsForm } from "@/features/admin/news-schema";

export const metadata: Metadata = {
  title: "Tambah Konten",
};

export default function NewNewsPage() {
  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "News", href: "/dashboard/news" },
          { label: "Tambah Konten" },
        ]}
        title="Tambah Konten"
        actions={
          <>
            <CtaButton href="/dashboard/news" variant="outline" className="hidden sm:inline-grid">
              Batal
            </CtaButton>
            <FormSaveButton label="Simpan Konten" formId="news-form" />
          </>
        }
      />
      <NewsEditorForm newsUuid={null} defaultValues={emptyNewsForm} redirectTo="/dashboard/news" />
    </FormSubmitProvider>
  );
}
