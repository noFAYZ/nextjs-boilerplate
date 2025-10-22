'use client';

import { Zap, Clock, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';

export function AutomationShowcase() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <ScrollReveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Automate Your Financial Workflow
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Set up intelligent automation rules and let MoneyMappr handle the routine tasks.
                  From recurring syncs to smart alerts, automation keeps you informed without the effort.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    'Schedule automatic portfolio syncs',
                    'Price alerts for crypto assets',
                    'Spending category notifications',
                    'Weekly financial summaries',
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50 flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-orange-600 dark:bg-orange-400" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="group">
                    Explore Automation
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Right: Visual Cards */}
            <ScrollReveal delay={200}>
              <div className="relative">
                {/* Main Automation Rules Card */}
                <div className="relative z-10 rounded-2xl bg-card border p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium">Active Automations</span>
                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-medium">4 Running</span>
                    </div>
                  </div>

                  {/* Automation List */}
                  <div className="space-y-3">
                    {[
                      {
                        name: 'Daily Portfolio Sync',
                        schedule: 'Every day at 9:00 AM',
                        icon: Clock,
                        status: 'active',
                        lastRun: '8 hours ago'
                      },
                      {
                        name: 'ETH Price Alert',
                        schedule: 'When ETH > $2,500',
                        icon: Bell,
                        status: 'active',
                        lastRun: 'Triggered 2h ago'
                      },
                      {
                        name: 'Spending Report',
                        schedule: 'Every Monday',
                        icon: TrendingUp,
                        status: 'active',
                        lastRun: '2 days ago'
                      },
                      {
                        name: 'Low Balance Alert',
                        schedule: 'When balance < $500',
                        icon: Zap,
                        status: 'waiting',
                        lastRun: 'Not triggered'
                      },
                    ].map((automation, index) => (
                      <div
                        key={index}
                        className="py-3 px-4 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              automation.status === 'active'
                                ? 'bg-green-100 dark:bg-green-950/50'
                                : 'bg-muted'
                            }`}>
                              <automation.icon className={`h-4 w-4 ${
                                automation.status === 'active'
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{automation.name}</div>
                              <div className="text-xs text-muted-foreground">{automation.schedule}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-11">
                          Last run: {automation.lastRun}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -right-6 bg-card border rounded-xl shadow-xl p-4 w-56 hidden sm:block z-10">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Automations</div>
                      <div className="text-2xl font-bold">12</div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Executions this week</span>
                        <span className="font-semibold">47</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 hidden sm:flex z-10">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-semibold">Smart Automation</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
