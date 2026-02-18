import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@greenlink/ui"],
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@greenlink/ui", "@greenlink/lib", "lucide-react"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
