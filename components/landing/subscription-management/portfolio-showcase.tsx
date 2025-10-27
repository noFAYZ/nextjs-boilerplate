'use client';

import { ArrowUpRight, CreditCard, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { MemoryArrowTopRight, SolarInboxInBoldDuotone } from '@/components/icons/icons';
import DecryptedText from '@/components/ui/shadcn-io/decrypted-text';
import { ScrollReveal } from '../scroll-reveal';


export function PortfolioShowcase() {
  return (
    <section id="subscriptions" className="pt-20 flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left: Visual Preview */}
        <ScrollReveal>
          <div className="relative flex items-start justify-start overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 via-orange-500/80 to-pink-600/80 
          h-[280px] w-[380px]  lg:h-[500px] lg:w-[700px] md:h-[400px] md:w-[600px] pr-10 pl-10 pt-10 shadow-lg drop-shadow-xl border-0">
            <Image
              src="/landing/subscription-management.PNG" // replace with your preview image
              alt="Subscription Management Dashboard"
              width={1700}
              height={1200}
              className="absolute -bottom-2 -right-8 object-contain  rounded-t-2xl sm:rounded-tl-2xl"
              priority
            />
          </div>
        </ScrollReveal>

        {/* Right: Content */}
        <ScrollReveal delay={200}>
        <div className="max-w-md space-y-6 text-center lg:text-left bg-muted/60 border p-6 rounded-2xl">
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

          
            <div className="pt-4">
              <Link href="/subscriptions">
                <Button size="sm" className="group rounded-xl">
                 Get Started
                  <MemoryArrowTopRight className="ml-1 h-5 w-5 " />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
