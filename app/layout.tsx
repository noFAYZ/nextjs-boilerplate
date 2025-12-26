import type { Metadata, Viewport } from "next";
import {  Readex_Pro, Sora, Bricolage_Grotesque, Newsreader,DM_Sans, Funnel_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/providers";
import { GlobalDocks } from "@/components/layout/global-docks";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager";
import { GoogleAnalytics4 } from "@/components/analytics/google-analytics";
import { ConsentBanner } from "@/components/consent/consent-banner";
// Import environment validation to ensure it runs at startup
import "@/lib/config/env";

import localFont from 'next/font/local'


const geistSans = Sora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const readexPro = Readex_Pro({
  variable: "--font-readex",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '700'],
  preload: true,
});

const myFont = localFont({
  src: [
    {
      path: '../public/fonts/arch/archia-regular-webfont.woff2',
      weight: '400',
    },
  ],
  variable: '--font-archia',
  display: 'swap',
})



export const metadata: Metadata = {
  title: "MoneyMappr - All-in-One Financial Dashboard | Banking, Crypto, Investments",
  description: "Track traditional banking, cryptocurrency portfolios, and investments in one powerful platform. Bank-level encryption, smart insights, and real-time forecasting.",
  keywords: "financial management, crypto portfolio, banking dashboard, investment tracking, wealth management",
  authors: [{ name: "MoneyMappr" }],
  creator: "MoneyMappr",
  publisher: "MoneyMappr",

  // OpenGraph for social sharing
  openGraph: {
    title: "MoneyMappr - All-in-One Financial Dashboard",
    description: "Track all your finances in one place with bank-level encryption and smart insights.",
    url: "https://moneymappr.com",
    siteName: "MoneyMappr",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://moneymappr.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MoneyMappr Dashboard Preview",
        type: "image/png",
      },
    ],
  },

  // Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "MoneyMappr - All-in-One Financial Dashboard",
    description: "Track banking, crypto, and investments in one powerful platform.",
    images: ["https://moneymappr.com/twitter-image.png"],
  },

  // Canonical URL
  metadataBase: new URL("https://moneymappr.com"),
  alternates: {
    canonical: "https://moneymappr.com",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>


        {/* Analytics */}
        <GoogleTagManager />
        <GoogleAnalytics4 />
      </head>
      <body
        className={`${myFont.className}`}
      >
        <GoogleTagManagerNoScript />
        <Providers>
            {children}
            <GlobalDocks />
            <ConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
