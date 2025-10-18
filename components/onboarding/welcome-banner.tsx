'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Wallet,
  PieChart,
  Target,
  ArrowRight
} from 'lucide-react';
import { useAuthStore, selectUser } from '@/lib/stores';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SolarPieChartBold, SolarWalletMoneyLinear } from '../icons/icons';

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const user = useAuthStore(selectUser);
  const { viewMode } = useViewMode();

  useEffect(() => {
    const justCompleted = localStorage.getItem('onboarding-just-completed');
    const bannerDismissed = localStorage.getItem('welcome-banner-dismissed');

    if (justCompleted === 'true' && !bannerDismissed) {
      setIsVisible(true);
      localStorage.removeItem('onboarding-just-completed');
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('welcome-banner-dismissed', 'true');
  };

  const quickActions = [
    {
      title: 'Connect Wallet',
      description: 'Add crypto wallet',
      icon: SolarWalletMoneyLinear,
      href: '/accounts/wallet/add'
    },
    {
      title: 'View Portfolio',
      description: 'See your investments',
      icon: SolarPieChartBold,
      href: '/portfolio'
    },
    {
      title: 'Set Goals',
      description: 'Create financial goal',
      icon: Target,
      href: '/goals/create'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="mb-6">
   

        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="group cursor-pointer transition-all hover:border-primary/50">
                  <CardContent className="px-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{action.title}</h4>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Mode:</span>
            <Badge variant="secondary" className="text-xs">
              {viewMode === 'beginner' ? 'Beginner' : 'Pro'}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
          >
            Got it
          </Button>
        </div>
    </div>
  );
}
