import type { Metadata } from "next";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { NewsEditorForm } from "@/features/admin/news/news-editor-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
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
      />
      <NewsEditorForm newsUuid={null} defaultValues={emptyNewsForm} />
      <EditorActionBar formId="news-form" saveLabel="Simpan Konten" />
    </FormSubmitProvider>
  );
}
