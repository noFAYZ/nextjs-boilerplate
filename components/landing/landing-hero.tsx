'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, Search, Plus, Calculator, Download, CreditCard, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaitlistForm } from '../coming-soon/waitlist-form';
import { WaitlistFormCompact } from '../coming-soon/waitlist-form-compact';
import { ScrollReveal } from './scroll-reveal';

export function LandingHero() {
  return (
    <section className="relative pt-60 pb-20 overflow-hidden">
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
        {/* Hero Content */}
        <div className="mx-auto max-w-5xl text-center mb-32">
          {/* Badge
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 text-xs font-medium shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-900 dark:text-orange-100">
                Unified Financial Platform for Crypto & Banking
              </span>
            </div>
          </div> */}

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
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
          <p className="mx-auto mb-10 max-w-3xl text-md md:text-base text-muted-foreground leading-relaxed">
            Track traditional banking, multi-chain crypto wallets, and investment portfolios
            with real-time analytics. MoneyMappr brings all your finances together.
          </p>


          <WaitlistFormCompact className='mb-10'/>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/auth/signup">
              <Button size="sm" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
        <ScrollReveal>
{/* Dashboard Preview - Below Hero */}
<div className="mx-auto max-w-5xl mb-16">
  <div className="relative">
    {/* Animated ambient glow */}
    <div className="absolute -inset-6 opacity-70 animate-[pulse_6s_ease-in-out_infinite]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,140,0,0.25),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(255,215,0,0.15),transparent_70%),radial-gradient(circle_at_50%_100%,rgba(255,80,0,0.2),transparent_70%)] blur-3xl" />
    </div>

    {/* Preview Card Container */}
    <div className="relative rounded-3xl p-[3px] shadow-[0_0_40px_-10px_rgba(255,140,0,0.3)] bg-[conic-gradient(at_30%_120%,#f97316_0deg,#facc15_120deg,#ec4899_240deg,#f97316_360deg)]">
      <div className="relative rounded-3xl overflow-hidden bg-background border border-white/10 aspect-[19.9/11] backdrop-blur-sm">
        {/* Subtle texture/pattern overlay */}
        <div className="absolute inset-0 opacity-[0.17] bg-[url('/patterns/grid.svg')] bg-[length:24px_24px]" />
        
        {/* Dashboard image */}
        <Image
          src="/landing/dash.png"
          alt="MoneyMappr Dashboard Preview"
          fill
          className="object-cover rounded-3xl"
          priority
        />

        {/* Optional glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
      </div>


    </div>
  </div>
</div>
</ScrollReveal>

   
      </div>
    </section>
  );
}
