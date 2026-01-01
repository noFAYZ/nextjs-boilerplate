'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { useOnboardingV2Storage, getDefaultData, type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { useCurrentUser } from '@/lib/queries/use-auth-data';

import { WelcomeStep } from '@/components/onboarding-v2/steps/welcome-step';
import { OnboardingStepper } from '@/components/onboarding-v2/onboarding-stepper';
import { OnboardingContent } from '@/components/onboarding-v2/onboarding-content';
import { OnboardingPreview } from '@/components/onboarding-v2/onboarding-preview';

export default function OnboardingV2Page() {
  const router = useRouter();
  const currentStep = useOnboardingUIStore((state) => state.currentStep);
  const { data: user } = useCurrentUser();
  const { getData, saveData, isCompleted } = useOnboardingV2Storage();
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingV2Data>(getDefaultData());

  // Redirect if already completed
  useEffect(() => {
    if (!isLoading) {
      if (isCompleted()) {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isCompleted, router]);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = getData();
    if (stored) {
      setOnboardingData(stored);
    } else {
      setOnboardingData(getDefaultData());
    }
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  const updateOnboardingData = (updates: Partial<OnboardingV2Data>) => {
    const newData = { ...onboardingData, ...updates };
    setOnboardingData(newData);
    saveData(updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full-width welcome screen (Step 0) */}
      {currentStep === 0 && <WelcomeStep />}

      {/* Three-column layout for steps 1-6 */}
      {currentStep > 0 && (
        <div className="flex h-screen overflow-hidden">
          {/* Left: Stepper (hidden on mobile and tablet) */}
          <aside className="hidden lg:flex lg:w-72 bg-slate-50 dark:bg-slate-900/50 overflow-y-auto sticky">
            <OnboardingStepper />
          </aside>

          {/* Center: Content area */}
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950">
            <OnboardingContent onboardingData={onboardingData} updateOnboardingData={updateOnboardingData} />
          </main>

          {/* Right: Preview - Increased width (hidden on mobile and tablet) */}
          <aside className="hidden xl:flex xl:w-[420px] bg-white dark:bg-slate-950 overflow-y-auto sticky">
            <OnboardingPreview onboardingData={onboardingData} />
          </aside>
        </div>
      )}
    </div>
  );
}
