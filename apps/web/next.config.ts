import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@greenlink/ui", "@greenlink/lib"],
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
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
