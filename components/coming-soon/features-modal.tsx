'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  PieChart, 
  Shield, 
  TrendingUp,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Users,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  details: string;
  badge?: string;
  color: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    icon: CreditCard,
    title: 'Smart Banking Integration',
    description: 'Connect all your bank accounts, credit cards, and financial institutions in one secure dashboard.',
    details: 'Automated transaction categorization, real-time balance updates, and seamless synchronization across all your financial accounts.',
    badge: 'Secure',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    icon: BarChart3,
    title: 'Cryptocurrency Portfolio',
    description: 'Advanced crypto tracking with multi-wallet support and real-time market data.',
    details: 'Track NFTs, DeFi positions, staking rewards, and get comprehensive portfolio analytics with tax reporting features.',
    badge: 'Advanced',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    icon: PieChart,
    title: 'AI-Powered Analytics',
    description: 'Get intelligent insights and personalized recommendations for your financial decisions.',
    details: 'Machine learning algorithms analyze your spending patterns, investment performance, and suggest optimization strategies.',
    badge: 'AI Powered',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Enterprise-level encryption and security protocols protect your sensitive financial data.',
    details: 'AES-256 encryption, multi-factor authentication, biometric login, and compliance with PCI DSS and SOC 2 standards.',
    badge: 'Enterprise',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20'
  },
  {
    icon: TrendingUp,
    title: 'Investment Tracking',
    description: 'Monitor stocks, bonds, ETFs, and alternative investments with detailed performance metrics.',
    details: 'Real-time market data, dividend tracking, cost basis calculations, and comprehensive portfolio rebalancing tools.',
    badge: 'Pro',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    icon: DollarSign,
    title: 'Smart Expense Management',
    description: 'Automated categorization and budgeting tools to help you take control of your spending.',
    details: 'Custom budget categories, spending alerts, bill reminders, and detailed expense reports with trend analysis.',
    badge: 'Smart',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },

];

interface FeaturesModalProps {
  children: React.ReactNode;
}

export function FeaturesModal({ children }: FeaturesModalProps) {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  return (
    <Dialog >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-xl ">
      <DialogTitle className="text-3xl font-bold text-foreground mb-4 text-center">

          Exciting Features Coming Soon!
        </DialogTitle>
   

        <div className="overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-2">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-4 rounded-xl outline transition-all duration-200 cursor-pointer shadow-md",
                  "hover:shadow-lg  ",
                  "bg-gradient-to-br from-card/80 to-accent/30 backdrop-blur-sm",
                  selectedFeature?.title === feature.title && " scale-102 shadow-xl"
                )}
                onClick={() => setSelectedFeature(selectedFeature?.title === feature.title ? null : feature)}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Badge */}
                {feature.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "absolute -top-2 -right-2 text-xs font-medium",
                      feature.bgColor,
                      feature.color
                    )}
                  >
                    {feature.badge}
                  </Badge>
                )}

                {/* Icon */}
                <div className={cn(
                  "mb-4 p-3 rounded-lg w-fit transition-colors duration-300",
                  feature.bgColor,
                  "group-hover:scale-110"
                )}>
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Expanded details */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    selectedFeature?.title === feature.title 
                      ? "max-h-32 opacity-100 pt-3 border-t border-border/40" 
                      : "max-h-0 opacity-0"
                  )}>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.details}
                    </p>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className={cn(
                  "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                  "bg-gradient-to-br from-primary/5 to-chart-1/5"
                )} />

                {/* Click indicator */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={cn("p-1 rounded-full", feature.bgColor)}>
                    <Zap className={cn("w-3 h-3", feature.color)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-chart-1/10 border border-primary/20 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h4 className="text-xl font-bold text-foreground">Ready to Get Started?</h4>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Join our waitlist to be among the first to experience these powerful features when MoneyMappr launches.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-primary font-medium">
              <Lock className="w-4 h-4" />
              <span>Early access • Exclusive features • Priority support</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}