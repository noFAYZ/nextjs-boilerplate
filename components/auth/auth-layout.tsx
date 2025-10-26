'use client';

import { LogoMappr } from '@/components/icons';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-background relative"
      style={{
        backgroundImage: "url('/patterns/5.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* === Gradient Overlay === */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/95 pointer-events-none" />

      {/* Left Side - Branding (Hidden on mobile, visible on lg+) */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center px-8 xl:px-20 relative z-10">
        <div className="max-w-lg space-y-8">
          <div className="flex items-center gap-3">
            <LogoMappr className="w-12 h-12" />
            <h1 className="text-3xl font-bold">MoneyMappr</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Take Control of Your Financial Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Track your spending, manage crypto portfolios, and achieve your financial goals all in one place.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your accounts and crypto wallets in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Bank-Level Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and secured with industry-leading protection
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Insightful Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Get actionable insights with powerful analytics and reports
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Built with modern technology for blazing-fast performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12 relative z-10">
        {/* Mobile Logo (Visible on mobile only) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:hidden flex items-center gap-2">
          <LogoMappr className="w-8 h-8" />
          <span className="text-xl font-bold">MoneyMappr</span>
        </div>

        <div className="w-full max-w-md pt-16 sm:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
