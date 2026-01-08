'use client';

import Link from 'next/link';
import { Check, Sparkles, Zap, Crown, CrownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SolarCheckCircleBoldDuotone } from '../icons/icons';
import { GameIconsUpgrade } from '../icons';
import { ScrollReveal } from './scroll-reveal';
import Image from 'next/image';

export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with basic tracking',
      features: [
        'Up to 5 manual accounts',
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
      icon: GameIconsUpgrade,
      price: '$14.99',
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
      cta: 'coming soon',
      popular: true,
      highlighted: true,
    },
  
  ];

  return (
    <section id="pricing" className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">


        <ScrollReveal>


       <div className="relative max-w-lg mx-auto mb-8 sm:mb-10 md:mb-12 text-center">
     <div className="mx-auto text-center">
       <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
       Simple, transparent pricing       </h2>
       <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-2 sm:px-0">
       Start free, upgrade when you need more. No hidden fees, cancel anytime.       </p>
     </div>
   </div>


     </ScrollReveal>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-4 sm:p-5 md:p-6 h-fit transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-accent/40 to-muted/95 shadow-lg md:scale-105'
                  : 'bg-card shadow-xs hover:shadow-xl transition-shadow'
              }`}
            >{plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-40">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-xl text-xs font-bold shadow-lg whitespace-nowrap">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Popular Badge */}

<div className='relative flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 overflow-hidden'>

              {/* Icon */}
              <div
                className={`border border-border/80 inline-flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl flex-shrink-0 ${
                  !plan.highlighted
                    ? 'bg-muted backdrop-blur-sm'
                    : 'bg-gradient-to-b from-[#FFB347] via-[#FF7A00] to-[#E66A00] '
                }`}
              >
                <plan.icon
                  className={`h-5 sm:h-6 w-5 sm:w-6 ${
                    !plan.highlighted ? '' : 'text-white'
                  }`}
                />
              </div>
  {/* Plan Name */}
  <h3
                className={`text-xl sm:text-2xl font-bold ${
                  plan.highlighted ? '' : 'text-foreground'
                }`}
              >
                {plan.name}
              </h3>
</div>
            
          

              {/* Price */}
              <div className="mb-6 sm:mb-7 md:mb-8">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl sm:text-5xl font-bold ${
                      plan.highlighted ? '' : 'text-foreground'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span
                      className={`text-xs sm:text-sm ${
                        plan.highlighted ? 'text-muted-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      /{plan.period.split(' ')[0]}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 sm:mt-2 ${
                    plan.highlighted ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {plan.period === 'forever' ? 'No credit card required' : plan.period}
                </p>
              </div>

              {/* CTA Button */}
              <Link href={plan.name === 'Enterprise' ? '#' : '#'} className="w-full">
                <Button
                  className={`w-full mb-6 sm:mb-7 md:mb-8 ${
                    !plan.highlighted
                      ? ' '
                      : ''
                  }`}
                  variant={!plan.highlighted ? 'outline2' : 'default'}
                  disabled
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>

              {/* Features List */}
              <div className="space-y-2 sm:space-y-2.5">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 ${
                    plan.highlighted ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}
                >
                  What&apos;s included:
                </p>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 sm:gap-3">
                    <SolarCheckCircleBoldDuotone
                      className={`h-4 sm:h-4.5 w-4 sm:w-4.5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-orange-500' : 'text-muted-foreground'
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm leading-relaxed ${
                        plan.highlighted ? 'text-muted-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {plan.popular && (<Image src="/logo/log6.svg" alt="Mappr logo" width={56} height={56} className="absolute -z-20 -right-8 sm:-right-10 -bottom-0 w-16 sm:w-20 h-16 sm:h-20 object-contain opacity-60" priority />) }
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
