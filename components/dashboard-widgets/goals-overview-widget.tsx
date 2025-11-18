'use client';

import { useState, useMemo } from 'react';
import {
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useActiveGoals, useGoalSummary } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

// Goal Item Component - Similar to Subscription List
function GoalItem({ goal }: { goal: any }) {
  // Normalize progress value - handle both decimal (0-1) and percentage (0-100) formats
  let progress = goal.progress ?? 0;
  if (progress > 1) {
    // Already a percentage (0-100)
    progress = Math.min(progress, 100);
  } else {
    // Decimal format (0-1), convert to percentage
    progress = Math.min(progress * 100, 100);
  }

  const isUrgent = goal.daysRemaining <= 7 && goal.daysRemaining > 0;
  const isOverdue = goal.daysRemaining < 0;

  const getStatusBgColor = () => {
    if (goal.isAchieved) return 'bg-blue-500/5 hover:bg-blue-500/10';
    if (isOverdue) return 'bg-red-500/5 hover:bg-red-500/10';
    if (isUrgent) return 'bg-orange-500/5 hover:bg-orange-500/10';
    if (goal.onTrack) return 'bg-green-500/5 hover:bg-green-500/10';
    return 'hover:bg-muted/60';
  };

  const getProgressColor = () => {
    if (goal.isAchieved) return 'bg-blue-600 dark:bg-blue-400';
    if (goal.onTrack) return 'bg-green-600 dark:bg-green-400';
    return 'bg-orange-600 dark:bg-orange-400';
  };

  const getProgressTextColor = () => {
    if (goal.isAchieved) return 'text-blue-600 dark:text-blue-400';
    if (goal.onTrack) return 'text-green-600 dark:text-green-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getTimeColor = () => {
    if (goal.isAchieved) return 'text-blue-600 dark:text-blue-400';
    if (isOverdue) return 'text-red-600 dark:text-red-400';
    if (isUrgent) return 'text-orange-600 dark:text-orange-400';
    return 'text-muted-foreground';
  };

  return (
    <Link href="/goals">
      <div
        className={cn(
          'group relative border border-border/80 flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-75',
          'cursor-pointer',
          getStatusBgColor()
        )}
      >
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div className="h-11 w-11 rounded-lg bg-muted/50 flex items-center justify-center">
            {goal.icon && goal.icon !== 'null' ? (
              <span className="text-lg">{goal.icon}</span>
            ) : (
              <Target className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          {goal.isAchieved && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-[4px] bg-blue-500 ring-1 ring-background">
              <CheckCircle2 className="h-2.5 w-2.5 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-semibold text-sm truncate text-foreground">
              {goal.name}
            </h4>
          </div>

          {/* Progress Bar and Info */}
          <div className="space-y-1.5">
            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-300', getProgressColor())}
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Progress Info */}
            <div className="flex items-center justify-between text-[10px] gap-1">
              <div className="flex items-center gap-1">
                <span className={cn('font-semibold', getProgressTextColor())}>
                  {progress.toFixed(0)}%
                </span>
                <span className="text-muted-foreground">•</span>
                <CurrencyDisplay
                  amountUSD={goal.currentAmount}
                  variant="compact"
                  className="font-medium text-foreground"
                />
              </div>
              <span className="text-muted-foreground">
                <CurrencyDisplay
                  amountUSD={goal.targetAmount}
                  variant="compact"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="flex flex-col items-end flex-shrink-0 gap-1">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className={cn('text-[10px] font-semibold', getTimeColor())}>
              {goal.isAchieved
                ? 'Done'
                : isOverdue
                ? 'Overdue'
                : goal.daysRemaining === 0
                ? 'Today'
                : `${goal.daysRemaining}d`}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'text-[8px] h-4 px-1 font-medium',
              goal.priority === 'CRITICAL' && 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
              goal.priority === 'HIGH' && 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
              goal.priority === 'MEDIUM' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
              goal.priority === 'LOW' && 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
            )}
          >
            {goal.priority}
          </Badge>
        </div>

        {/* Hover Indicator */}
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </Link>
  );
}

type TabType = 'all' | 'on-track' | 'behind' | 'completed';

export function GoalsOverviewWidget() {
  const { data: goalsResponse, isLoading: goalsLoading } = useActiveGoals();
  const summary = useGoalSummary();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Get goals to display based on active tab
  const goalsToShow = useMemo(() => {
    if (!goalsResponse?.data) return [];

    const goals = goalsResponse.data;

    switch (activeTab) {
      case 'all':
        return goals.filter(g => g.isActive && !g.isAchieved).slice(0, 5);
      case 'on-track':
        return goals.filter(g => g.onTrack && !g.isAchieved).slice(0, 5);
      case 'behind':
        return goals.filter(g => !g.onTrack && !g.isAchieved).slice(0, 5);
      case 'completed':
        return goals.filter(g => g.isAchieved).slice(0, 5);
      default:
        return [];
    }
  }, [goalsResponse, activeTab]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    if (!goalsResponse?.data) return { all: 0, onTrack: 0, behind: 0, completed: 0 };

    const data = goalsResponse.data;
    return {
      all: data.filter(g => g.isActive && !g.isAchieved).length,
      onTrack: data.filter(g => g.onTrack && !g.isAchieved).length,
      behind: data.filter(g => !g.onTrack && !g.isAchieved).length,
      completed: data.filter(g => g.isAchieved).length,
    };
  }, [goalsResponse]);

  // Loading State
  if (goalsLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-4">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
          <div className="space-y-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (tabCounts.all === 0) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Goals</h3>
          </div>
          <Link href="/goals">
            <Button variant="outline" className="text-[11px] cursor-pointer hover:bg-muted transition-colors h-7" size="sm">
              Create Goal
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="py-8 text-center">
          <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs font-medium text-foreground mb-0.5">
            No active goals yet
          </p>
          <p className="text-[10px] text-muted-foreground">
            Create a goal to start tracking progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-card p-4 shadow-xs dark:shadow-none h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center">
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Goals</h3>
        </div>
        <Link href="/goals">
          <Button variant="outline" className="text-[11px] cursor-pointer hover:bg-muted transition-colors h-7" size="sm">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Main Metric */}
      {summary.totalTargetAmount > 0 && (
        <div className="mb-4 border-b border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Target Amount</div>
          <div className="flex items-baseline gap-2">
            <CurrencyDisplay
              amountUSD={summary.totalTargetAmount}
              variant="large"
              className="text-4xl font-semibold"
            />
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>{summary.averageProgress.toFixed(0)}% avg progress</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-4">
        <TabsList variant="pill" size="sm">
          <TabsTrigger value="all" variant="pill" size="sm" className="flex-1">
            <span>All</span>
            {tabCounts.all > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="on-track" variant="pill" size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4" />
            <span>On Track</span>
            {tabCounts.onTrack > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.onTrack}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="behind" variant="pill" size="sm" className="flex-1">
            <AlertCircle className="h-4 w-4" />
            <span>Behind</span>
            {tabCounts.behind > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.behind}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" variant="pill" size="sm" className="flex-1">
            <Trophy className="h-4 w-4" />
            <span>Done</span>
            {tabCounts.completed > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.completed}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Goals List */}
      {goalsToShow.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              {activeTab === 'all' && <Target className="h-4 w-4 text-muted-foreground" />}
              {activeTab === 'on-track' && <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
              {activeTab === 'behind' && <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
              {activeTab === 'completed' && <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {activeTab === 'all' && 'All Active Goals'}
                {activeTab === 'on-track' && 'On Track'}
                {activeTab === 'behind' && 'Behind Schedule'}
                {activeTab === 'completed' && 'Completed Goals'}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {goalsToShow.length} of {
                activeTab === 'all' ? tabCounts.all :
                activeTab === 'on-track' ? tabCounts.onTrack :
                activeTab === 'behind' ? tabCounts.behind :
                tabCounts.completed
              }
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            {goalsToShow.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
          {activeTab === 'all' && (
            <>
              <Target className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No active goals</p>
              <p className="text-[9px] text-muted-foreground">
                Create a goal to get started
              </p>
            </>
          )}
          {activeTab === 'on-track' && (
            <>
              <TrendingUp className="h-5 w-5 mx-auto mb-1.5 text-green-600 dark:text-green-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No goals on track</p>
              <p className="text-[9px] text-muted-foreground">
                Keep working toward your goals
              </p>
            </>
          )}
          {activeTab === 'behind' && (
            <>
              <AlertCircle className="h-5 w-5 mx-auto mb-1.5 text-orange-600 dark:text-orange-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">Great job!</p>
              <p className="text-[9px] text-muted-foreground">
                No goals behind schedule
              </p>
            </>
          )}
          {activeTab === 'completed' && (
            <>
              <Trophy className="h-5 w-5 mx-auto mb-1.5 text-blue-600 dark:text-blue-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No completed goals yet</p>
              <p className="text-[9px] text-muted-foreground">
                Complete your goals to see them here
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
