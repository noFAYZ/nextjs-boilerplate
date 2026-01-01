'use client';

import { useMemo, useEffect, useState } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { Animate } from '@/components/ui/animate';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { FINANCIAL_GOALS } from '@/lib/constants/financial-goals';
import { BUDGET_TEMPLATES } from '@/lib/constants/budget-templates';

interface OnboardingPreviewProps {
  onboardingData: OnboardingV2Data;
}

export function OnboardingPreview({ onboardingData }: OnboardingPreviewProps) {
  const { data: allAccountsResponse } = useAllAccounts();
  const [updateKey, setUpdateKey] = useState(0);

  const summary = allAccountsResponse?.summary;
  const groups = allAccountsResponse?.groups || {};

  // Extract all accounts from groups
  const allAccounts = useMemo(() => {
    const accounts: any[] = [];
    Object.values(groups).forEach((group: any) => {
      if (group.accounts && Array.isArray(group.accounts)) {
        accounts.push(...group.accounts);
      }
    });
    return accounts;
  }, [groups]);


  // Force update when accounts change
  useEffect(() => {
    setUpdateKey(prev => prev + 1);
  }, [allAccounts.length]);

  const netWorth = summary?.totalNetWorth || 0;
  const totalAccountCount = summary?.accountCount || 0;
  const assetCount = summary?.totalAssets ? 1 : 0;
  const assetTotal = summary?.totalAssets || 0;
  const liabilityCount = summary?.totalLiabilities ? 1 : 0;
  const liabilityTotal = Math.abs(summary?.totalLiabilities || 0);

  const profile = onboardingData.profile;
  const experienceLevel = onboardingData.experienceLevel;
  const selectedGoals = onboardingData.primaryGoals || [];
  const budgetTemplate = onboardingData.budgetTemplate;

  const { assetsPercent, liabilitiesPercent } = useMemo(() => {
    if (!summary) return { assetsPercent: 0, liabilitiesPercent: 0 };

    const totalAssets = summary.totalAssets || 0;
    const totalLiabilities = Math.abs(summary.totalLiabilities || 0);
    const total = totalAssets + totalLiabilities;

    const assetsPercent = total > 0 ? Math.round((totalAssets / total) * 100) : 0;
    const liabilitiesPercent = 100 - assetsPercent;

    return { assetsPercent, liabilitiesPercent };
  }, [summary]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="px-7 pt-8 pb-5">
        <Animate type="fade-in" duration={300} delay={50}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">SUMMARY</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Profile preview and settings</p>
          </div>
        </Animate>
      </div>

      {/* Scrollable Content - Premium Minimal Design */}
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
        {/* Net Worth - Hero */}
        <Animate key={`networth-${updateKey}`} type="fade-in" delay={100} duration={300}>
          <div className="space-y-3 p-5 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">NET WORTH</p>
            <div className="space-y-1">
              <p className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {totalAccountCount > 0 ? (
                  <Animate key={`value-${netWorth}`} type="fade-in" duration={200}>
                    <CurrencyDisplay amountUSD={netWorth} variant='2xl' />
                  </Animate>
                ) : (
                  '$0.00'
                )}
              </p>
          
              {totalAccountCount == 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add accounts to see your net worth
                </p>
              )}
            </div>
          </div>
        </Animate>



        {/* Allocation Section - Assets vs Liabilities */}
{(summary?.totalAssets ?? 0) > 0 || (summary?.totalLiabilities ?? 0) > 0 ? (
  <div className="space-y-3">
    {/* Allocation bar with SVG pattern overlays */}
    <div className="relative w-full h-8 rounded-sm overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10">
      {/* Glossy overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

      {/* SVG Patterns Definition */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          {/* Assets: Diagonal lines pattern */}
          <pattern id="pattern-ASSETS-BAR" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.2" />
          </pattern>

          {/* Liabilities: Dots pattern */}
          <pattern id="pattern-LIABILITIES-BAR" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.2" fill="white" fillOpacity="0.18" />
          </pattern>
        </defs>
      </svg>

      {/* Assets bar */}
      {assetsPercent > 0 && (
        <div
          style={{ width: `${assetsPercent}%` }}
          className="h-full relative inline-block transition-all duration-500 ease-out group"
        >
          {/* Base color */}
          <div className="h-full w-full bg-green-600/70" />

          {/* Pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <rect width="100" height="100" fill="url(#pattern-ASSETS-BAR)" />
          </svg>

          {/* Hover highlight */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      )}

      {/* Liabilities bar */}
      {liabilitiesPercent > 0 && (
        <div
          style={{ width: `${liabilitiesPercent}%` }}
          className="h-full relative inline-block transition-all duration-500 ease-out group"
        >
          {/* Base color */}
          <div className="h-full w-full bg-orange-600/70" />

          {/* Pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <rect width="100" height="100" fill="url(#pattern-LIABILITIES-BAR)" />
          </svg>

          {/* Hover highlight */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      )}
    </div>

    {/* Legend */}
    <div className="grid grid-cols-2 gap-2.5">
      {assetsPercent > 0 && (
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <div className="w-3 h-3 rounded-full shadow-sm bg-green-600" />

          {/* Text */}
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
              Assets
            </span>
            <span className="text-[12px] font-semibold text-black dark:text-white">
              {assetsPercent}%
            </span>
          </div>
        </div>
      )}
      {liabilitiesPercent > 0 && (
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <div className="w-3 h-3 rounded-full shadow-sm bg-orange-600" />

          {/* Text */}
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
              Liabilities
            </span>
            <span className="text-[12px] font-semibold text-black dark:text-white">
              {liabilitiesPercent}%
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
) : null}



        {/* Divider - shows only when needed */}
        {(profile.firstName || experienceLevel || selectedGoals.length > 0 || budgetTemplate) && (
          <Animate type="fade-in" delay={200} duration={300}>
            <div className="h-px bg-slate-200 dark:bg-slate-800" />
          </Animate>
        )}

        {/* Profile */}
        {profile.firstName && (
          <Animate type="fade-in" delay={200} duration={300}>
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">PROFILE</p>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {profile.firstName} {profile.lastName}
                </p>
                {profile.occupation && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">{profile.occupation}</p>
                )}
                {profile.monthlyIncome && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Income: ${profile.monthlyIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
                  </p>
                )}
              </div>
            </div>
          </Animate>
        )}

        {/* Experience */}
        {experienceLevel && (
          <Animate type="fade-in" delay={200} duration={300}>
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">EXPERIENCE LEVEL</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{experienceLevel}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {experienceLevel === 'beginner' && 'Get guided step-by-step through features'}
                {experienceLevel === 'intermediate' && 'Balanced interface with helpful guidance'}
                {experienceLevel === 'advanced' && 'Full power with minimal restrictions'}
              </p>
            </div>
          </Animate>
        )}

        {/* Goals */}
        {selectedGoals.length > 0 && (
          <Animate type="fade-in" delay={300} duration={300}>
            <div className="space-y-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">
                FINANCIAL GOALS ({selectedGoals.length})
              </p>
              <div className="space-y-1.5">
                {selectedGoals.slice(0, 4).map((goalId) => {
                  const goal = FINANCIAL_GOALS[goalId as keyof typeof FINANCIAL_GOALS];
                  return goal ? (
                    <p key={goalId} className="text-xs text-slate-700 dark:text-slate-300">
                      {goal.icon} {goal.name}
                    </p>
                  ) : null;
                })}
                {selectedGoals.length > 4 && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">+{selectedGoals.length - 4} more goal{selectedGoals.length - 4 !== 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
          </Animate>
        )}

        {/* Budget */}
        {budgetTemplate && (
          <Animate type="fade-in" delay={300} duration={300}>
            <div className="space-y-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">BUDGET TEMPLATE</p>
              {(() => {
                const template = BUDGET_TEMPLATES[budgetTemplate as keyof typeof BUDGET_TEMPLATES];
                return template ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {template.icon} {template.name}
                    </p>
                    {template.allocation && (
                      <div className="space-y-2">
                        {Object.entries(template.allocation).map(([key, value]) => (
                          <div key={key} className="space-y-0.5">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs text-slate-700 dark:text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-xs font-semibold text-slate-900 dark:text-white">{value}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
          </Animate>
        )}
      </div>
    </div>
  );
}
