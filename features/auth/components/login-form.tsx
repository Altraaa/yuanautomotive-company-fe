"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, KeyRound } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormValues } from "@/features/auth/schema";
import { loginAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

const fieldWrap =
  "flex h-[50px] items-center gap-3 border border-border bg-surface-sunken px-4 transition-colors focus-within:border-gold";
const inputClass =
  "h-auto flex-1 border-0 bg-transparent px-0 py-0 font-sans text-sm text-fg outline-none placeholder:text-fg-faint focus:border-transparent";
const labelClass =
  "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const remember = watch("remember");

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);
    const result = await loginAction(values);
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]" noValidate>
      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Email</span>
        <div className={fieldWrap}>
          <AtSign className="h-4 w-4 shrink-0 text-gold" />
          <Input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="admin@yuandewata.id"
            className={inputClass}
          />
        </div>
        {errors.email && <span className="font-sans text-xs text-red-soft">{errors.email.message}</span>}
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Password</span>
        <div className={fieldWrap}>
          <KeyRound className="h-4 w-4 shrink-0 text-gold" />
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••••"
            className={cn(inputClass, "tracking-[0.16em]")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-faint transition-colors hover:text-fg-soft"
          >
            {showPassword ? "Sembunyi" : "Tampilkan"}
          </button>
        </div>
        {errors.password && (
          <span className="font-sans text-xs text-red-soft">{errors.password.message}</span>
        )}
      </label>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox
            checked={remember}
            onCheckedChange={(v) => setValue("remember", v === true)}
          />
          <span className="font-sans text-[12.5px] text-fg-muted">Ingat perangkat ini</span>
        </label>
        <Link
          href="/login"
          className="font-sans text-[12.5px] font-semibold text-gold transition-colors hover:text-gold-soft"
        >
          Lupa password?
        </Link>
      </div>

      {submitError && (
        <p className="border border-red/50 bg-red/10 px-4 py-2.5 font-sans text-sm text-red-soft">
          {submitError}
        </p>
      )}

      <CtaButton size="lg" disabled={isSubmitting} className="mt-1.5 w-full">
        {isSubmitting ? "Memproses…" : "Masuk ke Dashboard →"}
      </CtaButton>

      <div className="mt-0.5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="font-sans text-[10.5px] tracking-[0.14em] text-fg-faint">AKSES TERBATAS</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <p className="text-center font-sans text-[11.5px] leading-relaxed text-fg-faint">
        Hanya untuk administrator terdaftar. Aktivitas login tercatat.
      </p>
    </form>
  );
}
