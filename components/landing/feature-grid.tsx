'use client';

import {
  CreditCard,
  Bell,
  BarChart3,
  CalendarClock,
  Shield,
  ArrowRight,
  XCircle,
} from 'lucide-react';
import CardSwap, { Card } from './section-widgets/CardSwap';
import DecryptedText from '../ui/shadcn-io/decrypted-text';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function FeatureGrid() {
  const [cardSwapHeight, setCardSwapHeight] = useState(280);
  const containerRef = useRef<HTMLDivElement>(null);

  const subscriptionFeatures = [
    {
      icon: CreditCard,
      title: 'Centralized Subscription Tracking',
      description:
        'Connect Netflix, Spotify, Adobe, AWS, and more in one dashboard. Monitor all recurring payments instantly.',
      gradient: 'from-primary/90 to-primary/60',
      features: ['Auto Import', '500+ Services', 'Unified Dashboard'],
      large: true,
    },
    {
      icon: Bell,
      title: 'Smart Renewal Reminders',
      description:
        'Stay ahead with timely email or in-app notifications before subscription renewals.',
      gradient: 'from-primary/90 to-orange-400/80',
      features: ['Smart Alerts', 'Custom Reminders', 'Multi-Channel'],
      large: true,
    },
    {
      icon: XCircle,
      title: 'One-Click Cancellations',
      description:
        'Cancel subscriptions effortlessly with direct links or one-click actions, saving time.',
      gradient: 'from-orange-500/90 to-primary/70',
      features: ['Cancel Fast', 'Smart Links', 'Refund Tracking'],
    },
    {
      icon: BarChart3,
      title: 'Spend Analytics & Insights',
      description:
        'Visualize expenses with analytics to spot wasteful spending and track trends.',
      gradient: 'from-primary/80 to-orange-400/80',
      features: ['Spend Breakdown', 'Yearly View', 'Auto Categorization'],
    },
    {
      icon: CalendarClock,
      title: 'Upcoming Charge Forecast',
      description:
        'Plan budgets with a 30-day forecast of upcoming subscription charges.',
      gradient: 'from-primary/70 to-primary/40',
      features: ['30-Day Forecast', 'Smart Budgeting', 'Predictive Insights'],
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description:
        'AES-256 encryption and compliance standards ensure your data stays private.',
      gradient: 'from-orange-500/80 to-primary/60',
      features: ['AES-256 Encryption', 'Zero Data Sharing', '2FA Protection'],
    },
  ];

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      let height = 280; // xs
      if (vw >= 1280) {
        height = Math.min(480, window.innerHeight * 0.5); // xl: 50vh, max 480px
      } else if (vw >= 1024) {
        height = 400; // lg: 400px
      } else if (vw >= 768) {
        height = 340; // md: 340px
      } else if (vw >= 640) {
        height = 300; // sm: 300px
      }
      setCardSwapHeight(height);
    };

    updateDimensions();
    let timeout: NodeJS.Timeout;
    const debounceUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateDimensions, 100);
    };
    window.addEventListener('resize', debounceUpdate);
    return () => window.removeEventListener('resize', debounceUpdate);
  }, []);

  return (
    <section
      id="features"
      className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 flex items-center justify-center bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-12"
      >
        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-5 md:space-y-6 max-w-md sm:max-w-lg lg:max-w-xl mx-auto lg:mx-0">
          <h2>
            <DecryptedText
              text="More coming soon"
              speed={45}
              maxIterations={12}
              sequential
              className={cn(
                'text-2xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold tracking-tight text-foreground',
              )}
              encryptedClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
              animateOn="hover"
            />
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm   leading-relaxed max-w-prose">
            Take control of your subscriptions with our powerful tracker. Manage Netflix, Spotify, and more in a secure dashboard. Cancel plans, get alerts, and optimize spending effortlessly.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
            {[
              'Subscription Tracker',
              'Renewal Notifications',
              'Spending Analytics',
              'Secure Dashboard',
            ].map((feature) => (
              <span
                key={feature}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted text-muted-foreground/80 border border-muted/40 text-xs sm:text-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-200"
              >
                {feature}
              </span>
            ))}
          </div>
          <Link
            href="#waitlist"
            className="inline-block mt-4 sm:mt-6 text-sm sm:text-base font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            Join the Waitlist <ArrowRight className="inline h-4 sm:h-5 w-4 sm:w-5 ml-1" />
          </Link>
        </div>

        {/* Feature Cards (Right) */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center">
          <CardSwap
            width="min(90vw, 480px)"
            height={cardSwapHeight}
            cardDistance={Math.min(40, window.innerWidth * 0.035)} // ~3.5vw, max 40px
            verticalDistance={Math.min(30, window.innerWidth * 0.22)} // ~2vw, max 25px
            delay={4000}
            pauseOnHover
          >
            {subscriptionFeatures.map((feature) => (
              <Card
                key={feature.title}
                className={cn(
                  'group rounded-2xl border border-border/80 dark:bg-background bg-white',
                  'overflow-hidden p-0 w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[460px] xl:max-w-[700px]',
                )}
              >
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border/80 bg-muted/60 backdrop-blur-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="h-2 sm:h-2.5 md:h-3 w-2 sm:w-2.5 md:w-3 rounded-full bg-red-500/80"></span>
                    <span className="h-2 sm:h-2.5 md:h-3 w-2 sm:w-2.5 md:w-3 rounded-full bg-yellow-400/80"></span>
                    <span className="h-2 sm:h-2.5 md:h-3 w-2 sm:w-2.5 md:w-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <div className="w-2/3 h-3 sm:h-3.5 md:h-4 bg-muted-foreground/20 rounded-full"></div>
                  <div className="w-3 sm:w-4"></div>
                </div>
                <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                  <div className="relative mb-3 sm:mb-4 md:mb-5 inline-flex h-10 sm:h-11 md:h-12 lg:h-13 w-10 sm:w-11 md:w-12 lg:w-13 items-center justify-center rounded-2xl bg-accent shadow-lg">
                    <feature.icon className="h-5 sm:h-5.5 md:h-6 lg:h-6.5 w-5 sm:w-5.5 md:w-6 lg:w-6.5" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-orange-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4 md:mb-5">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-3 sm:mb-4">
                    {feature.features.map((item) => (
                      <span
                        key={item}
                        className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 text-xs sm:text-xs md:text-sm rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 sm:mt-3 md:mt-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-sm font-medium text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore feature</span>
                    <ArrowRight className="h-3 sm:h-3.5 md:h-4 w-3 sm:w-3.5 md:w-4" />
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