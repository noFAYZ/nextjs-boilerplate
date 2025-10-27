'use client';

import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import Image from 'next/image';
import DecryptedText from '../ui/shadcn-io/decrypted-text';
import { cn } from '@/lib/utils';
import { MemoryArrowTopRight } from '../icons/icons';

export function CryptoShowcase() {
  return (
    <section id="features" className="min-h-screen flex items-center justify-center p-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
       

        {/* Right: Content */}
        <ScrollReveal delay={200}>
          <div className="max-w-md space-y-6 text-center lg:text-left bg-muted/60 border p-6 rounded-2xl">
      
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

           

            <div className="pt-4">
              <Link href="/auth/signup">
                <Button size="sm" className="group rounded-xl">
                  Start Free
                  <MemoryArrowTopRight className="ml-1 h-5 w-5 " />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
 {/* Left: Visual Card */}
        <ScrollReveal>
        <div className="relative flex items-start justify-start overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 via-orange-500/80 to-pink-600/80 
          h-[280px] w-[380px]  lg:h-[500px] lg:w-[700px] md:h-[400px] md:w-[600px] pr-10 pl-10 pt-5 shadow-lg drop-shadow-xl border-0">
        
            <Image
              src="/landing/crypto1.PNG" // replace with your preview image
              alt="Subscription Management Dashboard"
              width={1700}
              height={1200}
              className="absolute -bottom-2 -right-8 object-contain  rounded-t-2xl sm:rounded-tl-3xl"
              priority
            />
          </div>
        </ScrollReveal>


      </div>
    </section>
  );
}
