'use client';

import Link from 'next/link';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with basic tracking',
      features: [
        'Up to 3 connected accounts',
        'Basic portfolio analytics',
        'Manual sync only',
        'Email support',
        '30-day transaction history',
        'Mobile responsive',
      ],
      cta: 'Get Started',
      popular: false,
      highlighted: false,
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$12',
      period: 'per month',
      description: 'For serious financial tracking and optimization',
      features: [
        'Unlimited connected accounts',
        'Advanced analytics & insights',
        'Real-time auto-sync',
        'Priority email support',
        'Unlimited transaction history',
        'Export reports & tax documents',
        'Custom alerts & notifications',
        'Portfolio allocation tracking',
        'Multi-currency support',
      ],
      cta: 'Start Free Trial',
      popular: true,
      highlighted: true,
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      period: 'contact us',
      description: 'For teams and organizations with advanced needs',
      features: [
        'Everything in Pro',
        'Team collaboration features',
        'API access & webhooks',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee (99.99% uptime)',
        'Advanced security features',
        'White-label options',
        'Custom reporting',
      ],
      cta: 'Contact Sales',
      popular: false,
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className=" mx-auto px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 h-fit ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-orange-500/20 to-amber-600/75 text-white  shadow-2xl scale-105'
                  : 'bg-card shadow-sm hover:shadow-xl transition-shadow'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Icon */}
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  plan.highlighted
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-orange-100 dark:bg-orange-950/50'
                }`}
              >
                <plan.icon
                  className={`h-6 w-6 ${
                    plan.highlighted ? 'text-white' : 'text-orange-600 dark:text-orange-400'
                  }`}
                />
              </div>

              {/* Plan Name */}
              <h3
                className={`text-2xl font-bold mb-2 ${
                  plan.highlighted ? 'text-white' : 'text-foreground'
                }`}
              >
                {plan.name}
              </h3>

              {/* Description */}
              <p
                className={`text-sm mb-6 ${
                  plan.highlighted ? 'text-white/90' : 'text-muted-foreground'
                }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-5xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-white/80' : 'text-muted-foreground'
                      }`}
                    >
                      /{plan.period.split(' ')[0]}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    plan.highlighted ? 'text-white/70' : 'text-muted-foreground'
                  }`}
                >
                  {plan.period === 'forever' ? 'No credit card required' : plan.period}
                </p>
              </div>

              {/* CTA Button */}
              <Link href={plan.name === 'Enterprise' ? '#' : '/auth/signup'}>
                <Button
                  className={`w-full mb-8 ${
                    plan.highlighted
                      ? 'bg-white hover:bg-neutral-100 text-orange-600 shadow-lg'
                      : ''
                  }`}
                  variant={plan.highlighted ? 'secondary' : 'default'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
    
              {/* Features List */}
              <div className="space-y-3">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                    plan.highlighted ? 'text-white/80' : 'text-muted-foreground'
                  }`}
                >
                  What's included:
                </p>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-white' : 'text-orange-500'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-white/95' : 'text-muted-foreground'
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ / Additional Info
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border bg-card p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: 'Can I switch plans anytime?',
                  answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.',
                },
                {
                  question: 'Is my data secure?',
                  answer: 'Absolutely. We use bank-level AES-256 encryption and never store your private keys or passwords.',
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, debit cards, and support annual billing for discounts.',
                },
                {
                  question: 'Do you offer refunds?',
                  answer: 'Yes, we offer a 14-day money-back guarantee. No questions asked if you\'re not satisfied.',
                },
              ].map((faq) => (
                <div key={faq.question}>
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Enterprise CTA 
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Need a custom solution for your organization?
          </p>
          <Link href="#">
            <Button variant="outline" size="lg">
              Contact Sales for Enterprise
            </Button>
          </Link>
        </div>*/}
      </div>
    </section>
  );
}
