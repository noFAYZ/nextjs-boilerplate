'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { useOnboardingV2Storage } from '@/lib/hooks/use-onboarding-v2';
import { Button } from '@/components/ui/button';
import { Animate } from '@/components/ui/animate';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Animate type="fade-in" duration={500}>
        <div className="relative z-10 max-w-2xl text-center space-y-8">
          {/* Logo */}
          <Animate type="slide-up" delay={100} duration={500}>
            <div className="flex justify-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                💰
              </div>
            </div>
          </Animate>

          {/* Title */}
          <Animate type="slide-up" delay={200} duration={500}>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">Welcome to MoneyMappr</h1>
              <p className="text-xl text-muted-foreground">Your personal financial command center</p>
            </div>
          </Animate>

          {/* Description */}
          <Animate type="slide-up" delay={300} duration={500}>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Take control of your finances with intelligent tracking, budgeting, and insights. Let&apos;s set up your account
              in just a few steps.
            </p>
          </Animate>

          {/* Features */}
          <Animate type="slide-up" delay={400} duration={500}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
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
          </Animate>

          {/* Buttons */}
          <Animate type="scale-in" delay={500} duration={500}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={handleGetStarted} className="group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button size="lg" variant="outline" onClick={handleSkip} className="group">
                <SkipForward className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Skip for now
              </Button>
            </div>
          </Animate>

          {/* Footer text */}
          <Animate type="fade-in" delay={600} duration={500}>
            <p className="text-sm text-muted-foreground pt-4">Takes about 5 minutes to complete</p>
          </Animate>
        </div>
      </Animate>
    </div>
  );
}
