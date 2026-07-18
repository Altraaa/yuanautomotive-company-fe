import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { FaqEditorForm } from "@/features/admin/faqs/faq-editor-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
import { getAdminFaq, listAdminFaqCategories } from "@/services/admin/faqs";
import { toFaqFormValues } from "@/features/admin/faq-schema";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const item = await getAdminFaq(uuid);
  return { title: item ? `Edit — ${item.question}` : "FAQ Tidak Ditemukan" };
}

export default async function EditFaqPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const [item, categories] = await Promise.all([
    getAdminFaq(uuid),
    listAdminFaqCategories(),
  ]);
  if (!item) notFound();

  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "FAQ", href: "/dashboard/faq" },
          { label: item.question },
          { label: "Edit" },
        ]}
        title="Edit FAQ"
      />
      <FaqEditorForm
        faqUuid={item.uuid}
        defaultValues={toFaqFormValues(item)}
        categories={categories}
      />
      <EditorActionBar formId="faq-form" saveLabel="Simpan Perubahan" />
    </FormSubmitProvider>
  );
}
