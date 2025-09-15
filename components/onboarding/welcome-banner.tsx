'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Sparkles,
  Wallet,
  PieChart,
  TrendingUp,
  Target,
  ArrowRight
} from 'lucide-react';
import { useAuthStore, selectUser } from '@/lib/stores';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import Link from 'next/link';

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const user = useAuthStore(selectUser);
  const { viewMode, isBeginnerMode } = useViewMode();

  useEffect(() => {
    // Check if user just completed onboarding
    const justCompleted = localStorage.getItem('onboarding-just-completed');
    const bannerDismissed = localStorage.getItem('welcome-banner-dismissed');
    
    if (justCompleted === 'true' && !bannerDismissed) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Remove the flag so it doesn't show again
      localStorage.removeItem('onboarding-just-completed');
      
      // Auto-hide animation effect after a delay
      setTimeout(() => setIsAnimating(false), 3000);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('welcome-banner-dismissed', 'true');
  };

  const quickActions = [
    {
      title: 'Connect Wallet',
      description: 'Add your first crypto wallet',
      icon: Wallet,
      href: '/dashboard/accounts/wallet/add',
      color: 'bg-blue-500'
    },
    {
      title: 'View Portfolio',
      description: 'See your investments overview',
      icon: PieChart,
      href: '/dashboard/portfolio',
      color: 'bg-green-500'
    },
    {
      title: 'Set Goals',
      description: 'Create your first financial goal',
      icon: Target,
      href: '/dashboard/goals/create',
      color: 'bg-purple-500'
    }
  ];

  if (!isVisible) return null;

  return (
    <Card className={`
      mb-6  bg-gradient-to-r from-primary/10 to-secondary/10
      ${isAnimating ? 'animate-in slide-in-from-top-4 duration-100' : ''}
    `}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12  rounded-xl bg-gradient-to-r from-orange-600/60 to-pink-600/70 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to MoneyMappr, {user?.name?.split(' ')[0] || 'there'}! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your account is all set up. Here's how to get started:
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground -mt-2 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="p-2 bg-muted/40 cursor-pointer ">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-muted rounded-lg flex items-center justify-center  `}>
                      <Icon className="h-5 w-5 " />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium ">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium">Your setup:</span>
          <Badge variant={isBeginnerMode ? 'secondary' : 'default'} className="text-xs">
            {viewMode === 'beginner' ? 'Beginner Mode' : 'Pro Mode'}
          </Badge>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            You can change this anytime in the sidebar
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Start by connecting a crypto wallet or bank account to see real data
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
          >
            Got it, thanks!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}