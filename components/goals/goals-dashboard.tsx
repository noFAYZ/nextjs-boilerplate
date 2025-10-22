'use client';

import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { useGoalsStore, selectFilteredGoals, selectActiveGoals, selectCompletedGoals, selectOffTrackGoals } from '@/lib/stores';
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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import type { Goal } from '@/lib/types/goals';
import { GoalCardList } from './GoalList';
import { IcTwotoneEnergySavingsLeaf, MageGoals, NotoMoneyBag, StreamlinePlumpMoneyCashBill1 } from '../icons/icons';
import { formatBusinessTime, timestampzToReadable } from '@/lib/utils/time';

export function GoalsDashboard() {
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

  // Get state from store using selectors
  const store = useGoalsStore();
  const {
    goalsLoading,
    goalsError,
    analytics,
    viewPreferences,
    filters,
    setGoals,
    setGoalsLoading,
    setGoalsError,
    setAnalytics,
    setAnalyticsLoading,
    setViewMode,
    setSearchQuery,
  } = store;

  // Use optimized selectors from store - these are memoized
  const filteredGoals = useMemo(() => selectFilteredGoals(store), [store]);
  const activeGoals = useMemo(() => selectActiveGoals(store), [store]);
  const completedGoals = useMemo(() => selectCompletedGoals(store), [store]);
  const offTrackGoals = useMemo(() => selectOffTrackGoals(store), [store]);

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

  // Load data functions - stable references
  const loadGoals = useCallback(async () => {
    setGoalsLoading(true);

    try {
      const response = await goalsApi.getGoals({
        isActive: true,
        includeMilestones: true,
        sortBy: viewPreferences.sortBy,
        sortOrder: viewPreferences.sortOrder,
      });

      if (response.success && response.data) {
        // Extract goals array from response
        const goalsArray = Array.isArray(response.data) ? response.data : [];
        setGoals(goalsArray);
        setGoalsError(null);
      } else if (!response.success) {
        const error = response.error;
        const isExpectedError =
          error?.code === 'NOT_IMPLEMENTED' ||
          error?.code === 'CALCULATION_ERROR';

        if (isExpectedError) {
          setGoals([]);
          toast.info('Goals feature is initializing', {
            description: 'The goals system is being set up.',
          });
        } else {
          const errorMessage = error?.message || 'Failed to load goals';
          setGoalsError(errorMessage);
          toast.error('Failed to load goals', {
            description: errorMessage,
          });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setGoalsError(message);
      toast.error('Failed to load goals', { description: message });
    } finally {
      setGoalsLoading(false);
    }
  }, [viewPreferences.sortBy, viewPreferences.sortOrder, setGoals, setGoalsError, setGoalsLoading]);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);

    try {
      const response = await goalsApi.getAnalytics();

      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      // Silently fail - analytics is optional
      console.error('Failed to load analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [setAnalytics, setAnalyticsLoading]);

  // Refresh handler with transition
  const handleRefresh = useCallback(() => {
    startTransition(async () => {
      await Promise.allSettled([loadGoals(), loadAnalytics()]);

      if (!goalsError) {
        toast.success('Goals refreshed');
      }
    });
  }, [loadGoals, loadAnalytics, goalsError]);

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
      const response = await goalsApi.deleteGoal(deletingGoal.id);

      if (response.success) {
        toast.success('Goal deleted successfully');
        await loadGoals();
      } else {
        const error = response.error;
        toast.error('Failed to delete goal', {
          description: error?.message || 'An error occurred',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error('Failed to delete goal', { description: message });
    } finally {
      setIsDeleting(false);
      setDeletingGoal(null);
    }
  }, [deletingGoal, loadGoals]);

  const handleCalculateProgress = useCallback(async (goal: Goal) => {
    try {
      toast.info('Calculating progress...', { description: 'This may take a moment' });

      const response = await goalsApi.calculateProgress(goal.id);

      if (response.success) {
        toast.success('Progress updated successfully');
        await loadGoals();
      } else {
        const error = response.error;
        toast.error('Failed to calculate progress', {
          description: error?.message || 'An error occurred',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error('Failed to calculate progress', { description: message });
    }
  }, [loadGoals]);

  const handleAddContribution = useCallback((goal: Goal) => {
    setContributingGoal(goal);
    setIsContributionDialogOpen(true);
  }, []);

  const confirmAddContribution = useCallback(async (amount: number, date: string, note?: string) => {
    if (!contributingGoal) return;

    setIsAddingContribution(true);
    try {
      const response = await goalsApi.addContribution(contributingGoal.id, {
        amount,
        date,
        note,
      });

      if (response.success) {
        toast.success('Contribution added successfully');
        await loadGoals();
      } else {
        const error = response.error;
        toast.error('Failed to add contribution', {
          description: error?.message || 'An error occurred',
        });
        throw new Error(error?.message || 'Failed to add contribution');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error('Failed to add contribution', { description: message });
      throw error;
    } finally {
      setIsAddingContribution(false);
      setContributingGoal(null);
    }
  }, [contributingGoal, loadGoals]);

  const handleViewDetails = useCallback((goal: Goal) => {
    // Navigate to goal details page or open a modal
    toast.info('View Details', { description: 'Details view coming soon' });
    // TODO: Implement navigation to goal details page
    // router.push(`/goals/${goal.id}`);
  }, []);

  // Load data on mount once
  React.useEffect(() => {
    loadGoals();
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Error Banner - Non-blocking */}
      {goalsError && store.goals.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <div className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-orange-900 dark:text-orange-200">
                Some features may be unavailable
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                {goalsError}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGoalsError(null)}
              className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Financial Goals</h1>
          <p className="text-muted-foreground text-xs">
            Track and achieve your financial objectives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/goals/analytics">
            <Button variant="outline" size={'sm'}>
              <BarChart3 className="mr-1 h-4 w-4" />
              Analytics
            </Button>
          </Link>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={goalsLoading}
          >
            <RefreshCw className={`h-4 w-4 ${goalsLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setIsFiltersOpen(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          <Button onClick={() => setIsCreateDialogOpen(true)} size={'sm'}>
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Search Bar
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search goals..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div> */}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className=" " variant={'card'}>
          <TabsTrigger value="all" className="flex items-center gap-1"   size={'sm'}
            variant="card">
            <Target className="h-4 w-4" />
            All
            <span className=" text-xs">({filteredGoals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-1"   size={'sm'}
            variant="card">
            <TrendingUp className="h-4 w-4" />
            Active
            <span className=" text-xs">({activeGoals.filter(g => !g.isAchieved).length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1"   size={'sm'}
            variant="card">
            <Trophy className="h-4 w-4" />
            Completed
            <span className=" text-xs">({completedGoals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="off-track" className="flex items-center gap-1"   size={'sm'}
            variant="card">
            <AlertCircle className="h-4 w-4" />
            Off Track
            <span className=" text-xs">({offTrackGoals.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {goalsLoading && store.goals.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          ) : tabGoals.length === 0 ? (
            <Card className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
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
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          loadGoals();
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
