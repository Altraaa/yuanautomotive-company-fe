"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { value: "semua", label: "Semua" },
  { value: "terbaru", label: "Terbaru (Baru)" },
  { value: "termurah", label: "Harga Termurah" },
  { value: "termahal", label: "Harga Termahal" },
];

/** ProductSort — URL-param-driven view/sort dropdown for the catalog. */
export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("urut") ?? "semua";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "semua") params.delete("urut");
    else params.set("urut", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 font-sans text-sm text-fg-muted">
      <span className="hidden sm:inline">Tampilkan</span>
      <Select value={current} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-auto min-w-[160px] bg-surface" aria-label="Urutkan produk">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
