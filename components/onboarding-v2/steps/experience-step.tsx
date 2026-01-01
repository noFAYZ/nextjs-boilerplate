'use client';

import { useEffect } from 'react';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { cn } from '@/lib/utils';
import { Zap, BarChart3, Gauge } from 'lucide-react';

interface ExperienceStepProps {
  onboardingData: OnboardingV2Data;
  updateOnboardingData: (updates: Partial<OnboardingV2Data>) => void;
}

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner' as const,
    title: 'Beginner',
    description: 'Just getting started with personal finance',
    features: ['Guided setup and tips', 'Essential features only', 'Daily tips and education'],
    icon: Zap,
  },
  {
    id: 'intermediate' as const,
    title: 'Intermediate',
    description: 'Some experience with budgeting and investing',
    features: ['Balanced interface', 'All core features', 'Performance analytics'],
    icon: BarChart3,
    recommended: true,
  },
  {
    id: 'advanced' as const,
    title: 'Advanced',
    description: 'Experienced investor looking for full control',
    features: ['Power user features', 'Advanced analytics', 'API access', 'Custom workflows'],
    icon: Gauge,
  },
];

export function ExperienceStep({ onboardingData, updateOnboardingData }: ExperienceStepProps) {
  const setStepValid = useOnboardingUIStore((state) => state.setStepValid);
  const selected = onboardingData.experienceLevel;

  // Validate: must select one
  useEffect(() => {
    setStepValid(!!selected);
  }, [selected, setStepValid]);

  const handleSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    updateOnboardingData({
      experienceLevel: level,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What&apos;s your experience level?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">We&apos;ll customize the interface to match your needs</p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {EXPERIENCE_LEVELS.map((level) => {
          const Icon = level.icon;
          const isSelected = selected === level.id;

          return (
            <button
              key={level.id}
              onClick={() => handleSelect(level.id)}
              className={cn(
                'relative w-full text-left p-4 rounded-lg transition-all duration-300',
                isSelected
                  ? 'bg-primary/10'
                  : 'bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50'
              )}
            >
              {level.recommended && !isSelected && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                {/* Icon */}
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                  isSelected ? 'bg-primary/20 text-primary' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                )}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{level.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{level.description}</p>

                  {/* Features */}
                  <ul className="mt-2 space-y-0.5">
                    {level.features.map((feature) => (
                      <li key={feature} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span className={cn(
                          'w-0.5 h-0.5 rounded-full',
                          isSelected ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'
                        )} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info text */}
      <p className="text-xs text-slate-500 dark:text-slate-400">You can change this anytime in settings</p>
    </div>
  );
}
