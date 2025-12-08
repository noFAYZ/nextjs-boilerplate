import type { Metadata } from "next";
import {  Readex_Pro, Georama,Andika
  , Space_Grotesk,Sora,Funnel_Display,Parkinsans,Raleway } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/providers";
import { GlobalDocks } from "@/components/layout/global-docks";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager";
import { GoogleAnalytics4 } from "@/components/analytics/google-analytics";
import { ConsentBanner } from "@/components/consent/consent-banner";
// Import environment validation to ensure it runs at startup
import "@/lib/config/env";

import localFont from 'next/font/local'


const geistSans = Readex_Pro({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const myFont = localFont({
  src: '../public/fonts/matter/Matter-Regular.otf',
})



export const metadata: Metadata = {
  title: "MoneyMappr - Coming Soon",
  description: "The future of financial management is here. Track your traditional banking, cryptocurrency portfolios, and investments all in one powerful platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
        <GoogleAnalytics4 />
        
      </head>
      <body
        className={`${geistSans.className}   `}
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
