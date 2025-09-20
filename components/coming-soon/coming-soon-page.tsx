'use client';

import { WaitlistForm } from './waitlist-form';
import { FeaturesModal } from './features-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, CreditCard, DollarSign, PieChart, Shield, TrendingUp, Sparkles, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import Orb from '../ui/shadcn-io/orb';
import DecryptedText from '../ui/shadcn-io/decrypted-text';
import { LogoMappr } from '../icons';
import Image from 'next/image';
export function ComingSoonPage() {
  const features = [
    {
      icon: CreditCard,
      title: 'Banking Integration',
      description: 'Connect all your accounts in one place',
    },
    {
      icon: BarChart3,
      title: 'Crypto Portfolio',
      description: 'Track and manage your crypto investments',
    },
    {
      icon: PieChart,
      title: 'Smart Analytics',
      description: 'AI-powered insights and recommendations',
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your data is encrypted and secure',
    },
    {
      icon: TrendingUp,
      title: 'Investment Tracking',
      description: 'Monitor your portfolio performance',
    },
    {
      icon: DollarSign,
      title: 'Expense Management',
      description: 'Categorize and analyze your spending',
    },
  ];

  return (
    
    <div className="relative w-full  bg-gradient-to-br from-background to-accent/30 overflow-hidden">
         <Image alt="Background" src="/bg-greek2.png" width={600} height={600} className="absolute bottom-0 right-0   opacity-80 pointer-events-none select-none" />
     {/* Orb background  <Image alt="Background" src="/bg.webp" width={600} height={600} className="absolute bottom-0 right-0   opacity-80" />
     
      <div className="absolute top-0 inset-0">
        <Orb 
          hue={200} // Use orange/warm hue to match your design system
          hoverIntensity={1}
          rotateOnHover={true}
          forceHoverState={false}
        />
      </div>*/} 
      
      {/* Content overlay */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 lg:py-16 min-h-screen flex flex-col justify-center">
        <div className="flex flex-col items-center text-center space-y-8 lg:space-y-12 max-w-4xl mx-auto">
          {/* Header */}
          <div className="items-center gap-1 flex w-full ">
    
            
        <LogoMappr className="mx-auto h-24 w-auto text-primary" />
  
              <DecryptedText 
                  text="MoneyMappr"
                  speed={60}
                  maxIterations={15}
                  sequential={false}
                  className={cn(
                    "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
                  
                    "drop-shadow-lg"
                  )}
                  encryptedClassName={cn(
                    "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
                  
                    "drop-shadow-lg"
                  )}
                  animateOn="hover"
                />
           
          
          </div>
     

          {/* Waitlist Form - Enhanced */}
          <div className="space-y-6 w-full max-w-lg">
            <WaitlistForm className="bg-muted/80 backdrop-blur-md rounded-xl p-8 shadow-md border border-border/40" />
            
            {/* Features Button */}
            <div className="text-center">
              <FeaturesModal>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="group  hover:bg-primary/10  hover:text-primary transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Eye className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Discover Features
                  <Sparkles className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </FeaturesModal>
              <p className="text-xs text-muted-foreground/80 mt-2">
                See what's coming in MoneyMappr
              </p>
            </div>
          </div>
        </div>
        
     
      </div>
    </div>
  );
}