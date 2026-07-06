import type { Metadata } from "next";
import { BrandMark } from "@/features/admin/components/brand-mark";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Masuk Admin",
  description: "Panel administrator Yuan Dewata Automotive.",
  robots: { index: false, follow: false },
};

const loginStats = [
  { value: "42", label: "SKU AKTIF", tone: "text-fg" },
  { value: "130", label: "TOTAL LEADS", tone: "text-gold" },
  { value: "76", label: "PRE-ORDER", tone: "text-fg" },
] as const;

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg lg:grid lg:grid-cols-[1.15fr_1fr]">
      {/* Brand panel */}
      <section className="relative flex flex-col justify-between gap-10 overflow-hidden border-b border-border bg-gradient-to-br from-surface-raised to-surface-sunken p-8 lg:gap-14 lg:border-b-0 lg:border-r lg:p-14">
        {/* Decorative skewed racing stripes (desktop only) */}
        <div
          aria-hidden
          className="absolute -right-24 -top-16 hidden h-[560px] w-24 rotate-[20deg] bg-red/15 lg:block"
        />
        <div
          aria-hidden
          className="absolute -right-10 -top-16 hidden h-[560px] w-16 rotate-[20deg] bg-gold/20 lg:block"
        />

        <BrandMark size="lg" subtitle="AUTOMOTIVE" className="relative" />

        <div className="relative">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            Panel Administrator
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold uppercase italic leading-[1.08] text-fg md:text-4xl lg:text-[44px]">
            Kelola Katalog
            <br />
            <span className="text-red">EV</span> Kamu.
          </h1>
          <p className="mt-3.5 max-w-md font-sans text-[15px] leading-relaxed text-fg-muted">
            Produk, blog, leads, dan pre-order dalam satu dashboard. Masuk untuk melanjutkan.
          </p>
        </div>

        <div className="relative flex flex-wrap gap-7">
          {loginStats.map((s) => (
            <div key={s.label}>
              <div className={`font-display text-[26px] font-bold ${s.tone}`}>{s.value}</div>
              <div className="font-sans text-[11px] font-medium tracking-[0.06em] text-fg-subtle">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form panel */}
      <section className="flex flex-col justify-center bg-surface p-8 sm:p-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="border-t-[3px] border-t-red pt-[22px]">
            <h2 className="font-display text-[26px] font-bold uppercase italic text-fg">Masuk</h2>
            <p className="mt-2 font-sans text-[13px] text-fg-subtle">
              Gunakan kredensial administrator kamu.
            </p>
          </div>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
