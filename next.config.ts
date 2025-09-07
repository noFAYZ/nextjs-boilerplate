import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [new URL('https://cdn.zerion.io/**')],
  },
};

export default nextConfig;
