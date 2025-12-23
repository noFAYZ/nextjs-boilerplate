import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AccountsSummary } from '@/lib/types/unified-accounts';
import { HeroiconsWallet16Solid } from '../icons/icons';

export interface AccountsSummaryProps {
  summary: AccountsSummary | null;
}

export function AccountsSummary({ summary }: AccountsSummaryProps) {
  if (!summary) return null;

  const netWorthStatus = summary.totalAssets > summary.totalLiabilities ? 'positive' : 'negative';
  const assetsPercent = summary.totalAssets > 0
    ? Math.round((summary.totalAssets / (summary.totalAssets + Math.abs(summary.totalLiabilities))) * 100)
    : 0;
  const liabilitiesPercent = 100 - assetsPercent;

  return (
    <div className="sticky top-4">
      <Card className="relative border border-border/50 shadow-xs gap-4 h-full w-full flex flex-col">
        {/* Glassmorphic Main Card */}
        <div className="relative">
          <Card className="p-3 bg-gradient-to-br from-accent/50 via-accent/60 to-accent/50 dark:from-accent/80 dark:via-accent/50 dark:to-accent/80 border-dashed border-2 border-accent/80">
            {/* Subtle inner glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5" />
            </div>

            {/* Content */}
            <div className="relative space-y-6">
              {/* Header – Clean & Hierarchical */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-black/50 dark:text-white/50 tracking-wider uppercase">
                    Total Net Worth
                  </p>
                  <h2 className="mt-2 text-4xl font-semibold text-black dark:text-white tracking-tight">
                    {summary.totalNetWorth > 0 ? (
                      <CurrencyDisplay amountUSD={summary.totalNetWorth} variant="2xl" />
                    ) : (
                      '—'
                    )}
                  </h2>
                </div>

                {/* Subtle positive trend */}
                {summary.totalNetWorth > 0 && (
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      netWorthStatus === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {netWorthStatus === 'positive' ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5 5 5" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 13l5 5 5-5" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l5 5 5-5" />
                        </>
                      )}
                    </svg>
                    <span className="text-sm font-medium">{netWorthStatus === 'positive' ? 'Positive' : 'Negative'}</span>
                  </div>
                )}
              </div>

              {/* Allocation Section with SVG Patterns */}
              {(summary.totalAssets > 0 || summary.totalLiabilities > 0) && (
                <div className="space-y-3">
                  {/* Allocation bar with SVG pattern overlays */}
                  <div className="relative w-full h-8 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10">
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

                    {/* SVG Patterns Definition */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                      <defs>
                        {/* Assets: Diagonal lines pattern */}
                        <pattern
                          id="pattern-ASSETS"
                          width="8"
                          height="8"
                          patternUnits="userSpaceOnUse"
                          patternTransform="rotate(45)"
                        >
                          <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.2" />
                        </pattern>

                        {/* Liabilities: Dots pattern */}
                        <pattern id="pattern-LIABILITIES" width="6" height="6" patternUnits="userSpaceOnUse">
                          <circle cx="3" cy="3" r="1.2" fill="white" fillOpacity="0.18" />
                        </pattern>
                      </defs>
                    </svg>

                    {/* Allocation bars with patterns */}
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
                          <rect width="100" height="100" fill="url(#pattern-ASSETS)" />
                        </svg>

                        {/* Hover highlight */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </div>
                    )}
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
                          <rect width="100" height="100" fill="url(#pattern-LIABILITIES)" />
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
                        <div className="w-3 h-3 rounded-full shadow-sm bg-emerald-600" />

                        {/* Text */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-[12px] font-medium text-black/70 dark:text-white/70">Assets</span>
                          <span className="text-[12px] font-semibold text-black dark:text-white">{assetsPercent}%</span>
                        </div>
                      </div>
                    )}
                    {liabilitiesPercent > 0 && (
                      <div className="flex items-center gap-2">
                        {/* Color dot */}
                        <div className="w-3 h-3 rounded-full shadow-sm bg-orange-600" />

                        {/* Text */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-[12px] font-medium text-black/70 dark:text-white/70">Liabilities</span>
                          <span className="text-[12px] font-semibold text-black dark:text-white">{liabilitiesPercent}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Optional ultra-subtle outer glow */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 blur-xl -z-10" />
        </div>

        {/* Stats Grid - Simplified */}
        <div className="space-y-1.5">
          {/* Total Assets */}
          <div className="group relative border border-border/80 flex bg-sidebar items-center gap-3  rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default pr-4">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/15 transition-colors">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Total Assets</p>
              <p className="text-[10px] text-muted-foreground">
                {summary.totalAssets > 0
                  ? `${Math.round((summary.totalAssets / (summary.totalAssets + Math.abs(summary.totalLiabilities))) * 100)}% of portfolio`
                  : 'No assets'}
              </p>
            </div>
            <CurrencyDisplay
              amountUSD={summary.totalAssets}
              variant="small"
              className=" text-lime-700 dark:text-lime-400 flex-shrink-0"
            />
          </div>

          {/* Total Liabilities */}
          <div className="group relative border border-border/80 flex items-center gap-3   rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default pr-4">
            <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/15 transition-colors">
              <TrendingDown className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Total Liabilities</p>
              <p className="text-[10px] text-muted-foreground">
                {summary.totalLiabilities > 0
                  ? `${Math.round((Math.abs(summary.totalLiabilities) / (summary.totalAssets + Math.abs(summary.totalLiabilities))) * 100)}% of portfolio`
                  : 'No liabilities'}
              </p>
            </div>
            <CurrencyDisplay
              amountUSD={summary.totalLiabilities}
              variant="small"
              className=" text-rose-700 dark:text-red-400 flex-shrink-0"
            />
          </div>

          {/* Account Count */}
          <div className="group relative border border-border/80 flex items-center gap-3   rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default pr-4">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/15 transition-colors">
              <HeroiconsWallet16Solid className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Total Accounts</p>
              <p className="text-[10px] text-muted-foreground">
                {summary.accountCount} {summary.accountCount === 1 ? 'account' : 'accounts'} connected
              </p>
            </div>
            <span className="text-sm  font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">{summary.accountCount}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
