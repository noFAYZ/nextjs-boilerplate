'use client';

import { Shield, Lock, Eye, Server } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

export function SecuritySection() {
  const features = [
    {
      icon: Lock,
      title: 'Bank-Level Encryption',
      description: 'AES-256 encryption for all data, in transit and at rest.',
    },
    {
      icon: Eye,
      title: 'Read-Only Access',
      description: 'We never ask for private keys or write permissions.',
    },
    {
      icon: Server,
      title: 'SOC 2 Compliant',
      description: 'Regular audits and compliance with industry standards.',
    },
    {
      icon: Shield,
      title: 'GDPR & Privacy',
      description: 'Full compliance with data protection regulations.',
    },
  ];

  return (
    <section id="security" className="py-16 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-semibold mb-2">Enterprise Security</h2>
            <p className="text-sm text-muted-foreground">
              Bank-grade security for your financial data
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 100}>
              <div className="rounded-lg border bg-card p-6 h-full">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/50 flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 flex-wrap text-xs text-muted-foreground">
              <span>SOC 2 Type II</span>
              <span>•</span>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>99.9% Uptime SLA</span>
              <span>•</span>
              <span>24/7 Monitoring</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
