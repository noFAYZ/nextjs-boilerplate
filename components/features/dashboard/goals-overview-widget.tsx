'use client';

import { useState, useMemo, memo } from 'react';
import {
  ArrowRight,
} from 'lucide-react';
import { useActiveGoals } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '../ui/card';
import { MageGoals, SolarCheckCircleBoldDuotone } from '../icons/icons';
import { WidgetSkeleton } from '../ui/widget-skeleton';
import { GoalsEmptyState } from '../ui/dashboard-empty-state';

function GoalItem({ goal }: { goal: { currentAmount?: number; targetAmount?: number; name?: string } }) {
  let progress = 0;

  if (goal.currentAmount !== undefined && goal.targetAmount) {
    const current = Number(goal.currentAmount) || 0;
    const target = Number(goal.targetAmount) || 0;
    if (target > 0) {
      progress = (current / target) * 100;
    }
  }

  progress = Math.max(0, Math.min(progress, 100));

  const getProgressColor = () => {
    if (goal.isAchieved) return 'bg-blue-700 dark:bg-blue-500';
    if (goal.onTrack) return 'bg-lime-700 dark:bg-lime-600';
    return 'bg-orange-600 dark:bg-orange-400';
  };

  return (
    <Link href="/goals">
      <div className={cn(
        'group relative flex items-center gap-2.5 p-2 rounded-lg transition-all duration-75',
        'hover:bg-muted/60 cursor-pointer'
      )}>
        <div className="h-10 w-10 rounded-full bg-muted border flex items-center justify-center flex-shrink-0">
          {goal.isAchieved || progress >= 100 ? (
            <SolarCheckCircleBoldDuotone className="h-6 w-6 text-lime-600" />
          ) : (
            <span className="text-xs font-bold text-foreground">{Math.max(progress, 0).toFixed(0)}%</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate text-foreground">
            {goal.name}
          </h4>
          <div className="w-full h-2 bg-muted rounded-xs overflow-hidden mt-1">
            <div
              className={cn('h-full rounded-none transition-all', getProgressColor())}
              style={{ width: `${Math.max(progress, 0)}%` }}
            />
          </div>
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </Link>
  );
}

type TabType = 'all' | 'on-track' | 'behind' | 'completed';

function GoalsOverviewWidgetComponent() {
  const { data: goalsResponse, isLoading: goalsLoading } = useActiveGoals();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { isRefetching } = useOrganizationRefetchState();

  const goalsToShow = useMemo(() => {
    if (!goalsResponse?.data) return [];

    const goals = goalsResponse.data;

    switch (activeTab) {
      case 'all':
        return goals.filter(g => g.isActive && !g.isAchieved).slice(0, 4);
      case 'on-track':
        return goals.filter(g => g.onTrack && !g.isAchieved).slice(0, 4);
      case 'behind':
        return goals.filter(g => !g.onTrack && !g.isAchieved).slice(0, 4);
      case 'completed':
        return goals.filter(g => g.isAchieved).slice(0, 4);
      default:
        return [];
    }
  }, [goalsResponse, activeTab]);

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

  if (goalsLoading) {
    return <WidgetSkeleton variant="list" itemsCount={3} />;
  }

  if (tabCounts.all === 0) {
    return (
      <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-sm bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <MageGoals className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground truncate">Goals</h3>
            </div>
            <Link href="/goals" className="flex-shrink-0">
              <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
                <span className="hidden sm:inline">View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <GoalsEmptyState
              icon={<MageGoals className="h-6 w-6" />}
              showCard={false}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-sm bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <MageGoals className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Goals</h3>
          </div>
          <Link href="/goals" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-3">
            <TabsList variant="pill" size="sm" className="w-full">
              <TabsTrigger value="all" variant="pill" size="sm" className="flex-1">
                <span>All</span>
                {tabCounts.all > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.all}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="on-track" variant="pill" size="sm" className="flex-1">
                <span>On Track</span>
                {tabCounts.onTrack > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.onTrack}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" variant="pill" size="sm" className="flex-1">
                <span>Done</span>
                {tabCounts.completed > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.completed}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {goalsToShow.length > 0 ? (
            <div className="space-y-1.5">
              {goalsToShow.map((goal) => (
                <GoalItem key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <GoalsEmptyState
              icon={<MageGoals className="h-6 w-6" />}
              showCard={false}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

export const GoalsOverviewWidget = memo(GoalsOverviewWidgetComponent);
