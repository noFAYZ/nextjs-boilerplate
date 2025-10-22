'use client';

import {
  Bitcoin,
  Banknote,
  BarChart3,
  RefreshCw,
  Shield,
  Globe2,
  Wallet,
  Coins,
  TrendingUp,
  Lock,
  Bell,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import CardSwap, { Card } from './section-widgets/CardSwap';
import DecryptedText from '../ui/shadcn-io/decrypted-text';
import { cn } from '@/lib/utils';
import ScrambledText from '../ui/shadcn-io/ScrambledText';

export function FeatureGrid() {
  const mainFeatures = [
    {
      icon: Bitcoin,
      title: 'Multi-Chain Crypto Tracking',
      description:
        'Monitor your entire crypto portfolio across 25+ blockchains including Ethereum, Solana, Polygon, and more. Track tokens, NFTs, and DeFi positions with real-time pricing powered by Zerion SDK.',
      gradient: 'from-orange-500 to-amber-500',
      features: ['25+ Chains', 'NFT Tracking', 'DeFi Positions', 'Real-Time Prices'],
      large: true,
    },
    {
      icon: Banknote,
      title: 'Traditional Banking Integration',
      description:
        'Connect 500+ banks and credit cards. Automatically categorize transactions, track spending patterns, and get insights into your cash flow.',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['500+ Banks', 'Auto-Categorization', 'Spending Insights'],
      large: true,
    },
    {
      icon: TrendingUp,
      title: 'Investment Portfolio Tracking',
      description:
        'Track stocks, bonds, ETFs, and other investments. Monitor performance, analyze allocation, and optimize your portfolio with advanced analytics.',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Stocks & ETFs', 'Performance Analytics', 'Allocation Insights'],
      large: false,
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description:
        'Deep insights with customizable dashboards, spending patterns, income vs. expenses, and portfolio performance metrics.',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Custom Dashboards', 'Spending Patterns', 'P&L Tracking'],
      large: false,
    },
    {
      icon: RefreshCw,
      title: 'Real-Time Synchronization',
      description:
        'Stay up-to-date with automatic syncing and live price updates. Background sync keeps your data fresh without manual intervention.',
      gradient: 'from-teal-500 to-cyan-500',
      features: ['Auto-Sync', 'Live Prices', 'Background Updates'],
      large: false,
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description:
        'Enterprise-grade encryption with AES-256. Your data is protected with the highest security standards and never shared.',
      gradient: 'from-red-500 to-rose-500',
      features: ['AES-256 Encryption', '2FA Support', 'Privacy First'],
      large: false,
    },
  ];



  return (
    <section id="features" className=" flex items-center justify-center py-20">
    <div className="container mx-auto px-12 flex flex-col md:flex-row items-center justify-between border rounded-3xl bg-muted/80 dark:bg-muted/50 overflow-hidden relative h-[500px]">
      {/* Hero Text (Left-Aligned) */}
      <div className="max-w-md text-left space-y-6">
       
        <DecryptedText 
                  text="Everything you need to manage your wealth"
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


        <p className="text-sm text-muted-foreground">
          Powerful features designed for complete financial visibility across all your assets
        </p>
      </div>
  
      {/* CardSwap (Right Side) */}
      <div className='flex absolute right-5 h-[400px] '>
                      {/* Section Header */}
     
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={false}
            
            
          >
            {mainFeatures.map((feature) => (
              <Card
                key={feature.title}
                className={`group rounded-2xl border bg-card border-border p-8 hover:shadow-xl  ${
                  feature.large ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Icon with Gradient Background */}
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                  {feature.description}
                </p>

                {/* Feature List */}
                <div className="flex flex-wrap gap-2">
                  {feature.features.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            ))}

         
          </CardSwap>

          
        </div>
    </div>
  </section>
  );
}
