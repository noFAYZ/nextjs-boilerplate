'use client';

import { useEffect } from 'react';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { useCategoryTemplates } from '@/lib/queries/use-category-groups-data';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { cn } from '@/lib/utils';
import { Check, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryTemplatesStepProps {
  onboardingData: OnboardingV2Data;
  updateOnboardingData: (updates: Partial<OnboardingV2Data>) => void;
}

export function CategoryTemplatesStep({ onboardingData, updateOnboardingData }: CategoryTemplatesStepProps) {
  const setStepValid = useOnboardingUIStore((state) => state.setStepValid);
  const { data: templates, isLoading } = useCategoryTemplates();
  const selected = onboardingData.categoryTemplateId;

  // Validate: always valid (step 5 is optional with default)
  useEffect(() => {
    setStepValid(true);
  }, [setStepValid]);

  const handleSelect = (templateId: string) => {
    updateOnboardingData({
      categoryTemplateId: templateId,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Organize your spending</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Choose a category template to organize your transactions</p>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Organize your spending</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Choose a category template to organize your transactions</p>
      </div>

      {/* Templates grid */}
      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((template) => {
            const isSelected = selected === template.id;

            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={cn(
                  'relative p-4 rounded-lg transition-all duration-300 text-left',
                  isSelected
                    ? 'bg-primary/10'
                    : 'bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors',
                  isSelected ? 'bg-primary/20' : 'bg-slate-200 dark:bg-slate-700'
                )}>
                  {template.icon || <BarChart3 className="w-5 h-5" />}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-slate-900 dark:text-white mt-2.5 text-sm">{template.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{template.description}</p>

                {/* Stats */}
                <div className="flex gap-3 mt-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <span>{template.groupCount || 0} groups</span>
                  <span>{template.categoryCount || 0} categories</span>
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p className="text-sm">No category templates available</p>
        </div>
      )}

      {/* Skip info */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        You can always customize your categories later. A default template will be applied if you skip.
      </p>
    </div>
  );
}
