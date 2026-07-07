export type ApiProductSpec = { label: string; value: string };

export type ApiProductCard = {
  slug: string;
  name: string;
  category: string;
  price: string;
  image_url: string | null;
  badge: string | null;
};

export type ApiProductDetail = ApiProductCard & {
  description: string;
  specs: ApiProductSpec[];
  compatibility: string[];
  gallery: string[];
};

export type ApiAdminProductRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  badge: string | null;
  status: "Published" | "Draft";
};

export type ApiAdminProductDetail = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  category_id: string;
  price: string;
  price_wholesale: string | null;
  stock: number;
  badge: string | null;
  is_published: boolean;
  is_featured: boolean;
  description: string;
  specs: ApiProductSpec[];
  compatibility: string[];
  gallery: string[];
  view_count: number;
  lead_count: number;
  preorder_count: number;
  author: string;
  created_at: string;
  updated_at: string;
};
