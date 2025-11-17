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
    <section id="subscriptions" className="pt-10 flex items-center justify-center">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left: Visual Preview */}
        <ScrollReveal>
          <div className="relative flex items-start justify-start overflow-hidden  bg-gradient-to-br from-orange-100 via-orange-500/80 to-pink-600/80 
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
        <div className="max-w-md space-y-6 text-center lg:text-left bg-muted/60 border p-6 ">
     
            <h1 className='text-4xl sm:text-4xl font-bold tracking-tight drop-shadow-lg'>Manage Subscriptions</h1>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Gain full control over your recurring payments. Discover hidden charges, track
              renewals, and cancel unwanted subscriptions — all from one smart dashboard.
            </p>

                
          
            <div className="pt-4">
              <Link href="/subscriptions">
                <Button size="sm"  className="group ">
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
