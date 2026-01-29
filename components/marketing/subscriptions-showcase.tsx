'use client';

import { CreditCard, Calendar, TrendingDown, AlertCircle, Check, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { SolarInboxInBoldDuotone } from '../icons/icons';

export function SubscriptionsShowcase() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Visual Cards */}
            <ScrollReveal>
              <div className="order-2 lg:order-1 relative">
                {/* Main Subscriptions Card */}
                <div className="relative z-10 rounded-2xl bg-card border p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium">Active Subscriptions</span>
                    <div className="text-xs text-muted-foreground">
                      8 services
                    </div>
                  </div>

                  {/* Monthly Spend */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="text-xs text-muted-foreground mb-1">Total Monthly Spend</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold">$247<span className="text-xl text-muted-foreground">.92</span></div>
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <TrendingDown className="h-3 w-3" />
                        <span>12% vs last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Subscription List */}
                  <div className="space-y-3">
                    {[
                      { name: 'Netflix Premium', amount: '$19.99', nextBilling: 'Dec 15', status: 'active', icon: '🎬' },
                      { name: 'Spotify Family', amount: '$16.99', nextBilling: 'Dec 18', status: 'active', icon: '🎵' },
                      { name: 'GitHub Pro', amount: '$12.00', nextBilling: 'Dec 22', status: 'active', icon: '💻' },
                      { name: 'Adobe Creative', amount: '$54.99', nextBilling: 'Dec 28', status: 'expiring', icon: '🎨' },
                    ].map((sub, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-lg">
                            {sub.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{sub.name}</div>
                            <div className="text-xs text-muted-foreground">Next: {sub.nextBilling}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{sub.amount}</div>
                          <div className="text-xs text-muted-foreground">
                            {sub.status === 'expiring' ? (
                              <span className="text-orange-600 dark:text-orange-400">Expiring</span>
                            ) : (
                              <span className="text-green-600 dark:text-green-400">Active</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Upcoming Renewals Card */}
                <div className="absolute -bottom-6 -right-6 bg-card border rounded-xl shadow-xl p-4 w-64 hidden sm:block z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">Upcoming Renewals</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        3 subscriptions renewing this week
                      </div>
                      <div className="text-xs font-medium">
                        Total: $89.97
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg px-2 py-1 shadow-lg flex items-center gap-2 hidden sm:flex z-10">
                  <SolarInboxInBoldDuotone className="h-4 w-4" />
                  <span className="text-xs font-semibold">Smart Tracking</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Content */}
            <ScrollReveal delay={200}>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Never Miss A Subscription Payment
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Automatically track all your recurring subscriptions and memberships.
                  Get alerts before renewals, identify unused services, and take control of your monthly spending.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    'Automatic subscription detection from transactions',
                    'Renewal alerts and payment reminders',
                    'Identify and cancel unused subscriptions',
                    'Track spending trends over time',
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/signup">
                  <Button size="sm" variant='secondary' className="group">
                    Start Tracking
                    <ArrowUpRight className="ml-1 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
      
      </div>
    </section>
  );
}
