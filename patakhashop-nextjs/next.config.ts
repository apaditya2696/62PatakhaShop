import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'jspdf'],
  },
};

export default nextConfig;
