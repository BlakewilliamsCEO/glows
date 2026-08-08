import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/glows",
  assetPrefix: "/glows",
};

export default nextConfig;
