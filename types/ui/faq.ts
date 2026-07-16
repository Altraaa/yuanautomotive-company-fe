/** UI FAQ types consumed by components (public accordion + admin manage). */

export type FaqStatus = "Published" | "Draft";

/** Public FAQ item — what the accordion renders. `category: null` = ungrouped. */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
};

/** A category group of FAQs for the public accordion. */
export type FaqGroup = {
  /** `null` = ungrouped ("Lainnya") bucket. */
  category: string | null;
  items: FaqItem[];
};

/** Admin manage-table row (includes drafts + ordering meta). */
export type AdminFaqRow = {
  uuid: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  status: FaqStatus;
  createdAt?: string; // ISO
};

/** Full admin FAQ record for the editor (same fields as the row). */
export type AdminFaqDetail = AdminFaqRow;

/**
 * Group a flat list of FAQs by category, preserving first-seen order. Ungrouped
 * items (`category: null`) always land in a trailing bucket so named groups
 * render first in the accordion.
 */
export function groupFaqs(items: FaqItem[]): FaqGroup[] {
  const named = new Map<string, FaqItem[]>();
  const ungrouped: FaqItem[] = [];

  for (const item of items) {
    const key = item.category?.trim();
    if (!key) {
      ungrouped.push(item);
      continue;
    }
    const bucket = named.get(key);
    if (bucket) bucket.push(item);
    else named.set(key, [item]);
  }

  const groups: FaqGroup[] = [...named.entries()].map(([category, groupItems]) => ({
    category,
    items: groupItems,
  }));
  if (ungrouped.length) groups.push({ category: null, items: ungrouped });
  return groups;
}
