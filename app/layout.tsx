import type { Metadata } from "next";
import {  Readex_Pro, Rubik,Sen, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/providers";
import { GlobalDocks } from "@/components/layout/global-docks";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager";

// Import environment validation to ensure it runs at startup
import "@/lib/config/env";

const geistSans = Readex_Pro({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
      </head>
      <body
        className={`${geistSans.className}   antialiased`}
      >
        <GoogleTagManagerNoScript />
        <Providers>
            {children}
            <GlobalDocks />
        </Providers>


      </body>
    </html>
  );
}
