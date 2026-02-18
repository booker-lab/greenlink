import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@greenlink/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
