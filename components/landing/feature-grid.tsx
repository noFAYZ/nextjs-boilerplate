'use client';

import {
  CreditCard,
  Bell,
  BarChart3,
  CalendarClock,
  Shield,
  Search,
  TrendingUp,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import CardSwap, { Card } from './section-widgets/CardSwap';
import DecryptedText from '../ui/shadcn-io/decrypted-text';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export function FeatureGrid() {
  const [cardSwapHeight, setCardSwapHeight] = useState(300); // Default height
  const containerRef = useRef<HTMLDivElement>(null);

  const subscriptionFeatures = [
    {
      icon: CreditCard,
      title: 'Centralized Subscription Tracking',
      description:
        'Connect all your recurring payments in one place — Netflix, Spotify, Adobe, AWS, and more. Instantly see how much you’re spending each month.',
      gradient: 'from-primary/90 to-primary/60',
      features: ['Auto Import', '500+ Services', 'Unified Dashboard'],
      large: true,
    },
    {
      icon: Bell,
      title: 'Smart Renewal Reminders',
      description:
        'Never miss or forget a renewal again. Get timely notifications before charges hit your card — email or in-app.',
      gradient: 'from-primary/90 to-orange-400/80',
      features: ['Smart Alerts', 'Custom Reminders', 'Multi-Channel'],
      large: true,
    },
    {
      icon: XCircle,
      title: 'One-Click Cancellations',
      description:
        'Cancel unwanted subscriptions directly or access easy cancellation links with one click — saving hours of hassle.',
      gradient: 'from-orange-500/90 to-primary/70',
      features: ['Cancel Fast', 'Smart Links', 'Refund Tracking'],
    },
    {
      icon: BarChart3,
      title: 'Spend Analytics & Insights',
      description:
        'Visualize your recurring expenses with advanced analytics. Detect wasteful spending and identify yearly vs. monthly trends.',
      gradient: 'from-primary/80 to-orange-400/80',
      features: ['Spend Breakdown', 'Yearly View', 'Auto Categorization'],
    },
    {
      icon: CalendarClock,
      title: 'Upcoming Charge Forecast',
      description:
        'Get a timeline of what’s due in the next 30 days. Plan ahead, adjust budgets, and avoid unexpected debits.',
      gradient: 'from-primary/70 to-primary/40',
      features: ['30-Day Forecast', 'Smart Budgeting', 'Predictive Insights'],
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description:
        'Your financial data is encrypted with AES-256 and secured using the latest compliance standards. Privacy-first by design.',
      gradient: 'from-orange-500/80 to-primary/60',
      features: ['AES-256 Encryption', 'Zero Data Sharing', '2FA Protection'],
    },
  ];

  // Dynamically adjust CardSwap height based on viewport
  useEffect(() => {
    const updateHeight = () => {
      const vw = window.innerWidth;
      let height = 300; // Default for mobile
      if (vw >= 1024) {
        height = Math.min(500, window.innerHeight * 0.6); // lg: 60vh, max 500px
      } else if (vw >= 640) {
        height = 350; // sm: 350px
      }
      setCardSwapHeight(height);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <section
      id="features"
      className="relative py-10 sm:py-16 lg:py-20 flex items-center justify-center bg-gradient-to-b from-background via-muted/30 to-background"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6 lg:px-12"
      >
        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6 max-w-lg mx-auto lg:mx-0">
          <DecryptedText
            text="More Coming Soon"
            speed={45}
            maxIterations={12}
            sequential
            className={cn(
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
            )}
            encryptedClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            animateOn="hover"
          />

          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
            Track, manage, and optimize your recurring payments — all in one dashboard.
            Cancel unwanted plans, get smart reminders, and gain spending clarity across every
            subscription you use.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm">
            {[
              'Automated Sync',
              'Smart Alerts',
              'Expense Insights',
              'Secure Dashboard',
            ].map((feature) => (
              <span
                key={feature}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted text-muted-foreground/80 border border-muted/40 text-xs sm:text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Cards (Right) */}
        <div
          className="relative w-full flex items-start justify-start"
          style={{ height: `${cardSwapHeight}px` }}
        >
          <CardSwap
            cardDistance={Math.min(60, window.innerWidth * 0.05)} // ~5vw, max 60px
            verticalDistance={Math.min(40, window.innerWidth * 0.03)} // ~3vw, max 40px
            delay={4500}
          >
            {subscriptionFeatures.map((feature) => (
              <Card
                key={feature.title}
                className={cn(
                  'group rounded-2xl border border-border/80 dark:bg-background bg-white',
                  'overflow-hidden p-0 w-full sm:w-[90%] md:w-[80%] lg:w-[400px]',
                )}
              >
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border/80 bg-muted/60 backdrop-blur-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500/80"></span>
                    <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-400/80"></span>
                    <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <div className="w-2/3 h-3 sm:h-4 bg-muted-foreground/20 rounded-full"></div>
                  <div className="w-3 sm:w-4"></div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Icon with glow */}
                  <div className="relative mb-4 sm:mb-6 inline-flex h-10 sm:h-12 lg:h-14 w-10 sm:w-12 lg:w-14 items-center justify-center rounded-2xl bg-accent shadow-lg">
                    <feature.icon className="h-5 sm:h-6 lg:h-7 w-5 sm:w-6 lg:w-7" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-orange-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-5">
                    {feature.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {feature.features.map((item) => (
                      <span
                        key={item}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore feature</span>
                    <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4" />
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}