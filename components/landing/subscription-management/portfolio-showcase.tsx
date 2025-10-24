'use client';

import { CreditCard, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { SolarInboxInBoldDuotone } from '@/components/icons/icons';
import DecryptedText from '@/components/ui/shadcn-io/decrypted-text';
import { ScrollReveal } from '../scroll-reveal';


export function PortfolioShowcase() {
  return (
    <section id="subscriptions" className="pt-20 flex items-center justify-center">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left: Visual Preview */}
        <ScrollReveal>
          <div className="relative flex items-start justify-start overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 via-orange-500/80 to-pink-600/80 h-[600px] w-[900px] pl-20 pt-20 shadow">
            <Image
              src="/landing/subscription-management.PNG" // replace with your preview image
              alt="Subscription Management Dashboard"
              width={1700}
              height={1200}
              className="absolute bottom-0 -right-8 object-contain h-[75%] w-auto rounded-tl-2xl"
              priority
            />
          </div>
        </ScrollReveal>

        {/* Right: Content */}
        <ScrollReveal delay={200}>
          <div className="max-w-md space-y-6 text-center lg:text-left">
            
            <DecryptedText 
              text="Manage All Your Subscriptions"
              speed={50}
              maxIterations={15}
              sequential={true}
              className={cn(
                "text-4xl sm:text-4xl font-semibold tracking-tight drop-shadow-lg"
              )}
              encryptedClassName={cn(
                "text-4xl font-semibold tracking-tight drop-shadow-lg"
              )}
              animateOn="hover"
            />

            <p className="text-muted-foreground text-sm leading-relaxed">
              Gain full control over your recurring payments. Discover hidden charges, track
              renewals, and cancel unwanted subscriptions — all from one smart dashboard.
            </p>

            <div className="space-y-4">
              {[
                'Smart search for 500+ popular services',
                'Instant subscription categorization',
                'Automated renewal reminders',
                'One-click cancellation tracking',
                'Plan comparison & billing insights',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50 flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-orange-600 dark:bg-orange-400" />
                  </div>
                  <span className="text-sm leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/subscriptions">
                <Button size="xs" className="group ">
                  Manage Subscriptions
                  <SolarInboxInBoldDuotone className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
