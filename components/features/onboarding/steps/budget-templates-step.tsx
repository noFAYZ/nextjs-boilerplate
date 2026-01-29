'use client';

import { useEffect } from 'react';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { BUDGET_TEMPLATES, type BudgetTemplateId } from '@/lib/constants/budget-templates';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { cn } from '@/lib/utils';
import { Check, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BudgetTemplatesStepProps {
  onboardingData: OnboardingV2Data;
  updateOnboardingData: (updates: Partial<OnboardingV2Data>) => void;
}

export function BudgetTemplatesStep({ onboardingData, updateOnboardingData }: BudgetTemplatesStepProps) {
  const setStepValid = useOnboardingUIStore((state) => state.setStepValid);
  const selected = onboardingData.budgetTemplate as BudgetTemplateId | undefined;

  // Validate: must select one template
  useEffect(() => {
    setStepValid(!!selected);
  }, [selected, setStepValid]);

  const handleSelect = (templateId: BudgetTemplateId) => {
    updateOnboardingData({
      budgetTemplate: templateId,
    });
  };

  const templateIds = Object.keys(BUDGET_TEMPLATES) as BudgetTemplateId[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choose your budgeting style</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Different methods work for different people. Which resonates with you?</p>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        {templateIds.map((templateId) => {
          const template = BUDGET_TEMPLATES[templateId];
          const isSelected = selected === templateId;

          return (
            <button
              key={templateId}
              onClick={() => handleSelect(templateId)}
              className={cn(
                'relative w-full text-left p-4 rounded-lg transition-all duration-300',
                isSelected
                  ? 'bg-primary/10'
                  : 'bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50'
              )}
            >
              {/* Recommended badge */}
              {template.recommended && !isSelected && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                {/* Icon */}
                <div className={cn(
                  'w-11 h-11 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors',
                  isSelected ? 'bg-primary/20' : 'bg-slate-200 dark:bg-slate-700'
                )}>
                  {template.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{template.name}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">{template.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{template.description}</p>

                  {/* Allocation preview 
                  {template.allocation && (
                    <div className="mt-3 space-y-1.5">
                      {Object.entries(template.allocation).map(([key, value]) => (
                        <div key={key} className="space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">{value}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all',
                                isSelected ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'
                              )}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}*/}
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

      {/* Info box - Minimal design */}
      <div className="flex gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40">
        <Info className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          You can adjust your budget in the next step. This is just a starting point.
        </p>
      </div>
    </div>
  );
}
