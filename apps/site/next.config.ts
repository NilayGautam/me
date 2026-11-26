import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default config;
