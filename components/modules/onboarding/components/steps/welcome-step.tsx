'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { useOnboardingV2Storage } from '@/lib/hooks/use-onboarding-v2';
import { Button } from '@/components/ui/button';
import { ArrowRight, SkipForward } from 'lucide-react';

export function WelcomeStep() {
  const router = useRouter();
  const nextStep = useOnboardingUIStore((state) => state.nextStep);
  const { markSkipped } = useOnboardingV2Storage();

  const handleGetStarted = () => {
    nextStep();
  };

  const handleSkip = () => {
    markSkipped();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💰
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">Welcome to MoneyMappr</h1>
          <p className="text-xl text-muted-foreground">Your personal financial command center</p>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
          Take control of your finances with intelligent tracking, budgeting, and insights. Let&apos;s set up your account
          in just a few steps.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
          {[
            { icon: '📊', title: 'Track All Accounts', description: 'Banks, crypto, investments in one place' },
            { icon: '💡', title: 'Smart Budgeting', description: 'Visualize spending patterns and optimize' },
            { icon: '🎯', title: 'Achieve Goals', description: 'Set targets and track progress over time' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in zoom-in duration-500" style={{ animationDelay: '400ms' }}>
          <Button size="lg" onClick={handleGetStarted} className="group">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button size="lg" variant="outline" onClick={handleSkip} className="group">
            <SkipForward className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            Skip for now
          </Button>
        </div>

        {/* Footer text */}
        <p className="text-sm text-muted-foreground pt-4 animate-in fade-in duration-500" style={{ animationDelay: '500ms' }}>
          Takes about 5 minutes to complete
        </p>
      </div>
    </div>
  );
}
