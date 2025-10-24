'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Clock, CreditCard, LineChart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaitlistFormCompact } from '@/components/coming-soon/waitlist-form-compact';
import { ScrollReveal } from '../scroll-reveal';
import { useTheme } from 'next-themes';

export function LandingHero() {
  const { theme } = useTheme();

  const icons = [
    { icon: CreditCard, color: 'text-orange-500', top: '15%', left: '-5%' },
    { icon: Shield, color: 'text-green-500', top: '40%', left: '2%' },
    { icon: Clock, color: 'text-blue-500', bottom: '10%', left: '5%' },
    { icon: LineChart, color: 'text-purple-500', bottom: '5%', right: '10%' },
    { icon: Zap, color: 'text-amber-500', top: '25%', right: '-4%' },
  ];

  return (
    <section className="relative pt-44 pb-28 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/patterns/5.webp')",
      }}
    >
      {/* === Gradient Overlay === */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/10 to-background pointer-events-none" />

      {/* === Subtle Grid Overlay === */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/patterns/grid.svg')] bg-[length:42px_42px]" />

      <div className="container mx-auto px-6 relative">
        {/* === Header Content === */}
        <div className="mx-auto max-w-4xl text-center mb-20 relative z-10">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-orange-50/80 dark:bg-orange-900/30 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-900 dark:text-orange-100">
                Smart Subscription Tracking & Spend Control
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            Take Control of Your{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-yellow-300 bg-clip-text text-transparent">
                Subscriptions
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 dark:bg-orange-900/40 -rotate-1" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-base md:text-lg font-medium text-white ">
            Track all your subscriptions, analyze spending, and take proactive control with smart alerts and predictive analytics.
          </p>

          {/* Form 
          <WaitlistFormCompact className="mb-8" />*/}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="sm" className="w-full sm:w-auto">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-white uppercase tracking-wide">
            Subscription analytics • Smart alerts • Unified billing insights
          </p>
        </div>

    {/* === Dashboard Preview with Animated Lines & Icons === */}
<ScrollReveal>
  <div className="w-full relative flex justify-center items-center ">
  
    {/* === Browser Frame === */}
    <div className="relative mx-auto rounded-2xl border border-border bg-background/90 shadow-2xl overflow-hidden backdrop-blur-lg w-full max-w-7xl">
      {/* Browser Top Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/60 border-b border-border">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-auto text-xs text-muted-foreground bg-muted rounded-md px-3 py-0.5 w-[200px] truncate">
          https://app.moneymappr.com
        </div>
      </div>

      {/* Dashboard Image */}
      <div className="relative aspect-[15/10]">
        {theme && (
          <Image
            src={
              theme === 'dark' || theme === 'dark-pro'
                ? '/landing/subscription-management-dark.PNG'
                : '/landing/subscription-management.PNG'
            }
            alt="Subscription Management Dashboard"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>
    </div>
  </div>
</ScrollReveal>


        {/* === Feature Badges === */}
        <div className="text-center text-xs text-muted-foreground flex flex-wrap justify-center gap-3 mt-12">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-green-500" />
            <span>Bank-Level Encryption</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-blue-500" />
            <span>Instant Billing Alerts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-3 w-3 text-orange-500" />
            <span>Smart Spend Insights</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LineChart className="h-3 w-3 text-purple-500" />
            <span>Predictive Analytics</span>
          </div>
        </div>
      </div>
    </section>
  );
}
