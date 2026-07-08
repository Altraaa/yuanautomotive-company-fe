import type { Metadata } from "next";
import Link from "next/link";
import { CMS_SECTIONS, getCmsSection } from "@/services/admin/cms";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { CmsEditor } from "@/features/admin/cms/cms-editor";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CMS",
};

type SearchParams = Promise<{ key?: string }>;

export default async function CmsPage({ searchParams }: { searchParams: SearchParams }) {
  const { key } = await searchParams;
  const activeKey = key && key.trim() ? key.trim() : CMS_SECTIONS[0].key;
  const known = CMS_SECTIONS.find((s) => s.key === activeKey);
  const label = known?.label ?? activeKey;

  const data = await getCmsSection(activeKey);

  return (
    <>
      <AdminTopbar
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "CMS" }]}
        title="Kelola Konten (CMS)"
      />
      <div className="flex flex-col gap-[18px] p-4 md:p-8">
        {/* Section chips */}
        <div className="flex flex-wrap items-center gap-2">
          {CMS_SECTIONS.map((s) => {
            const isActive = s.key === activeKey;
            return (
              <Link
                key={s.key}
                href={`/dashboard/cms?key=${s.key}`}
                className={cn(
                  "border px-3.5 py-2 font-display text-[11.5px] font-bold uppercase tracking-[0.05em] transition-colors",
                  isActive
                    ? "border-red bg-red text-fg"
                    : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg"
                )}
              >
                {s.label}
              </Link>
            );
          })}
        </div>

        <CmsEditor
          sectionKey={activeKey}
          sectionLabel={label}
          initialData={data}
          exists={data !== null}
        />
      </div>
    </>
  );
}
