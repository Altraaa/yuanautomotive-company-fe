"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

/** ProductGallery — main image + selectable thumbnails (client leaf). */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : ["/placeholder-hero.png"];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden border border-gold/35 bg-gradient-to-b from-surface-sunken to-surface-black">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat gambar ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden border bg-surface-sunken transition-colors",
                i === active ? "border-gold" : "border-border hover:border-gold/60"
              )}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
