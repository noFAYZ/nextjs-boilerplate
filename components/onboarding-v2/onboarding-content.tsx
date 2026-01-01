'use client';

import { useEffect, useState } from 'react';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { Loader2 } from 'lucide-react';

import { ProfileStep } from './steps/profile-step';
import { ExperienceStep } from './steps/experience-step';
import { GoalsStep } from './steps/goals-step';
import { BudgetTemplatesStep } from './steps/budget-templates-step';
import { CategoryTemplatesStep } from './steps/category-templates-step';
import { AccountsStep } from './steps/accounts-step';
import { StepNavigation } from './step-navigation';

interface OnboardingContentProps {
  onboardingData: OnboardingV2Data;
  updateOnboardingData: (updates: Partial<OnboardingV2Data>) => void;
}

const STEP_COMPONENTS = [
  ProfileStep,
  ExperienceStep,
  GoalsStep,
  BudgetTemplatesStep,
  CategoryTemplatesStep,
  AccountsStep,
];

export function OnboardingContent({ onboardingData, updateOnboardingData }: OnboardingContentProps) {
  const currentStep = useOnboardingUIStore((state) => state.currentStep);
  const [isLoading, setIsLoading] = useState(false);

  // Show loading state when step changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const StepComponent = STEP_COMPONENTS[currentStep - 1]; // -1 because welcome is step 0

  return (
    <div className="flex flex-col h-full">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-950/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading...</p>
            </div>
          </div>
        )}

        <div key={currentStep} className="max-w-2xl mx-auto animate-in fade-in duration-300">
          {StepComponent && (
            <StepComponent onboardingData={onboardingData} updateOnboardingData={updateOnboardingData} />
          )}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="bg-background p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <StepNavigation />
        </div>
      </div>
    </div>
  );
}
