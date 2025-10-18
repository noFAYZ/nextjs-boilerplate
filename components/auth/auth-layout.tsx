'use client';

import { LogoMappr } from '@/components/icons';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-start lg:justify-center px-4 sm:px-6 lg:px-20 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-primary/5 via-primary/10 to-background border-l border-border relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LogoMappr className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">MoneyMappr</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your all-in-one financial management platform
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">
                Take control of your financial future
              </h2>
              <p className="text-muted-foreground text-lg">
                Track your banking, crypto, and investments all in one beautiful dashboard.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Unified Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    See all your accounts, wallets, and portfolios in one place with real-time updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Bank-Level Security
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted and protected with industry-leading security standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Smart Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get insights into your spending patterns and investment performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Built with modern technology for a seamless, responsive experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
            <div>
              <div className="text-3xl font-bold text-foreground">10k+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">$50M+</div>
              <div className="text-sm text-muted-foreground">Assets Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
