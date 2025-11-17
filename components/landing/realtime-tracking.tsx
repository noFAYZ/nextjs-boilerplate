'use client';

import { Zap, RefreshCw, Bell, Check, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';

export function RealtimeTracking() {
  return (
    <section className="py-20 bg-muted/30">
      <div className=" mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <ScrollReveal>
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Stay Synced With Automatic Updates
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Never miss a beat with real-time synchronization across all your accounts.
                  Get instant updates on transactions, balances, and price movements.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    'Auto-sync every 5 minutes for Pro users',
                    'Instant transaction notifications',
                    'Live cryptocurrency price updates',
                    'Background sync with zero disruption',
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/signup">
                  <Button  variant="secondary" className="group">
                    See How It Works
                    <ArrowUpRight className="ml-1 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Right: Visual Cards */}
            <ScrollReveal delay={200}>
              <div className="order-1 lg:order-2 relative">
                {/* Sync Status Card */}
                <div className="relative z-10 rounded-2xl bg-card border p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium">Sync Status</span>
                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-medium">Live</span>
                    </div>
                  </div>

                  {/* Recent Syncs */}
                  <div className="space-y-3">
                    {[
                      { account: 'Metamask Wallet', time: 'Just now', amount: '+$2,450', status: 'success' },
                      { account: 'Chase Checking', time: '2 min ago', amount: '-$89.42', status: 'success' },
                      { account: 'Coinbase Pro', time: '5 min ago', amount: '+$1,240', status: 'success' },
                      { account: 'Binance', time: '8 min ago', amount: '+$850', status: 'syncing' },
                    ].map((sync, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            sync.status === 'success'
                              ? 'bg-green-100 dark:bg-green-950/50'
                              : 'bg-orange-100 dark:bg-orange-950/50'
                          }`}>
                            {sync.status === 'success' ? (
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <RefreshCw className="h-4 w-4 text-orange-600 dark:text-orange-400 animate-spin" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{sync.account}</div>
                            <div className="text-xs text-muted-foreground">{sync.time}</div>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${
                          sync.amount.startsWith('+')
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-muted-foreground'
                        }`}>
                          {sync.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Notification Card */}
                <div className="absolute -bottom-6 -left-6 bg-card border rounded-xl shadow-xl p-4 w-72 hidden sm:block">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">Price Alert Triggered</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        ETH reached your target of $2,500
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                        2 minutes ago
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 hidden sm:flex">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-semibold">Auto-Sync Active</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
