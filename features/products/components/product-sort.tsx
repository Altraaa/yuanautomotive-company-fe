"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Harga Termurah" },
  { value: "termahal", label: "Harga Termahal" },
];

/** ProductSort — URL-param-driven sort dropdown for the catalog. */
export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("urut") ?? "terbaru";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "terbaru") params.delete("urut");
    else params.set("urut", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 font-sans text-sm text-fg-muted">
      <span className="hidden sm:inline">Urutkan</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-surface px-3 py-2 font-sans text-sm text-fg outline-none focus:border-gold"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface text-fg">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
