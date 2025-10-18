import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Goal,
  GoalAnalytics,
  GoalFilters,
  GoalViewPreferences,
  GoalType,
  GoalCategory,
  GoalPriority,
  GoalSourceType
} from '@/lib/types/goals';

interface GoalsState {
  // Goals data
  goals: Goal[];
  selectedGoal: Goal | null;
  goalsLoading: boolean;
  goalsError: string | null;

  // Analytics
  analytics: GoalAnalytics | null;
  analyticsLoading: boolean;
  analyticsError: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

  // Filters
  filters: GoalFilters;

  // View preferences
  viewPreferences: GoalViewPreferences;

  // UI state
  isCreatingGoal: boolean;
  isUpdatingGoal: boolean;
  isDeletingGoal: boolean;
  isCalculatingProgress: boolean;
  isAddingContribution: boolean;

  // Bulk operations state
  selectedGoalIds: string[];
  isBulkOperating: boolean;
}

interface GoalsActions {
  // Goal CRUD actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  selectGoal: (goal: Goal | null) => void;

  // Loading states
  setGoalsLoading: (loading: boolean) => void;
  setGoalsError: (error: string | null) => void;
  setIsCreatingGoal: (isCreating: boolean) => void;
  setIsUpdatingGoal: (isUpdating: boolean) => void;
  setIsDeletingGoal: (isDeleting: boolean) => void;
  setIsCalculatingProgress: (isCalculating: boolean) => void;
  setIsAddingContribution: (isAdding: boolean) => void;

  // Analytics actions
  setAnalytics: (analytics: GoalAnalytics) => void;
  setAnalyticsLoading: (loading: boolean) => void;
  setAnalyticsError: (error: string | null) => void;

  // Pagination actions
  setPagination: (pagination: GoalsState['pagination']) => void;

  // Filter actions
  setTypeFilter: (types: GoalType[]) => void;
  setCategoryFilter: (categories: GoalCategory[]) => void;
  setPriorityFilter: (priorities: GoalPriority[]) => void;
  setSourceTypeFilter: (sourceTypes: GoalSourceType[]) => void;
  setShowAchieved: (show: boolean) => void;
  setShowInactive: (show: boolean) => void;
  setShowArchived: (show: boolean) => void;
  setOnTrackOnly: (onTrackOnly: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  clearFilters: () => void;

  // View preference actions
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  setSortBy: (sortBy: GoalViewPreferences['sortBy']) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setShowMilestones: (show: boolean) => void;
  setShowProgress: (show: boolean) => void;
  setShowProjections: (show: boolean) => void;
  setCardsPerRow: (cards: 2 | 3 | 4) => void;
  setCompactMode: (compact: boolean) => void;

  // Bulk operations
  toggleGoalSelection: (goalId: string) => void;
  selectAllGoals: () => void;
  clearGoalSelection: () => void;
  setIsBulkOperating: (isOperating: boolean) => void;

  // Utility actions
  resetState: () => void;
  clearErrors: () => void;
  clearAllData: () => void;
}

type GoalsStore = GoalsState & GoalsActions;

const initialFilters: GoalFilters = {
  types: [],
  categories: [],
  priorities: [],
  sourceTypes: [],
  showAchieved: false,
  showInactive: false,
  showArchived: false,
  onTrackOnly: false,
  searchQuery: '',
  selectedTags: [],
  dateRange: {
    from: null,
    to: null,
  },
};

const initialViewPreferences: GoalViewPreferences = {
  viewMode: 'grid',
  sortBy: 'priority',
  sortOrder: 'desc',
  showMilestones: true,
  showProgress: true,
  showProjections: true,
  cardsPerRow: 3,
  compactMode: false,
};

const initialState: GoalsState = {
  // Goals data
  goals: [],
  selectedGoal: null,
  goalsLoading: false,
  goalsError: null,

  // Analytics
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,

  // Pagination
  pagination: null,

  // Filters
  filters: initialFilters,

  // View preferences
  viewPreferences: initialViewPreferences,

  // UI state
  isCreatingGoal: false,
  isUpdatingGoal: false,
  isDeletingGoal: false,
  isCalculatingProgress: false,
  isAddingContribution: false,

  // Bulk operations state
  selectedGoalIds: [],
  isBulkOperating: false,
};

export const useGoalsStore = create<GoalsStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // Goal CRUD actions
        setGoals: (goals) =>
          set((state) => {
            state.goals = goals;
          }, false, 'setGoals'),

        addGoal: (goal) =>
          set((state) => {
            state.goals.unshift(goal);
          }, false, 'addGoal'),

        updateGoal: (id, updates) =>
          set((state) => {
            const index = state.goals.findIndex((g) => g.id === id);
            if (index !== -1) {
              Object.assign(state.goals[index], updates);
            }
            if (state.selectedGoal?.id === id) {
              Object.assign(state.selectedGoal, updates);
            }
          }, false, 'updateGoal'),

        removeGoal: (id) =>
          set((state) => {
            state.goals = state.goals.filter((g) => g.id !== id);
            if (state.selectedGoal?.id === id) {
              state.selectedGoal = null;
            }
          }, false, 'removeGoal'),

        selectGoal: (goal) =>
          set((state) => {
            state.selectedGoal = goal;
          }, false, 'selectGoal'),

        // Loading states
        setGoalsLoading: (loading) =>
          set((state) => {
            state.goalsLoading = loading;
          }, false, 'setGoalsLoading'),

        setGoalsError: (error) =>
          set((state) => {
            state.goalsError = error;
          }, false, 'setGoalsError'),

        setIsCreatingGoal: (isCreating) =>
          set((state) => {
            state.isCreatingGoal = isCreating;
          }, false, 'setIsCreatingGoal'),

        setIsUpdatingGoal: (isUpdating) =>
          set((state) => {
            state.isUpdatingGoal = isUpdating;
          }, false, 'setIsUpdatingGoal'),

        setIsDeletingGoal: (isDeleting) =>
          set((state) => {
            state.isDeletingGoal = isDeleting;
          }, false, 'setIsDeletingGoal'),

        setIsCalculatingProgress: (isCalculating) =>
          set((state) => {
            state.isCalculatingProgress = isCalculating;
          }, false, 'setIsCalculatingProgress'),

        setIsAddingContribution: (isAdding) =>
          set((state) => {
            state.isAddingContribution = isAdding;
          }, false, 'setIsAddingContribution'),

        // Analytics actions
        setAnalytics: (analytics) =>
          set((state) => {
            state.analytics = analytics;
          }, false, 'setAnalytics'),

        setAnalyticsLoading: (loading) =>
          set((state) => {
            state.analyticsLoading = loading;
          }, false, 'setAnalyticsLoading'),

        setAnalyticsError: (error) =>
          set((state) => {
            state.analyticsError = error;
          }, false, 'setAnalyticsError'),

        // Pagination actions
        setPagination: (pagination) =>
          set((state) => {
            state.pagination = pagination;
          }, false, 'setPagination'),

        // Filter actions
        setTypeFilter: (types) =>
          set((state) => {
            state.filters.types = types;
          }, false, 'setTypeFilter'),

        setCategoryFilter: (categories) =>
          set((state) => {
            state.filters.categories = categories;
          }, false, 'setCategoryFilter'),

        setPriorityFilter: (priorities) =>
          set((state) => {
            state.filters.priorities = priorities;
          }, false, 'setPriorityFilter'),

        setSourceTypeFilter: (sourceTypes) =>
          set((state) => {
            state.filters.sourceTypes = sourceTypes;
          }, false, 'setSourceTypeFilter'),

        setShowAchieved: (show) =>
          set((state) => {
            state.filters.showAchieved = show;
          }, false, 'setShowAchieved'),

        setShowInactive: (show) =>
          set((state) => {
            state.filters.showInactive = show;
          }, false, 'setShowInactive'),

        setShowArchived: (show) =>
          set((state) => {
            state.filters.showArchived = show;
          }, false, 'setShowArchived'),

        setOnTrackOnly: (onTrackOnly) =>
          set((state) => {
            state.filters.onTrackOnly = onTrackOnly;
          }, false, 'setOnTrackOnly'),

        setSearchQuery: (query) =>
          set((state) => {
            state.filters.searchQuery = query;
          }, false, 'setSearchQuery'),

        setSelectedTags: (tags) =>
          set((state) => {
            state.filters.selectedTags = tags;
          }, false, 'setSelectedTags'),

        setDateRangeFilter: (from, to) =>
          set((state) => {
            state.filters.dateRange.from = from;
            state.filters.dateRange.to = to;
          }, false, 'setDateRangeFilter'),

        clearFilters: () =>
          set((state) => {
            state.filters = { ...initialFilters };
          }, false, 'clearFilters'),

        // View preference actions
        setViewMode: (mode) =>
          set((state) => {
            state.viewPreferences.viewMode = mode;
          }, false, 'setViewMode'),

        setSortBy: (sortBy) =>
          set((state) => {
            state.viewPreferences.sortBy = sortBy;
          }, false, 'setSortBy'),

        setSortOrder: (sortOrder) =>
          set((state) => {
            state.viewPreferences.sortOrder = sortOrder;
          }, false, 'setSortOrder'),

        setShowMilestones: (show) =>
          set((state) => {
            state.viewPreferences.showMilestones = show;
          }, false, 'setShowMilestones'),

        setShowProgress: (show) =>
          set((state) => {
            state.viewPreferences.showProgress = show;
          }, false, 'setShowProgress'),

        setShowProjections: (show) =>
          set((state) => {
            state.viewPreferences.showProjections = show;
          }, false, 'setShowProjections'),

        setCardsPerRow: (cards) =>
          set((state) => {
            state.viewPreferences.cardsPerRow = cards;
          }, false, 'setCardsPerRow'),

        setCompactMode: (compact) =>
          set((state) => {
            state.viewPreferences.compactMode = compact;
          }, false, 'setCompactMode'),

        // Bulk operations
        toggleGoalSelection: (goalId) =>
          set((state) => {
            const index = state.selectedGoalIds.indexOf(goalId);
            if (index === -1) {
              state.selectedGoalIds.push(goalId);
            } else {
              state.selectedGoalIds.splice(index, 1);
            }
          }, false, 'toggleGoalSelection'),

        selectAllGoals: () =>
          set((state) => {
            state.selectedGoalIds = state.goals.map((g) => g.id);
          }, false, 'selectAllGoals'),

        clearGoalSelection: () =>
          set((state) => {
            state.selectedGoalIds = [];
          }, false, 'clearGoalSelection'),

        setIsBulkOperating: (isOperating) =>
          set((state) => {
            state.isBulkOperating = isOperating;
          }, false, 'setIsBulkOperating'),

        // Utility actions
        resetState: () =>
          set((state) => {
            Object.assign(state, initialState);
          }, false, 'resetState'),

        clearErrors: () =>
          set((state) => {
            state.goalsError = null;
            state.analyticsError = null;
          }, false, 'clearErrors'),

        clearAllData: () =>
          set((state) => {
            Object.assign(state, initialState);
          }, false, 'clearAllData'),
      })),
      {
        name: 'goals-store',
        partialize: (state) => ({
          // Only persist view preferences and filters
          filters: state.filters,
          viewPreferences: state.viewPreferences,
        }),
      }
    ),
    {
      name: 'goals-store',
    }
  )
);

// Selectors
export const selectFilteredGoals = (state: GoalsStore) => {
  const { goals, filters } = state;

  return goals.filter((goal) => {
    // Filter by type
    if (filters.types.length > 0 && !filters.types.includes(goal.type)) {
      return false;
    }

    // Filter by category
    if (filters.categories.length > 0 && goal.category && !filters.categories.includes(goal.category)) {
      return false;
    }

    // Filter by priority
    if (filters.priorities.length > 0 && !filters.priorities.includes(goal.priority)) {
      return false;
    }

    // Filter by source type
    if (filters.sourceTypes.length > 0 && !filters.sourceTypes.includes(goal.sourceType)) {
      return false;
    }

    // Filter by achieved status
    if (!filters.showAchieved && goal.isAchieved) {
      return false;
    }

    // Filter by active status
    if (!filters.showInactive && !goal.isActive) {
      return false;
    }

    // Filter by archived status
    if (!filters.showArchived && goal.isArchived) {
      return false;
    }

    // Filter by on-track status
    if (filters.onTrackOnly && !goal.onTrack) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesName = goal.name.toLowerCase().includes(query);
      const matchesDescription = goal.description?.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }

    // Filter by tags
    if (filters.selectedTags.length > 0) {
      const hasTag = filters.selectedTags.some(tag => goal.tags.includes(tag));
      if (!hasTag) {
        return false;
      }
    }

    // Filter by date range
    if (filters.dateRange.from) {
      const targetDate = new Date(goal.targetDate);
      if (targetDate < filters.dateRange.from) {
        return false;
      }
    }

    if (filters.dateRange.to) {
      const targetDate = new Date(goal.targetDate);
      if (targetDate > filters.dateRange.to) {
        return false;
      }
    }

    return true;
  });
};

export const selectGoalsByPriority = (state: GoalsStore, priority: GoalPriority) => {
  return state.goals.filter((g) => g.priority === priority && g.isActive && !g.isArchived);
};

export const selectActiveGoals = (state: GoalsStore) => {
  return state.goals.filter((g) => g.isActive && !g.isArchived);
};

export const selectCompletedGoals = (state: GoalsStore) => {
  return state.goals.filter((g) => g.isAchieved);
};

export const selectOffTrackGoals = (state: GoalsStore) => {
  return state.goals.filter((g) => !g.onTrack && g.isActive && !g.isAchieved);
};

export const selectGoalById = (state: GoalsStore, goalId: string) => {
  return state.goals.find((g) => g.id === goalId);
};

export const selectTotalProgress = (state: GoalsStore) => {
  const activeGoals = selectActiveGoals(state);
  if (activeGoals.length === 0) return 0;
  return activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length;
};

export const selectTotalTargetAmount = (state: GoalsStore) => {
  return selectActiveGoals(state).reduce((sum, g) => sum + g.targetAmount, 0);
};

export const selectTotalCurrentAmount = (state: GoalsStore) => {
  return selectActiveGoals(state).reduce((sum, g) => sum + g.currentAmount, 0);
};
