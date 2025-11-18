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
    <section id="features" className="flex items-center justify-center p-12 container mx-auto ">
      <div className=" mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
       

        {/* Right: Content */}
        <ScrollReveal delay={200}>
          <div className="max-w-md space-y-6 text-center lg:text-left bg-muted/60 border p-6 rounded-3xl ">
      
     
                    <h1 className='text-4xl sm:text-4xl font-bold tracking-tight drop-shadow-lg'>Track Crypto Wallets</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
            Visualize all your crypto wallets in one place. Track balances, assets, and activity across multiple blockchains — instantly and effortlessly.
            </p>

           

            <div className="pt-4">
              <Link href="/auth/signup">
                <Button size="sm" className="group " variant='steel'>
                  Start Free
                  <MemoryArrowTopRight className="ml-1 h-5 w-5 " />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
 {/* Left: Visual Card */}
        <ScrollReveal>
        <div className="relative flex items-start justify-start overflow-hidden bg-gradient-to-br from-orange-100 via-orange-500/80 to-pink-600/80 
          h-[280px] w-[380px]  lg:h-[500px] lg:w-[700px] md:h-[400px] md:w-[600px]  pt-5 shadow-lg drop-shadow-xl border-0 rounded-3xl pr-10 ">
        
            <Image
              src="/landing/crypto1.PNG" // replace with your preview image
              alt="Subscription Management Dashboard"
              width={1700}
              height={1200}
              className="absolute -bottom-2 -left-0object-contain  rounded-r-2xl sm:rounded-tr-3xl"
              priority
            />
          </div>
        </ScrollReveal>


      </div>
    </section>
  );
}
