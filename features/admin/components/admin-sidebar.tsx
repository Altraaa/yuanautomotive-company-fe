"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  PenLine,
  Settings,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { adminNavGroups } from "@/features/admin/data";
import { logoutAction } from "@/features/auth/actions";
import type { AdminNavIcon, Tone } from "@/types/ui/admin";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";

const iconMap: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  products: Package,
  blog: PenLine,
  leads: Mail,
  orders: ShoppingBag,
  categories: FolderTree,
  media: ImageIcon,
  cms: Settings,
};

const countToneClass: Record<Tone, string> = {
  gold: "bg-gold/15 text-gold",
  red: "bg-red text-fg",
  grey: "bg-surface text-fg-subtle",
  green: "bg-whatsapp/15 text-whatsapp",
  muted: "bg-surface text-fg-muted",
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-surface-sunken">
      <div className="border-b border-surface px-[22px] pb-[22px] pt-1">
        <BrandMark size="md" subtitle="ADMIN PANEL" />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {adminNavGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <span className="px-3 pb-2 pt-3.5 font-display text-[9.5px] font-bold uppercase tracking-[0.2em] text-fg-faint">
              {group.label}
            </span>
            {group.items.map((item) => {
              const Icon = iconMap[item.icon];
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-[11px] font-sans text-[13px] transition-colors",
                    active
                      ? "border-l-[3px] border-l-red bg-surface font-semibold text-fg"
                      : "font-medium text-fg-muted hover:bg-surface/60 hover:text-fg"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={cn(
                        "ml-auto font-display text-[10px] font-bold leading-none",
                        "px-[7px] py-[3px]",
                        countToneClass[item.countTone ?? "grey"]
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="m-3 flex items-center gap-3 border border-border bg-surface p-3">
        <span className="grid h-[34px] w-[34px] -skew-x-[8deg] place-items-center bg-red font-display text-[13px] font-bold text-fg">
          <span className="skew-x-[8deg]">A</span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-sans text-[12.5px] font-semibold text-fg">Admin Utama</div>
          <div className="font-sans text-[10.5px] text-fg-subtle">SUPERADMIN</div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            title="Logout"
            aria-label="Logout"
            className="text-fg-subtle transition-colors hover:text-red-soft"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </form>
      </div>
    </div>
  );
}
