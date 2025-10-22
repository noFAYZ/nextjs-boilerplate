'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingHero() {
  return (
    <section className="relative pt-62 pb-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-background to-background dark:from-orange-950/10 dark:via-background dark:to-background" />

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="mx-auto max-w-5xl items-center">
          {/* Badge 
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 text-xs font-medium shadow-sm">
              <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-900 dark:text-orange-100">
                Unified Financial Platform for Crypto & Banking
              </span>
            </div>
          </div>*/}

          {/* Main Headline */}
          <h1 className="mb-6 text-center text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Your Complete Financial
            <br />
            Picture in{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent">
                One Place
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 dark:bg-orange-900/30 -rotate-1" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-3xl text-center text-lg md:text-xl text-muted-foreground leading-relaxed">
            Track traditional banking, multi-chain crypto wallets, and investment portfolios
            with real-time analytics. MoneyMappr brings all your finances together.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="">
                Start Free Trial
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Feature Highlights 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: '25+ Blockchains',
                description: 'Track crypto across all major chains',
              },
              {
                icon: Shield,
                title: '500+ Banks',
                description: 'Connect bank accounts securely',
              },
              {
                icon: Zap,
                title: 'Real-Time Sync',
                description: 'Live updates and instant notifications',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border bg-card p-2 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/50">
                  <item.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm ">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>*/}

          {/* Stats 
          <div className="mt-16 pt-12 border-t grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '$2B+', label: 'Assets Tracked' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>*/}
        </div>
      </div>
    </section>
  );
}
