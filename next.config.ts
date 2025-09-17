import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.zerion.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.zapper.xyz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chain-icons.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ]
  },
};

export default nextConfig;
