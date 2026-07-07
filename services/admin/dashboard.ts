import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { withFallback } from "@/lib/api-fallback";
import type {
  ApiCategoryCount,
  ApiDashboardSummary,
  ApiRecent,
  ApiStatusBreakdown,
  ApiTimeseries,
  ApiTopProducts,
} from "@/types/api/dashboard";
import type {
  ActivityItem,
  ActivityStatus,
  BarItem,
  DashboardStat,
  DonutSlice,
  Tone,
} from "@/types/ui/admin";
import * as mock from "@/features/admin/data";

/**
 * ADMIN dashboard aggregation (RSC). Fetches the six §6 endpoints in parallel
 * and maps them to the token-driven chart shapes the components already use.
 * Falls back to the full mock bundle when the backend is unreachable.
 */

export type DashboardBundle = {
  stats: DashboardStat[];
  leadsTrend: number[];
  ordersTrend: number[];
  productsByCategory: DonutSlice[];
  orderStatusBreakdown: DonutSlice[];
  topProducts: BarItem[];
  recentLeads: ActivityItem[];
  recentOrders: ActivityItem[];
};

const mockBundle = (): DashboardBundle => ({
  stats: mock.dashboardStats,
  leadsTrend: mock.leadsTrend,
  ordersTrend: mock.ordersTrend,
  productsByCategory: mock.productsByCategory,
  orderStatusBreakdown: mock.orderStatusBreakdown,
  topProducts: mock.topProducts,
  recentLeads: mock.recentLeads,
  recentOrders: mock.recentOrders,
});

const catTones: Tone[] = ["red", "gold", "grey", "muted", "green"];
const statusTones: Record<string, Tone> = {
  NEW: "gold",
  PROCESSED: "muted",
  DONE: "green",
  CANCELLED: "red",
  CONTACTED: "muted",
  CLOSED: "grey",
};

const pct = (n: number) => `${Math.abs(n).toFixed(1)}%`;
const shortRupiah = (value: string) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return n >= 1e9 ? `${(n / 1e9).toFixed(0)} M` : `${(n / 1e6).toFixed(0)} jt`;
};
const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
const asStatus = (s: string): ActivityStatus => {
  const up = s.toUpperCase();
  return (["NEW", "CONTACTED", "PROCESSED", "DONE", "CANCELLED"] as const).includes(
    up as ActivityStatus
  )
    ? (up as ActivityStatus)
    : "NEW";
};

function toStats(s: ApiDashboardSummary): DashboardStat[] {
  return [
    {
      label: "Produk",
      value: String(s.products.total),
      hint: `published · ${s.products.total - s.products.published} draft`,
      hintHighlight: String(s.products.published),
      hintTone: "green",
      accent: "gold",
    },
    {
      label: "Blog",
      value: String(s.blogs.total),
      hint: `published · ${s.blogs.total - s.blogs.published} draft`,
      hintHighlight: String(s.blogs.published),
      hintTone: "green",
      accent: "gold",
    },
    {
      label: "Leads",
      value: String(s.leads.total),
      hint: "baru belum ditangani",
      hintHighlight: String(s.leads.new),
      hintTone: "gold",
      accent: "red",
      delta: pct(s.deltas.leads_pct_vs_prev_period),
      deltaDirection: s.deltas.leads_pct_vs_prev_period >= 0 ? "up" : "down",
    },
    {
      label: "Pre-Order",
      value: String(s.orders.total),
      hint: `· ${s.orders.new} baru`,
      hintHighlight: `Est. Rp ${shortRupiah(s.orders.revenue_estimate)}`,
      hintTone: "gold",
      accent: "gradient",
      delta: pct(s.deltas.orders_pct_vs_prev_period),
      deltaDirection: s.deltas.orders_pct_vs_prev_period >= 0 ? "up" : "down",
    },
  ];
}

function toBars(t: ApiTopProducts): BarItem[] {
  const max = Math.max(...t.items.map((i) => i.order_count), 1);
  return t.items.map((i) => ({
    label: i.name,
    value: i.order_count,
    width: Math.round((i.order_count / max) * 100),
  }));
}

export function getDashboard(): Promise<DashboardBundle> {
  return withFallback(async () => {
    const [summary, leadsTs, ordersTs, cats, tops, status, recent] = await Promise.all([
      apiClient.get<ApiDashboardSummary>(endpoints.dashboard.summary, { auth: true }),
      apiClient.get<ApiTimeseries>(endpoints.dashboard.timeseries, {
        auth: true,
        query: { metric: "leads", range: "30d", granularity: "day" },
      }),
      apiClient.get<ApiTimeseries>(endpoints.dashboard.timeseries, {
        auth: true,
        query: { metric: "orders", range: "30d", granularity: "day" },
      }),
      apiClient.get<ApiCategoryCount>(endpoints.dashboard.productsByCategory, { auth: true }),
      apiClient.get<ApiTopProducts>(endpoints.dashboard.topProducts, {
        auth: true,
        query: { limit: 5 },
      }),
      apiClient.get<ApiStatusBreakdown>(endpoints.dashboard.statusBreakdown, {
        auth: true,
        query: { entity: "orders" },
      }),
      apiClient.get<ApiRecent>(endpoints.dashboard.recent, { auth: true }),
    ]);

    return {
      stats: toStats(summary),
      leadsTrend: leadsTs.points.map((p) => p.value),
      ordersTrend: ordersTs.points.map((p) => p.value),
      productsByCategory: cats.items.map((c, i) => ({
        label: c.category,
        value: c.count,
        tone: catTones[i % catTones.length],
      })),
      orderStatusBreakdown: status.items.map((s) => ({
        label: s.status,
        value: s.count,
        tone: statusTones[s.status.toUpperCase()] ?? "muted",
      })),
      topProducts: toBars(tops),
      recentLeads: recent.leads.map((l) => ({
        initials: initials(l.name),
        title: l.name,
        subtitle: "",
        status: asStatus(l.status),
      })),
      recentOrders: recent.orders.map((o) => ({
        initials: initials(o.customer_name),
        title: o.customer_name,
        subtitle: `${o.items_count} item`,
        status: asStatus(o.status),
      })),
    };
  }, mockBundle, { alwaysFallback: true });
}
