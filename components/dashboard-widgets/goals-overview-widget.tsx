'use client';

import { useMemo } from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { useActiveGoals, useGoalSummary } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import Link from 'next/link';

export function GoalsOverviewWidget() {
  const { data: goalsResponse, isLoading: goalsLoading } = useActiveGoals();
  const summary = useGoalSummary();

  // Get top 3 most important active goals
  const topGoals = useMemo(() => {
    if (!goalsResponse?.data) return [];

    return goalsResponse.data
      .filter(g => !g.isAchieved && g.isActive)
      .sort((a, b) => {
        // Sort by priority first, then by progress
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.progress - a.progress;
      })
      .slice(0, 3);
  }, [goalsResponse]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'LOW':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  if (goalsLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Goals progress</h3>
        <div className="space-y-3">
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topGoals.length) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-muted-foreground">Goals progress</h3>
          <Link href="/goals">
            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">
              View All
            </Badge>
          </Link>
        </div>
        <div className="py-8 text-center">
          <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground mb-2">
            No active goals found.
          </p>
          <Link href="/goals">
            <Badge variant="default" className="text-[10px] cursor-pointer">
              Create Goal
            </Badge>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-muted-foreground">Goals progress</h3>
        <Link href="/goals">
          <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">
            View All ({summary.active})
          </Badge>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* On Track */}
        <div className="p-2 rounded-lg bg-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
              On Track
            </span>
          </div>
          <p className="text-lg font-bold text-foreground">{summary.onTrack}</p>
        </div>

        {/* Off Track */}
        <div className="p-2 rounded-lg bg-orange-500/5 border border-orange-500/20">
          <div className="flex items-center gap-1 mb-1">
            <AlertCircle className="h-3 w-3 text-orange-600 dark:text-orange-400" />
            <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400">
              Behind
            </span>
          </div>
          <p className="text-lg font-bold text-foreground">{summary.offTrack}</p>
        </div>

        {/* Completed */}
        <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-1 mb-1">
            <Trophy className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
              Done
            </span>
          </div>
          <p className="text-lg font-bold text-foreground">{summary.completed}</p>
        </div>
      </div>

      {/* Top Goals */}
      <div className="flex flex-col  space-y-1">
        {topGoals.map((goal) => {
          const progress = Math.min(goal.progress, 100);
          const isUrgent = goal.daysRemaining <= 7 && goal.daysRemaining > 0;
          const isOverdue = goal.daysRemaining < 0;

          return (
            <Link key={goal.id} href="/goals">
              <div className="group p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {goal.icon && goal.icon !== 'null' ? (
                      <span className="text-base flex-shrink-0">{goal.icon}</span>
                    ) : (
                      <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {goal.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CurrencyDisplay
                          amountUSD={goal.currentAmount}
                          variant="compact"
                          className="text-[10px] text-muted-foreground"
                        />
                        <span className="text-[10px] text-muted-foreground">/</span>
                        <CurrencyDisplay
                          amountUSD={goal.targetAmount}
                          variant="compact"
                          className="text-[10px] text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[9px] h-4 px-1.5 font-medium ${getPriorityColor(goal.priority)}`}
                  >
                    {goal.priority}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      goal.onTrack
                        ? 'bg-green-600 dark:bg-green-400'
                        : 'bg-orange-600 dark:bg-orange-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-foreground">
                    {progress.toFixed(0)}% complete
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span
                      className={`text-[10px] font-medium ${
                        isOverdue
                          ? 'text-red-600 dark:text-red-400'
                          : isUrgent
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {isOverdue
                        ? 'Overdue'
                        : goal.daysRemaining === 0
                        ? 'Today'
                        : `${goal.daysRemaining}d left`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Overall Progress */}
      {summary.totalTargetAmount > 0 && (
        <div className="mt-3 p-2.5 rounded-lg bg-muted/40 border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground">
              Overall Progress
            </span>
            <span className="text-[10px] font-semibold text-foreground">
              {summary.averageProgress.toFixed(0)}%
            </span>
          </div>
          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
              style={{ width: `${Math.min(summary.averageProgress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
