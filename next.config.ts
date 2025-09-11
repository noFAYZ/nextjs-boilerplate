import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {

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
      new URL('https://cdn.zerion.io/**')
    ]
    
  },
};

export default nextConfig;
