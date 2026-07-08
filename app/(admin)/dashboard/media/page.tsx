import type { Metadata } from "next";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { MediaUploader } from "@/features/admin/media/media-uploader";

export const metadata: Metadata = {
  title: "Media",
};

export default function MediaPage() {
  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Media" }]}
        title="Media"
      />
      <div className="p-4 md:p-8">
        <MediaUploader />
      </div>
    </>
  );
}
