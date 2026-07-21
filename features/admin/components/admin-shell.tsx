"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { Toaster } from "@/components/ui/sonner";

/** Lets any descendant topbar open the mobile sidebar drawer without prop threading. */
const SidebarContext = createContext<{ open: () => void } | null>(null);

export function useAdminSidebar() {
  return useContext(SidebarContext);
}

/**
 * AdminShell — the persistent admin frame: fixed 240px sidebar on desktop, a
 * slide-in drawer on mobile. Wraps every admin route via the (admin) layout.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open: () => setDrawerOpen(true) }}>
      <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen border-r border-border lg:block">
          <AdminSidebar />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 animate-fade-in bg-surface-black/70"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[264px] animate-fade-in border-r border-border">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu"
                className="absolute -right-11 top-3 grid h-9 w-9 place-items-center border border-border bg-surface text-fg-soft"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
              <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0">{children}</main>
      </div>
      {/* Top-right so the toast never sits over the bottom action bar (Simpan) —
          admin can save again immediately without waiting for it to dismiss. */}
      <Toaster position="top-right" />
    </SidebarContext.Provider>
  );
}
