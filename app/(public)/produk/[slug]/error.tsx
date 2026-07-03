"use client";

import { useEffect } from "react";
import { CtaButton } from "@/components/common/cta-button";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-20 text-center md:px-8">
      <h2 className="font-display text-2xl font-bold italic uppercase text-fg">
        Gagal Memuat Produk
      </h2>
      <p className="max-w-md font-sans text-fg-muted">
        Terjadi kesalahan saat memuat produk ini. Silakan coba lagi.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <CtaButton onClick={reset}>Coba Lagi</CtaButton>
        <CtaButton href="/produk" variant="outline">
          Kembali ke Katalog
        </CtaButton>
      </div>
    </div>
  );
}
