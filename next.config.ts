import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const config: NextConfig = {
  output: "export",
  basePath: isProd ? "/glows" : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default config;
