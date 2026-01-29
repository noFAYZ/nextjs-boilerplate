'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { TrendingDown, AlertCircle, CheckCircle2, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BudgetSpendingChart } from './budget-spending-chart';
import type { Budget } from '@/lib/types/budget';

interface BudgetHeaderProps {
  budget: Budget;
  progress: number;
  progressColor: string;
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  isExceeded?: boolean;
  onTrack?: boolean;
}

function CircularProgress({
  percentage,
  size = 70,
  strokeWidth = 14,
  isExceeded = false,
  onTrack = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  const getColor = () => {
    if (isExceeded) return '#ef4444';
    if (percentage >= 90) return '#f97316';
    if (percentage >= 75) return '#eab308';
    return '#10b981';
  };

  const color = getColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold">{percentage.toFixed(0)}%</div>
          <div className="text-[10px] text-muted-foreground">used</div>
        </div>
      </div>
    </div>
  );
}

export function BudgetHeader({ budget, progress, progressColor }: BudgetHeaderProps) {
  const statusColor = budget.onTrack ? 'success' : 'destructive';
  const statusText = budget.onTrack ? 'On Track' : 'Exceeded';

  return (
    <Card className="border-border/80 border-b-0 rounded-none hover:shadow-xs p-0 overflow-hidden">
      <div className="p-3 space-y-4">
        {/* TOP ROW: Identity & Progress Circle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Icon & Name */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border shadow-sm group-hover:shadow-lg bg-accent transition-shadow">
                {budget.icon || '📊'}
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold tracking-tight text-foreground truncate">
                  {budget.name}
                </h1>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                  {budget.cycle}
                </Badge>
              </div>
              {budget.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {budget.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{budget.sourceType || 'Manual'}</span>
                <span className="text-muted-foreground/40">•</span>
                <Badge variant={statusColor} className="text-[10px] rounded-full">
                  {statusText}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Progress Circle */}
          <div className="flex-shrink-0">
            <CircularProgress
              percentage={budget.percentageUsed}
              size={70}
              strokeWidth={14}
              isExceeded={budget.isExceeded}
              onTrack={budget.onTrack}
            />
          </div>
        </div>

        <Separator className="bg-border/70" />

        {/* Stats Grid */}
        <div className="grid w-full grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
          {/* SPENT */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-muted border shadow p-2">
              <TrendingDown className="h-5 w-5 text-foreground/80" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Spent
              </p>

              <div className="flex items-baseline gap-1">
                <p className="text-base font-semibold truncate tracking-tight">
                  <CurrencyDisplay amountUSD={budget.spent} variant="compact" />
                </p>
              </div>
            </div>
          </div>

          {/* BUDGET */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-muted border shadow p-2">
              <Wallet className="h-5 w-5 text-foreground/80" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Budget
              </p>

              <div className="flex items-baseline gap-2 truncate">
                <p className="text-base font-semibold truncate tracking-tight">
                  <CurrencyDisplay amountUSD={budget.amount} variant="compact" />
                </p>
                <span className="text-[11px] text-muted-foreground">total</span>
              </div>
            </div>
          </div>

          {/* REMAINING */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-muted border shadow p-2">
              {budget.remaining < 0 ? (
                <AlertCircle className="h-5 w-5 text-foreground/80" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-foreground/80" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Remaining
              </p>

              <div className="flex items-baseline gap-2 truncate">
                <p className="text-base font-semibold truncate tracking-tight">
                  <CurrencyDisplay amountUSD={Math.max(0, budget.remaining)} variant="compact" />
                </p>
                <span className="text-[11px] text-muted-foreground">left</span>
              </div>
            </div>
          </div>

          {/* DAILY AVERAGE */}
          {budget.daysRemaining > 0 && (
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-full bg-muted border shadow p-2">
                <TrendingDown className="h-5 w-5 text-foreground/80" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Daily
                </p>

                <div className="flex items-baseline gap-1">
                  <p className="text-base font-semibold truncate tracking-tight">
                    <CurrencyDisplay amountUSD={budget.dailyAverage} variant="compact" />
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-border/70" />

        {/* Chart Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold">Spending Trend</h3>
            <p className="text-xs text-muted-foreground">Track your spending over time</p>
          </div>
          <BudgetSpendingChart
            budgetId={budget.id}
            budgetName={budget.name}
            budgetAmount={budget.amount}
            spent={budget.spent}
            height={220}
          />
        </div>
      </div>
    </Card>
  );
}
