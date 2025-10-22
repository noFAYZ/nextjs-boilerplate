'use client';

import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import Image from 'next/image';
import DecryptedText from '../ui/shadcn-io/decrypted-text';
import { cn } from '@/lib/utils';

export function CryptoShowcase() {
  return (
    <section id="features" className="min-h-screen flex items-center justify-center ">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
       

        {/* Right: Content */}
        <ScrollReveal delay={200}>
          <div className="max-w-md space-y-6 text-center lg:text-left">
      
            <DecryptedText 
                  text="Aggregate Crypto Wallets"
                  speed={50}
                  maxIterations={15}
                  sequential={true}
                  className={cn(
                    "text-4xl sm:text-4xl font-semibold tracking-tight",
                  
                    "drop-shadow-lg"
                  )}
                  encryptedClassName={cn(
                    "text-4xl font-semibold tracking-tight",
                  
                    "drop-shadow-lg"
                  )}
                  animateOn="hover"
                />
            <p className="text-muted-foreground text-sm leading-relaxed">
            Visualize all your crypto wallets in one place. Track balances, assets, and activity across multiple blockchains — instantly and effortlessly.
            </p>

            <div className="space-y-4">
              {[
  'Multi-chain wallet aggregation and analytics',
  'Instant portfolio valuation with on-chain data',
  'Cross-wallet asset tracking in real time',
  'Live token prices and transaction insights',
].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-800/50 flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-orange-600 dark:bg-orange-400" />
                  </div>
                  <span className="text-sm leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/auth/signup">
                <Button size="sm" className="group px-6">
                  Start Free
                  <TrendingUp className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
 {/* Left: Visual Card */}
        <ScrollReveal>
          <div className="relative flex items-start justify-start overflow-hidden rounded-3xl bg-gradient-to-bl from-orange-100 via-orange-500/80 to-orange-600/80 h-[600px] w-[900px] pl-20 pt-20 shadow-xl">
            <Image
              src="/landing/crypto1.png"
              alt="Dashboard Preview"
              width={1700}
              height={1200}
              className="absolute bottom-0 -right-8 object-contain h-[80%] w-auto rounded-tl-2xl"
              priority
            />
          </div>
        </ScrollReveal>


      </div>
    </section>
  );
}
