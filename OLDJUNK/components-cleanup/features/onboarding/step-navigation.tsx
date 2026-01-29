'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { useOnboardingV2Storage } from '@/lib/hooks/use-onboarding-v2';
import { useCategoryTemplates } from '@/lib/queries/use-category-groups-data';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import posthog from 'posthog-js';

const TOTAL_STEPS = 6;

export function StepNavigation() {
  const router = useRouter();
  const currentStep = useOnboardingUIStore((state) => state.currentStep);
  const nextStep = useOnboardingUIStore((state) => state.nextStep);
  const prevStep = useOnboardingUIStore((state) => state.prevStep);
  const isStepValid = useOnboardingUIStore((state) => state.isStepValid);
  const setLoading = useOnboardingUIStore((state) => state.setLoading);

  const { getData, markCompleted } = useOnboardingV2Storage();
  const { setViewMode } = useViewMode();
  const { data: categoryTemplates } = useCategoryTemplates();

  const [isProcessing, setIsProcessing] = useState(false);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  const handleNext = async () => {
    if (!isStepValid) return;

    if (isLastStep) {
      // Complete onboarding
      await handleComplete();
    } else {
      // Move to next step
      nextStep();
      // Track in PostHog
      posthog?.capture('onboarding_v2_step_completed', {
        step: currentStep,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleComplete = async () => {
    try {
      setIsProcessing(true);
      setLoading(true);

      const data = getData();
      if (!data) throw new Error('No onboarding data found');

      // 1. Apply category template (if selected)
      if (data.categoryTemplateId) {
        try {
          // This should call the API to apply the template
          // For now, we'll just log it
          console.log('Would apply category template:', data.categoryTemplateId);
        } catch (error) {
          console.error('Error applying template:', error);
        }
      }

      // 2. Set view mode based on experience level
      if (data.experienceLevel) {
        const viewMode = data.experienceLevel === 'beginner' ? 'beginner' : 'pro';
        setViewMode(viewMode);
      }

      // 3. Mark as completed
      markCompleted();

      // 4. Track analytics
      posthog?.capture('onboarding_v2_completed', {
        experienceLevel: data.experienceLevel,
        goals: data.primaryGoals,
        budgetTemplate: data.budgetTemplate,
        hasProfile: !!data.profile.firstName,
        timestamp: new Date().toISOString(),
      });

      // 5. Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep || isProcessing}
        className="group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back
      </Button>

      <Button
        onClick={handleNext}
        disabled={!isStepValid || isProcessing}
        className="group"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : isLastStep ? (
          <>
            Complete Setup
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </div>
  );
}
