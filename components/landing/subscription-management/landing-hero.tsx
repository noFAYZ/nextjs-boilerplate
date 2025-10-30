'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { WaitlistFormCompact } from '@/components/coming-soon/waitlist-form-compact';
import {
  DuoIconsCreditCard,
  SolarChartSquareBoldDuotone,
  SolarClockCircleBoldDuotone,
  SolarShieldBoldDuotone,
} from '@/components/icons/icons';
import { ScrollReveal } from '../scroll-reveal';
import { RotatingHeadline } from '@/components/ui/RotatingWords';
import { cn } from '@/lib/utils';
import { AdvancedBackgroundGrid } from '../BackgroundGrid';

// Feature highlights config
const FEATURES = [
  {
    Icon: SolarShieldBoldDuotone,
    label: 'Bank-Level Encryption',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    Icon: SolarClockCircleBoldDuotone,
    label: 'Instant Alerts',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    Icon: DuoIconsCreditCard,
    label: 'Smart Spend Insights',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    Icon: SolarChartSquareBoldDuotone,
    label: 'Predictive Analytics',
    color: 'text-purple-600 dark:text-purple-400',
  },
] as const;

const DASHBOARD_IMAGES = {
  light: '/landing/subscription-management.PNG',
  dark: '/landing/subscription-management-dark.PNG',
  alt: 'Subscription Management Dashboard showing AI-powered insights, recurring payments, and predictive spend analytics',
} as const;

export function LandingHero() {
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Fallback if theme is not ready
  const currentTheme = resolvedTheme?.startsWith('dark') ? 'dark' : 'light';
  const imageSrc = DASHBOARD_IMAGES[currentTheme] || DASHBOARD_IMAGES.light;

  // Motion variants with reduced motion support
  const fadeInUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: 'easeOut' },
  };

  return (
    <section
      className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
      aria-labelledby="hero-heading"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
     {/* Advanced Floating Grid */}
     <AdvancedBackgroundGrid 
      variant="mixed" 
      density={1.5}
      className="block "
    />
      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-xl lg:max-w-3xl text-center">
          {/* Heading */}
          <motion.h1
            id="hero-heading"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
              'font-semibold tracking-tight leading-tight',
              'bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'
            )}
          >
            Take Control of Your{' '}
            <span
              className="relative inline-flex h-[1.2em] items-center justify-center overflow-hidden align-middle"
              role="status"
              aria-live="polite"
            >
              <RotatingHeadline />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-muted-foreground"
          >
            Track and manage every recurring payment in one place. Get smart alerts,
            spending insights, and predictive analytics — before your money disappears.
          </motion.p>

          {/* CTA Form */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-col justify-center sm:flex-row"
          >
            <WaitlistFormCompact />
          </motion.div>

          {/* Tagline */}
          <p className="mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            Unified Billing • AI Insights • Smart Spend Alerts
          </p>
        </div>

        {/* Dashboard Preview */}
        <ScrollReveal>
          <motion.div
            {...scaleIn}
            transition={{ delay: 0.9 }}
            className="mt-16 flex justify-center px-4 sm:mt-20"
          >
            <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-background/70 shadow-2xl backdrop-blur-xl">
              {/* Browser Frame */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex-1 truncate rounded bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                  app.yourdomain.com/dashboard
                </div>
              </div>

              {/* Dashboard Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted/20">
                <Image
                  src={imageSrc}
                  alt={DASHBOARD_IMAGES.alt}
                  fill
                  priority
                  className="object-cover object-top transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  quality={95}
                  onError={(e) => {
                    e.currentTarget.src = DASHBOARD_IMAGES.light; // fallback
                  }}
                />
                {/* Optional: shimmer placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Feature Highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground/80 md:mt-16">
          {FEATURES.map(({ Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className="flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1.5 backdrop-blur-sm"
            >
              <Icon className={cn('h-4 w-4', color)} />
              <span className="font-medium">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}