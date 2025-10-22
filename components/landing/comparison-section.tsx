'use client';

import { Check, X } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

export function ComparisonSection() {
  const features = [
    { name: 'Multi-chain crypto tracking', moneyMappr: true, competitors: false },
    { name: 'Traditional banking', moneyMappr: true, competitors: true },
    { name: 'Real-time sync', moneyMappr: true, competitors: false },
    { name: 'NFT & DeFi tracking', moneyMappr: true, competitors: false },
    { name: 'Advanced analytics', moneyMappr: true, competitors: 'Limited' },
    { name: 'Tax reporting', moneyMappr: true, competitors: 'Limited' },
    { name: 'API access', moneyMappr: true, competitors: false },
  ];

  return (
    <section id="comparison" className="py-16 bg-background scroll-mt-20">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-semibold mb-2">Why MoneyMappr</h2>
            <p className="text-sm text-muted-foreground">
              Complete financial visibility in one platform
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b text-sm font-medium">
                <div>Feature</div>
                <div className="text-center">MoneyMappr</div>
                <div className="text-center">Traditional Apps</div>
              </div>
              {features.map((feature, index) => (
                <div
                  key={feature.name}
                  className={`grid grid-cols-3 gap-4 p-4 text-sm ${
                    index < features.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="text-muted-foreground">{feature.name}</div>
                  <div className="text-center">
                    {feature.moneyMappr === true ? (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto" />
                    ) : typeof feature.moneyMappr === 'string' ? (
                      <span className="text-xs">{feature.moneyMappr}</span>
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {feature.competitors === true ? (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto" />
                    ) : typeof feature.competitors === 'string' ? (
                      <span className="text-xs text-muted-foreground">{feature.competitors}</span>
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
