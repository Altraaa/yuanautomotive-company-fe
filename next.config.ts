import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Product/blog media are served from Cloudinary by the backend.
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "apiautomotive.yuandewatatimur.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "automotive.yuandewatatimur.com",
        pathname: "/media/**",
      },
    ],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  compress: true,
};

export default nextConfig;
