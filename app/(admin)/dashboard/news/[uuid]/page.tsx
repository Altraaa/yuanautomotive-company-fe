import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { NewsDetailView } from "@/features/admin/news/news-detail-view";
import { getAdminNews } from "@/services/admin/news";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const detail = await getAdminNews(uuid);
  return { title: detail ? `${detail.title} — Detail` : "Konten Tidak Ditemukan" };
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const detail = await getAdminNews(uuid);
  if (!detail) notFound();

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "News", href: "/dashboard/news" },
          { label: "Detail" },
        ]}
        title="Detail Konten"
        actions={
          <>
            <CtaButton href="/dashboard/news" variant="outline" className="hidden sm:inline-grid">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </CtaButton>
            <CtaButton href={`/dashboard/news/${detail.uuid}/edit`}>
              <Pencil className="h-4 w-4" /> Edit Konten
            </CtaButton>
          </>
        }
      />
      <NewsDetailView detail={detail} />
    </>
  );
}
