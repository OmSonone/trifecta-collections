import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    // Allow local uploads directory
    unoptimized: true,
  },
};

export default nextConfig;
