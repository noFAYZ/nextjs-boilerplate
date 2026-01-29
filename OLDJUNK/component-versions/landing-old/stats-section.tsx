'use client';

import { ScrollReveal } from './scroll-reveal';

export function StatsSection() {
  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '$5B+', label: 'Assets Tracked' },
    { value: '1M+', label: 'Monthly Transactions' },
    { value: '99.9%', label: 'Uptime SLA' },
  ];

  return (
    <section className="py-12 border-y bg-muted/30">
      <div className=" mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 100}>
              <div className="text-center group cursor-default">
                <div className="text-2xl md:text-3xl font-bold mb-1 transition-all duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
