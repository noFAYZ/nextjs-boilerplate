'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Zap, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const STEPS = [
  { name: 'Profile', description: 'Your information' },
  { name: 'Experience', description: 'Skill level' },
  { name: 'Goals', description: 'Financial goals' },
  { name: 'Budget', description: 'Budget style' },
  { name: 'Categories', description: 'Organize spending' },
  { name: 'Accounts', description: 'Connect accounts' },
];

export function OnboardingIndicator() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'completed' | 'skipped' | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = () => {
      const completed = localStorage.getItem('onboarding-v2-completed');
      const skipped = localStorage.getItem('onboarding-v2-skipped');

      if (completed) {
        setStatus('completed');
      } else if (skipped) {
        setStatus('skipped');
      } else {
        setStatus('pending');
      }
    };

    checkOnboardingStatus();
  }, []);

  if (status === null) return null;

  if (status === 'completed') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div className="hidden sm:flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">Setup complete</p>
              <div className="flex gap-1">
                {STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-1 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Setup Complete
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You&apos;ve successfully completed your account setup. All your preferences and settings are configured.
              </p>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Completed steps:</p>
              <div className="grid grid-cols-2 gap-2">
                {STEPS.map((step) => (
                  <div key={step.name} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                router.push('/onboarding-v2');
                setIsOpen(false);
              }}
              className="w-full text-xs"
            >
              Re-run Setup
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (status === 'skipped') {
    const progress = 0;
    const circumference = 2 * Math.PI * 16; // radius = 16
    const strokeDashoffset = circumference - (progress / 6) * circumference;

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="secondary" className="px-1 pr-2 gap-2 font-se text-xs not-even:" icon={  <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0 border rounded-full bg-muted text-foreground font-bold text-xs p-0.5 ">
           {(progress / 6) *100}%
            </div>}>
          
        Complete onboarding
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 48 48" className="transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="22"
                      fill="none"
                      stroke="url(#gradientAmberLarge)"
                      strokeWidth="2"
                      strokeDasharray={2 * Math.PI * 22}
                      strokeDashoffset={2 * Math.PI * 22 - (progress / 6) * 2 * Math.PI * 22}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradientAmberLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgb(217, 119, 6)" />
                        <stop offset="100%" stopColor="rgb(180, 83, 9)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{progress}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400">/ 6</span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Complete Your Onboarding
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You haven&apos;t started the onboarding yet. Let&apos;s get your account fully set up to unlock personalized features.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Overall Progress</p>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{Math.round((progress / 6) * 100)}%</p>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${(progress / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
              <p className="text-xs font-medium text-amber-900 dark:text-amber-200">Steps to complete:</p>
              <ol className="space-y-1.5">
                {STEPS.map((step, idx) => (
                  <li key={step.name} className="text-xs flex items-center gap-2">
                    <Circle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <p className="font-medium text-amber-900 dark:text-amber-200">{step.name}</p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">⏱️ Takes about 5 minutes to complete</p>

            <Button
              size="sm"
              onClick={() => {
                router.push('/onboarding-v2');
                setIsOpen(false);
              }}
              className="w-full text-xs"
            >
              Start Onboarding
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Pending status - with progress indicator
  const progress = 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
          <div className="flex items-center justify-center">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="hidden sm:flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Setup needed</p>
            <div className="flex gap-1 w-full">
              {STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: idx === 0 ? '0%' : '0%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                Complete Your Setup
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Let&apos;s personalize your experience in just a few minutes. This helps us provide better recommendations tailored to your financial goals.
            </p>
          </div>

          {/* Progress visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Progress</p>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{progress} / 6</p>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(progress / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 max-h-48 overflow-y-auto">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-200 sticky top-0">Setup steps:</p>
            <ol className="space-y-2">
              {STEPS.map((step, idx) => (
                <li key={step.name} className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                  <span className="font-semibold min-w-4">{idx + 1}.</span>
                  <div>
                    <p className="font-medium">{step.name}</p>
                    <p className="text-blue-700 dark:text-blue-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">⏱️ Takes about 5 minutes</p>

          <Button
            size="sm"
            onClick={() => {
              router.push('/onboarding-v2');
              setIsOpen(false);
            }}
            className="w-full text-xs"
          >
            Start Setup
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
