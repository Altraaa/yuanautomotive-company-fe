import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { NewsEditorForm } from "@/features/admin/news/news-editor-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
import { getAdminNews } from "@/services/admin/news";
import { toNewsFormValues } from "@/features/admin/news-schema";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const item = await getAdminNews(uuid);
  return { title: item ? `Edit — ${item.title}` : "Konten Tidak Ditemukan" };
}

export default async function EditNewsPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const item = await getAdminNews(uuid);
  if (!item) notFound();

  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "News", href: "/dashboard/news" },
          { label: item.title },
          { label: "Edit" },
        ]}
        title="Edit Konten"
      />
      <NewsEditorForm
        newsUuid={item.uuid}
        defaultValues={toNewsFormValues(item)}
        initialThumbnailUrl={item.thumbnailUrl}
      />
      <EditorActionBar formId="news-form" saveLabel="Simpan Perubahan" />
    </FormSubmitProvider>
  );
}
