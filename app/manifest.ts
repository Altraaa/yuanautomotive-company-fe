import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * PWA manifest — Next serves this at /manifest.webmanifest and auto-links it.
 * Icons live in public/ so they resolve at the root URL paths below.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#141416",
    theme_color: "#141416",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
