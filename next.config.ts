import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Core configuration */
  devIndicators: false,

  /* Image Optimization */
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache images for 1 year
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
      {
        protocol: 'https',
        hostname: 'img.logo.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'token-icons.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'moneymappr.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* TypeScript */
  typescript: {
    ignoreBuildErrors: true,
  },

  /* Compression */
  compress: true,

  /* Headers for security and caching */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  /* Rewrites for PostHog */
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  /* PostHog support */
  skipTrailingSlashRedirect: true,

  /* Experimental Performance Optimizations */
  // experimental: {
  //   optimizePackageImports: [
  //     'framer-motion',
  //     '@radix-ui/react-dialog',
  //     '@radix-ui/react-dropdown-menu',
  //     '@radix-ui/react-tabs',
  //     '@radix-ui/react-slot',
  //     'lucide-react',
  //     'recharts',
  //   ],
  // },
};

export default nextConfig;
