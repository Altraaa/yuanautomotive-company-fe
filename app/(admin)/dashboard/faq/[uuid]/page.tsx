import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { FaqDetailView } from "@/features/admin/faqs/faq-detail-view";
import { getAdminFaq } from "@/services/admin/faqs";

type Params = Promise<{ uuid: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uuid } = await params;
  const detail = await getAdminFaq(uuid);
  return { title: detail ? `${detail.question} — Detail` : "FAQ Tidak Ditemukan" };
}

export default async function FaqDetailPage({ params }: { params: Params }) {
  const { uuid } = await params;
  const detail = await getAdminFaq(uuid);
  if (!detail) notFound();

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "FAQ", href: "/dashboard/faq" },
          { label: "Detail" },
        ]}
        title="Detail FAQ"
        actions={
          <>
            <CtaButton href="/dashboard/faq" variant="outline" className="hidden sm:inline-grid">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </CtaButton>
            <CtaButton href={`/dashboard/faq/${detail.uuid}/edit`}>
              <Pencil className="h-4 w-4" /> Edit FAQ
            </CtaButton>
          </>
        }
      />
      <FaqDetailView detail={detail} />
    </>
  );
}
