"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaButton, ctaButtonVariants } from "@/components/common/cta-button";
import type { VariantProps } from "class-variance-authority";

type BackButtonProps = VariantProps<typeof ctaButtonVariants> & {
  children?: React.ReactNode;
  className?: string;
};

/** BackButton — steps back one entry in history (router.back(), i.e. -1). Client leaf. */
export function BackButton({ children = "Kembali", variant, size, className }: BackButtonProps) {
  const router = useRouter();
  return (
    <CtaButton variant={variant} size={size} className={className} onClick={() => router.back()}>
      <ArrowLeft className="h-4 w-4" /> {children}
    </CtaButton>
  );
}
