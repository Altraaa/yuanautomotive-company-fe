export type ApiDashboardSummary = {
  products: { total: number; published: number };
  blogs: { total: number; published: number };
  leads: { total: number; new: number };
  orders: { total: number; new: number; revenue_estimate: string };
  deltas: { leads_pct_vs_prev_period: number; orders_pct_vs_prev_period: number };
};

export type ApiTimeseries = {
  metric: string;
  range: string;
  points: { date: string; value: number }[];
};

export type ApiCategoryCount = { items: { category: string; count: number }[] };

export type ApiTopProducts = {
  items: { slug: string; name: string; order_count: number; qty_total: number }[];
};

export type ApiStatusBreakdown = {
  entity: string;
  items: { status: string; count: number }[];
};

export type ApiRecent = {
  leads: { id: string; name: string; created_at: string; status: string }[];
  orders: {
    id: string;
    customer_name: string;
    items_count: number;
    created_at: string;
    status: string;
  }[];
};
