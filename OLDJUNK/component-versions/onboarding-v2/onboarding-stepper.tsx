'use client';

import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { number: 1, title: 'Profile', description: 'Your information' },
  { number: 2, title: 'Experience', description: 'Skill level' },
  { number: 3, title: 'Goals', description: 'Financial goals' },
  { number: 4, title: 'Budget', description: 'Budget style' },
  { number: 5, title: 'Categories', description: 'Organize spending' },
  { number: 6, title: 'Accounts', description: 'Connect accounts' },
];

export function OnboardingStepper() {
  const currentStep = useOnboardingUIStore((state) => state.currentStep);
  const goToStep = useOnboardingUIStore((state) => state.goToStep);

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      goToStep(stepNumber);
    }
  };

  const progressPercent = (currentStep / STEPS.length) * 100;

  return (
    <div className="w-full h-screen flex flex-col   bg-white dark:bg-sidebar px-4 pt-16">



     <div className="space-y-2">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            const isClickable = step.number <= currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <button
                key={step.number}
                onClick={() => handleStepClick(step.number)}
                className={cn(
                  'w-full text-left transition-all duration-300 group disabled:cursor-not-allowed relative animate-in fade-in',
                  isClickable && !isActive && 'cursor-pointer'
                )}
              >
                  {/* Vertical Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-9 top-12 w-0.5 h-8 transition-all duration-300',
                        isCompleted ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-800'
                      )}
                    />
                  )}

                  {/* Step Container */}
                  <div
                    className={cn(
                      'relative flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                      isCompleted && !isActive && 'hover:bg-none dark:hover:bg-slate-900/50'
                    )}
                  >
                    {/* Step Indicator */}
                    <div
                      className={cn(
                        'relative flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 mt-0.5',
                        isCompleted && 'bg-green-600 text-white shadow-md',
                        isActive && 'bg-primary text-white shadow-lg ring-4 ring-primary/20',
                        isUpcoming && 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-semibold">{step.number}</span>
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3
                        className={cn(
                          'font-semibold text-sm transition-colors duration-300',
                          isActive && 'text-slate-900 dark:text-white',
                          isCompleted && !isActive && 'text-slate-500 dark:text-slate-400 line-through',
                          isUpcoming && 'text-slate-900 dark:text-white'
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          'text-xs transition-colors duration-300 mt-0.5',
                          isActive && 'text-slate-600 dark:text-slate-300',
                          isCompleted && !isActive && 'text-slate-400 dark:text-slate-500 line-through',
                          isUpcoming && 'text-slate-600 dark:text-slate-400'
                        )}
                      >
                        {step.description}
                      </p>
                    </div>


                  </div>
              </button>
            );
          })}
        </div>
    </div>
  );
}
