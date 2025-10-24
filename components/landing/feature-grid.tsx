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

export function FeatureGrid() {
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

  return (
    <section
      id="features"
      className="relative py-20 flex items-center justify-center bg-gradient-to-b from-background via-muted/30 to-background"
    >
      <div className="relative container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-6 lg:px-12 ">
        
        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 max-w-lg">
          <DecryptedText
            text="Everything you need to manage your subscriptions"
            speed={45}
            maxIterations={12}
            sequential
            className={cn(
              'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
             
            )}
            encryptedClassName="text-4xl font-bold"
            animateOn="hover"
          />

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Track, manage, and optimize your recurring payments — all in one dashboard.
            Cancel unwanted plans, get smart reminders, and gain spending clarity across every
            subscription you use.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm">
            {[
              'Automated Sync',
              'Smart Alerts',
              'Expense Insights',
              'Secure Dashboard',
            ].map((feature) => (
              <span
                key={feature}
                className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground/80 border border-muted/40"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>


{/* Feature Cards (Right) */}
<div className="relative w-full  flex items-center justify-center h-[300px] sm:h-[300px] lg:h-[500px]">
  <CardSwap cardDistance={60} verticalDistance={40} delay={4500} >
    {subscriptionFeatures.map((feature) => (
      <Card
        key={feature.title}
        className={cn(
          'group  rounded-2xl border border-border/80 dark:bg-background bg-white ',
          ' overflow-hidden p-0'
        )}
      >
        {/* Browser Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/80 bg-muted/60 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-400/80"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
          </div>
          <div className="w-2/3 h-4 bg-muted-foreground/20 rounded-full"></div>
          <div className="w-4"></div>
        </div>

        {/* Card Content */}
        <div className="p-6 sm:p-8">
          {/* Icon with glow */}
          <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent  shadow-lg">
            <feature.icon className="h-7 w-7 " />
  
          </div>

          {/* Title & Description */}
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground group-hover:text-orange-500 transition-colors">
            {feature.title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">
            {feature.description}
          </p>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {feature.features.map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-xs sm:text-sm rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span>Explore feature</span>
            <ArrowRight className="h-4 w-4" />
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
