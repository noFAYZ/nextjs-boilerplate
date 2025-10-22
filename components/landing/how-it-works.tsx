'use client';

import Link from 'next/link';
import { UserPlus, Link2, LineChart, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up for free in under 60 seconds. No credit card required to start exploring.',
      details: [
        'Email verification',
        'Secure password setup',
        'Profile customization',
        'Currency preferences',
      ],
      color: 'orange',
    },
    {
      number: '02',
      icon: Link2,
      title: 'Connect Your Accounts',
      description: 'Securely link bank accounts, crypto wallets, and investment platforms with read-only access.',
      details: [
        'Link bank accounts via secure API',
        'Add crypto wallets by address',
        'Connect investment platforms',
        'Import transaction history',
      ],
      color: 'amber',
    },
    {
      number: '03',
      icon: LineChart,
      title: 'Track & Optimize',
      description: 'Get instant insights into your complete financial picture and start optimizing your wealth.',
      details: [
        'Real-time portfolio tracking',
        'Automated analytics',
        'Smart alerts & notifications',
        'Export reports & tax documents',
      ],
      color: 'yellow',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Get started in minutes</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Three simple steps to complete financial clarity
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-300 to-orange-200 dark:from-orange-700 dark:to-orange-800">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-orange-400 dark:text-orange-600" />
                  </div>
                </div>
              )}

              {/* Step Card */}
              <div className="relative rounded-2xl border bg-card p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="mb-6 mt-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/50">
                  <step.icon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>

                {/* Details List */}
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Video/Demo Section */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border bg-card p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">See it in action</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Watch our 2-minute demo to see how easy it is to get started with MoneyMappr
                  and take control of your complete financial picture.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </div>
              </div>

              {/* Demo Placeholder */}
              <div className="flex-1 w-full">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30 border flex items-center justify-center relative overflow-hidden">
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-white dark:bg-neutral-900 shadow-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group">
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-orange-500 border-b-[12px] border-b-transparent ml-1 group-hover:border-l-orange-600" />
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 h-12 w-12 rounded-lg bg-orange-200 dark:bg-orange-900/50 opacity-50" />
                  <div className="absolute bottom-4 right-4 h-16 w-16 rounded-lg bg-amber-200 dark:bg-amber-900/50 opacity-50" />
                  <div className="absolute top-1/2 right-8 h-8 w-8 rounded-full bg-yellow-200 dark:bg-yellow-900/50 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of users worldwide</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              'AES-256 Encryption',
              'SOC 2 Compliant',
              '99.9% Uptime',
              '24/7 Support',
              'GDPR Compliant',
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <Check className="h-4 w-4 text-orange-500" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
