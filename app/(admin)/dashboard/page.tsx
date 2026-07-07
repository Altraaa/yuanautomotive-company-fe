import type { Metadata } from "next";
import { getDashboard } from "@/services/admin/dashboard";
import { ActivityCard } from "@/features/admin/components/activity-card";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { BarList } from "@/features/admin/components/bar-list";
import { DeltaChip } from "@/features/admin/components/delta-chip";
import { DonutChart } from "@/features/admin/components/donut-chart";
import { LineChart } from "@/features/admin/components/line-chart";
import { Panel } from "@/features/admin/components/panel";
import { StatTile } from "@/features/admin/components/stat-tile";

export const metadata: Metadata = {
  title: "Dashboard",
};

function TrendValue({ value, tone, delta, direction }: {
  value: string;
  tone: "gold" | "red";
  delta: string;
  direction: "up" | "down";
}) {
  return (
    <div className="text-right">
      <div className={`font-display text-[22px] font-bold ${tone === "gold" ? "text-gold" : "text-red"}`}>
        {value}
      </div>
      <DeltaChip value={delta} direction={direction} className="text-[10px]" />
    </div>
  );
}

export default async function DashboardPage() {
  const {
    stats: dashboardStats,
    leadsTrend,
    ordersTrend,
    productsByCategory,
    orderStatusBreakdown,
    topProducts,
    recentLeads,
    recentOrders,
  } = await getDashboard();

  return (
    <>
      <AdminTopbar eyebrow="Ringkasan" title="Dashboard" showTools />

      <div className="flex flex-col gap-4 p-4 md:gap-[22px] md:p-8">
        {/* KPI tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatTile key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Trend line charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel
            title="Tren Leads"
            subtitle="30 hari terakhir"
            action={<TrendValue value="130" tone="gold" delta="12.5%" direction="up" />}
          >
            <LineChart data={leadsTrend} tone="gold" />
          </Panel>
          <Panel
            title="Tren Pre-Order"
            subtitle="30 hari terakhir"
            action={<TrendValue value="76" tone="red" delta="3.2%" direction="down" />}
          >
            <LineChart data={ordersTrend} tone="red" />
          </Panel>
        </div>

        {/* Distribution + ranking */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.25fr_1fr]">
          <Panel title="Produk / Kategori">
            <DonutChart slices={productsByCategory} total={42} unit="SKU" />
          </Panel>
          <Panel
            title="Produk Terlaris"
            action={
              <span className="font-sans text-[10.5px] tracking-[0.08em] text-fg-subtle">
                by pre-order
              </span>
            }
          >
            <BarList items={topProducts} />
          </Panel>
          <Panel title="Status Pre-Order">
            <DonutChart slices={orderStatusBreakdown} total={76} unit="ORDER" />
          </Panel>
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActivityCard title="Leads Terbaru" href="/dashboard/leads" items={recentLeads} tone="gold" />
          <ActivityCard
            title="Pre-Order Terbaru"
            href="/dashboard/pre-order"
            items={recentOrders}
            tone="red"
          />
        </div>
      </div>
    </>
  );
}
