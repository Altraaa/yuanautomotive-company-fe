import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { NewsEditorForm } from "@/features/admin/news/news-editor-form";
import {
  FormSaveButton,
  FormSubmitProvider,
} from "@/features/admin/components/form-submit-context";
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
        actions={
          <>
            <CtaButton href="/dashboard/news" variant="outline" className="hidden sm:inline-grid">
              Batal
            </CtaButton>
            <FormSaveButton label="Simpan Perubahan" formId="news-form" />
          </>
        }
      />
      <NewsEditorForm
        newsUuid={item.uuid}
        defaultValues={toNewsFormValues(item)}
        initialThumbnailUrl={item.thumbnailUrl}
        redirectTo="/dashboard/news"
      />
    </FormSubmitProvider>
  );
}
