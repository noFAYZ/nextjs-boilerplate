import type { Metadata } from "next";
import {  Readex_Pro, Rubik,Sen, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/providers";

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
      <body
        className={`${geistSans.className}  antialiased`}
      >
        <Providers> 
        {children}</Providers>
      </body>
    </html>
  );
}
