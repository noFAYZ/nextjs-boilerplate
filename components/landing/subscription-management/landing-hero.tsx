'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Clock, CreditCard, LineChart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '../scroll-reveal';
import { useTheme } from 'next-themes';

export function LandingHero() {
  const { theme } = useTheme();



  return (
    <section
      className="relative pt-40 pb-32 overflow-hidden"
  
    >
      {/* === Background Overlays === */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/20 to-background" />
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.05] bg-[length:40px_40px]" />



      {/* === Main Content === */}
      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">


          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Take Control of Your{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                Subscriptions
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[6px] bg-orange-200 dark:bg-orange-900/50 rounded-sm"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-6 mb-10 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            Track and manage every recurring payment in one place. 
            Get smart alerts, spending insights, and predictive analytics — before your money disappears.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                Explore Features
              </Button>
            </Link>
          </motion.div>

          <p className="mt-6 text-xs text-muted-foreground uppercase tracking-wide">
            Unified Billing • AI Insights • Smart Spend Alerts
          </p>
        </div>

        {/* === Dashboard Preview === */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative mt-20 flex justify-center"
          >
            <div className="relative w-full max-w-6xl rounded-2xl border border-border/60 bg-background/70 backdrop-blur-lg shadow-2xl overflow-hidden">
              {/* Browser Frame */}
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border/50">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto text-xs text-muted-foreground bg-muted/30 rounded-md px-3 py-0.5 w-[220px] truncate">
                  https://app.moneymappr.com
                </div>
              </div>

              {/* Dashboard Image */}
              <div className="relative aspect-[15/9] overflow-hidden">
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
          </motion.div>
        </ScrollReveal>

        {/* === Feature Highlights === */}
        <div className="mt-14 flex flex-wrap justify-center gap-5 text-xs sm:text-sm text-muted-foreground">
          {[
            { Icon: Shield, label: 'Bank-Level Encryption', color: 'text-green-500' },
            { Icon: Clock, label: 'Instant Alerts', color: 'text-blue-500' },
            { Icon: CreditCard, label: 'Smart Spend Insights', color: 'text-orange-500' },
            { Icon: LineChart, label: 'Predictive Analytics', color: 'text-purple-500' },
          ].map(({ Icon, label, color }, i) => (
            <div key={i} className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
