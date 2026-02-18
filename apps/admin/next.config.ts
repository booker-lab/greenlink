import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@greenlink/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
