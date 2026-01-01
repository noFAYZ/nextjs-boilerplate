'use client';

import { useEffect } from 'react';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { FINANCIAL_GOALS, type FinancialGoalId } from '@/lib/constants/financial-goals';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface GoalsStepProps {
  onboardingData: OnboardingV2Data;
  updateOnboardingData: (updates: Partial<OnboardingV2Data>) => void;
}

export function GoalsStep({ onboardingData, updateOnboardingData }: GoalsStepProps) {
  const setStepValid = useOnboardingUIStore((state) => state.setStepValid);
  const selectedGoals = onboardingData.primaryGoals || [];

  // Validate: must select at least one goal
  useEffect(() => {
    setStepValid(selectedGoals.length > 0);
  }, [selectedGoals, setStepValid]);

  const toggleGoal = (goalId: FinancialGoalId) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter((id) => id !== goalId)
      : [...selectedGoals, goalId];

    updateOnboardingData({
      primaryGoals: newGoals,
    });
  };

  const goalIds = Object.keys(FINANCIAL_GOALS) as FinancialGoalId[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What are your financial goals?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Select one or more goals to help us personalize recommendations</p>
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {goalIds.map((goalId) => {
          const goal = FINANCIAL_GOALS[goalId];
          const isSelected = selectedGoals.includes(goalId);

          return (
            <button
              key={goalId}
              onClick={() => toggleGoal(goalId)}
              className={cn(
                'relative p-3.5 rounded-lg transition-all duration-300 text-left group',
                isSelected
                  ? 'bg-primary/10'
                  : 'bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50'
              )}
            >
              {/* Icon and title */}
              <div className="flex items-start gap-2.5">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-colors',
                  isSelected ? 'bg-primary/20' : 'bg-slate-200 dark:bg-slate-700'
                )}>
                  {goal.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{goal.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{goal.description}</p>
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected count */}
      {selectedGoals.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Selected: {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
