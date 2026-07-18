import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { BlogEditorForm } from "@/features/admin/blog/blog-editor-form";
import { EditorActionBar } from "@/features/admin/components/editor-action-bar";
import { FormSubmitProvider } from "@/features/admin/components/form-submit-context";
import { getAdminBlog } from "@/services/admin/blogs";
import { toBlogFormValues } from "@/features/admin/blog-schema";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const blog = await getAdminBlog(uuid);
  return { title: blog ? `Edit — ${blog.title}` : "Artikel Tidak Ditemukan" };
}

export default async function EditBlogPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const blog = await getAdminBlog(uuid);
  if (!blog) notFound();

  return (
    <FormSubmitProvider>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: "/dashboard/blog" },
          { label: blog.title },
          { label: "Edit" },
        ]}
        title="Edit Artikel"
      />
      <BlogEditorForm
        blogUuid={blog.uuid}
        defaultValues={toBlogFormValues(blog)}
        initialCoverUrl={blog.coverUrl}
      />
      <EditorActionBar formId="blog-form" saveLabel="Simpan Perubahan" />
    </FormSubmitProvider>
  );
}
