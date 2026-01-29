'use client';

import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalsStore, selectFilteredGoals, selectActiveGoals, selectCompletedGoals, selectOffTrackGoals } from '@/lib/stores';
import { useGoals, useDeleteGoal, useCalculateGoalProgress, useAddContribution } from '@/lib/queries/use-goal-data';
import { goalsApi } from '@/lib/services/goals-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCw, Filter, TrendingUp, Target, Trophy, AlertCircle, BarChart3, TreePalm } from 'lucide-react';
import { GoalCard } from './goal-card';
import { CreateGoalDialog } from './create-goal-dialog';
import { DeleteGoalDialog } from './delete-goal-dialog';
import { AddContributionDialog } from './add-contribution-dialog';
import Link from 'next/link';
import { GoalFiltersSheet } from './goal-filters-sheet';
import { GoalCardSkeleton } from './goal-card-skeleton';
import { useToast } from "@/lib/hooks/useToast";
import type { Goal } from '@/lib/types/goals';
import { GoalCardList } from './GoalList';
import { IcTwotoneEnergySavingsLeaf, MageGoals, NotoMoneyBag, StreamlinePlumpMoneyCashBill1 } from '../icons/icons';
import { formatBusinessTime, timestampzToReadable } from '@/lib/utils/time';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function GoalsDashboard() {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContributionDialogOpen, setIsContributionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingContribution, setIsAddingContribution] = useState(false);

  // React Query hooks for real data
  const { data: goalsResponse, isLoading: goalsLoading, error: goalsError } = useGoals();
  const deleteGoalMutation = useDeleteGoal();
  const calculateProgressMutation = useCalculateGoalProgress();
  const addContributionMutation = useAddContribution();

  // Get state from store using selectors (for UI preferences)
  const store = useGoalsStore();
  const {
    analytics,
    viewPreferences,
    filters,
    setAnalytics,
    setAnalyticsLoading,
    setViewMode,
    setSearchQuery,
  } = store;

  // Compute filtered goals from React Query data
  const allGoals = goalsResponse?.data || [];

  const filteredGoals = useMemo(() => {
    let goals = allGoals;

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      goals = goals.filter(g => g.name.toLowerCase().includes(query));
    }

    return goals;
  }, [allGoals, filters.searchQuery]);

  const activeGoals = useMemo(() => {
    return filteredGoals.filter(g => g.isActive && !g.isAchieved);
  }, [filteredGoals]);

  const completedGoals = useMemo(() => {
    return filteredGoals.filter(g => g.isAchieved);
  }, [filteredGoals]);

  const offTrackGoals = useMemo(() => {
    return filteredGoals.filter(g => g.isActive && !g.isAchieved && !g.onTrack);
  }, [filteredGoals]);

  // Compute tab-specific goals efficiently
  const tabGoals = useMemo(() => {
    switch (activeTab) {
      case 'all':
        return filteredGoals;
      case 'active':
        return activeGoals.filter(g => !g.isAchieved);
      case 'completed':
        return completedGoals;
      case 'off-track':
        return offTrackGoals;
      default:
        return filteredGoals;
    }
  }, [activeTab, filteredGoals, activeGoals, completedGoals, offTrackGoals]);

  // Refresh handler - refetch data from server
  const handleRefresh = useCallback(() => {
    startTransition(() => {
      // React Query will refetch automatically
      // This is a no-op since React Query handles refetching
      success('Goals refreshed');
    });
  }, [success]);

  // Goal action handlers
  const handleEditGoal = useCallback((goal: Goal) => {
    setEditingGoal(goal);
    setIsCreateDialogOpen(true);
  }, []);

  const handleDeleteGoal = useCallback((goal: Goal) => {
    setDeletingGoal(goal);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDeleteGoal = useCallback(async () => {
    if (!deletingGoal) return;

    setIsDeleting(true);
    try {
      deleteGoalMutation.mutate(deletingGoal.id, {
        onSuccess: () => {
          success('Goal deleted successfully');
          setIsDeleteDialogOpen(false);
          setDeletingGoal(null);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to delete goal';
          toastError({ title: 'Failed to delete goal', description: message });
        },
        onSettled: () => {
          setIsDeleting(false);
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toastError({ title: 'Failed to delete goal', description: message });
      setIsDeleting(false);
    }
  }, [deletingGoal, deleteGoalMutation, success, toastError]);

  const handleCalculateProgress = useCallback(async (goal: Goal) => {
    try {
      info({ title: 'Calculating progress...', description: 'This may take a moment' });

      calculateProgressMutation.mutate(goal.id, {
        onSuccess: () => {
          success('Progress updated successfully');
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to calculate progress';
          toastError({ title: 'Failed to calculate progress', description: message });
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toastError({ title: 'Failed to calculate progress', description: message });
    }
  }, [calculateProgressMutation, info, success, toastError]);

  const handleAddContribution = useCallback((goal: Goal) => {
    setContributingGoal(goal);
    setIsContributionDialogOpen(true);
  }, []);

  const confirmAddContribution = useCallback(async (amount: number, date: string, note?: string) => {
    if (!contributingGoal) return;

    setIsAddingContribution(true);
    try {
      addContributionMutation.mutate(
        {
          goalId: contributingGoal.id,
          data: { amount, date, note },
        },
        {
          onSuccess: () => {
            success('Contribution added successfully');
            setIsContributionDialogOpen(false);
            setContributingGoal(null);
          },
          onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to add contribution';
            toastError({ title: 'Failed to add contribution', description: message });
            throw err;
          },
          onSettled: () => {
            setIsAddingContribution(false);
          },
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toastError({ title: 'Failed to add contribution', description: message });
      throw err;
    }
  }, [contributingGoal, addContributionMutation, success, toastError]);

  const handleViewDetails = useCallback((goal: Goal) => {
    router.push(`/goals/${goal.id}`);
  }, [router]);

  // Data loading is handled by React Query hooks automatically
  // No useEffect needed for data fetching

  return (
    <div className="mx-auto  space-y-3">
      {/* Error Banner - Non-blocking */}
      {goalsError && allGoals.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <div className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-orange-900 dark:text-orange-200">
                Failed to load goals
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                {goalsError instanceof Error ? goalsError.message : 'An error occurred while loading your goals'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
 
        <div className="flex items-center gap-2">
             {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search goals..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
           
            className="max-w-md h-8"
          />
        </div>
      </div>
          <Link href="/goals/analytics">
            <Button variant="outline" size={'xs'}>
              <BarChart3 className="mr-1 h-4 w-4" />
              Analytics
            </Button>
          </Link>

          <Button
            variant="outline"
            size="xs"
            onClick={handleRefresh}
            disabled={goalsLoading}
          >
            <RefreshCw className={`h-4 w-4 ${goalsLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsFiltersOpen(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          <Button onClick={() => setIsCreateDialogOpen(true)} size={'xs'}>
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </div>
      </div>

   

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className=" " variant={'pill'}>
          <TabsTrigger value="all" className="flex items-center gap-1"  
            variant="pill">
            <Target className="h-4 w-4" />
            All
            <span className=" text-xs">({filteredGoals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-1"  
            variant="pill">
            <TrendingUp className="h-4 w-4" />
            Active
            <span className=" text-xs">({activeGoals.filter(g => !g.isAchieved).length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1"  
            variant="pill">
            <Trophy className="h-4 w-4" />
            Completed
            <span className=" text-xs">({completedGoals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="off-track" className="flex items-center gap-1"  
            variant="pill">
            <AlertCircle className="h-4 w-4" />
            Off Track
            <span className=" text-xs">({offTrackGoals.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {goalsLoading && allGoals.length === 0 ? (
            <GoalListSkeleton view={viewPreferences.viewMode} />
          ) : tabGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <MageGoals className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Goals Found</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                {activeTab === 'all'
                  ? 'Get started by creating your first financial goal'
                  : `No ${activeTab} goals at the moment`
                }
              </p>
              {activeTab === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Goal
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
              {tabGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  viewMode="grid"
                  showMilestones={true}
                  compactMode={false}
                  loading={false}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onCalculateProgress={handleCalculateProgress}
                  onAddContribution={handleAddContribution}
                  onViewDetails={handleViewDetails}
                />
              ))}


            </div>
          )}
{/* 
{tabGoals.map((goal) => (
                  <GoalCardList
                  title={goal.name}
                  current={goal.currentAmount}
                  target={goal.targetAmount}
                  deadline={goal.targetDate }
                  color="from-orange-500 to-primary"
                  icon={<StreamlinePlumpMoneyCashBill1 className="w-9 h-9" stroke='2' />}
                  onTrack={goal.onTrack}
                />
              ))} */}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateGoalDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setEditingGoal(null);
          }
        }}
        onSuccess={() => {
          // React Query mutations automatically invalidate cache
          setEditingGoal(null);
        }}
        goal={editingGoal || undefined}
      />

      <DeleteGoalDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        goal={deletingGoal}
        onConfirm={confirmDeleteGoal}
        isLoading={isDeleting}
      />

      <AddContributionDialog
        open={isContributionDialogOpen}
        onOpenChange={setIsContributionDialogOpen}
        goal={contributingGoal}
        onConfirm={confirmAddContribution}
        isLoading={isAddingContribution}
      />

      <GoalFiltersSheet
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
      />
    </div>
  );
}

function GoalListSkeleton({ view }: { view: 'grid' | 'list' | 'table' }) {
  const gridClasses = {
    grid: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
    list: 'flex flex-col gap-3',
    table: 'space-y-2',
  };

  const count = view === 'grid' ? 6 : 4;

  return (
    <div className={gridClasses[view]}>
      {Array.from({ length: count }).map((_, i) => (
        <GoalCardSkeleton key={i} />
      ))}
    </div>
  );
}
