import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  GoalFilters,
  GoalViewPreferences,
  GoalType,
  GoalCategory,
  GoalPriority,
  GoalSourceType
} from '@/lib/types/goals';

interface GoalsState {
  // UI Selection State
  selectedGoalId: string | null;

  // Filters (UI state)
  filters: GoalFilters;

  // View preferences (UI state)
  viewPreferences: GoalViewPreferences;

  // UI state for operations
  isCreatingGoal: boolean;
  isUpdatingGoal: boolean;
  isDeletingGoal: boolean;
  isAddingContribution: boolean;

  // Bulk operations state (UI)
  selectedGoalIds: string[];
  isBulkOperating: boolean;
}

interface GoalsActions {
  // Selection actions (UI state)
  selectGoal: (goalId: string | null) => void;

  // Filter actions (UI state)
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

  // View preference actions (UI state)
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  setSortBy: (sortBy: GoalViewPreferences['sortBy']) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setShowMilestones: (show: boolean) => void;
  setShowProgress: (show: boolean) => void;
  setShowProjections: (show: boolean) => void;
  setCardsPerRow: (cards: 2 | 3 | 4) => void;
  setCompactMode: (compact: boolean) => void;

  // Operation state actions (UI)
  setIsCreatingGoal: (isCreating: boolean) => void;
  setIsUpdatingGoal: (isUpdating: boolean) => void;
  setIsDeletingGoal: (isDeleting: boolean) => void;
  setIsAddingContribution: (isAdding: boolean) => void;

  // Bulk operations (UI)
  toggleGoalSelection: (goalId: string) => void;
  selectAllGoals: (totalCount: number) => void;
  clearGoalSelection: () => void;
  setIsBulkOperating: (isOperating: boolean) => void;

  // Utility actions
  resetState: () => void;
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
  // UI Selection State
  selectedGoalId: null,

  // Filters (UI state)
  filters: initialFilters,

  // View preferences (UI state)
  viewPreferences: initialViewPreferences,

  // UI state for operations
  isCreatingGoal: false,
  isUpdatingGoal: false,
  isDeletingGoal: false,
  isAddingContribution: false,

  // Bulk operations state (UI)
  selectedGoalIds: [],
  isBulkOperating: false,
};

export const useGoalsStore = create<GoalsStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // Selection actions (UI state)
        selectGoal: (goalId) =>
          set((state) => {
            state.selectedGoalId = goalId;
          }, false, 'selectGoal'),

        // Filter actions (UI state)
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
            state.filters = initialFilters;
          }, false, 'clearFilters'),

        // View preference actions (UI state)
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

        // Operation state actions (UI)
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

        setIsAddingContribution: (isAdding) =>
          set((state) => {
            state.isAddingContribution = isAdding;
          }, false, 'setIsAddingContribution'),

        // Bulk operations (UI)
        toggleGoalSelection: (goalId) =>
          set((state) => {
            const index = state.selectedGoalIds.indexOf(goalId);
            if (index > -1) {
              state.selectedGoalIds.splice(index, 1);
            } else {
              state.selectedGoalIds.push(goalId);
            }
          }, false, 'toggleGoalSelection'),

        selectAllGoals: (totalCount) =>
          set((state) => {
            state.selectedGoalIds = Array.from(
              { length: totalCount },
              (_, i) => i.toString()
            );
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
      })),
      {
        name: 'goals-ui-store',
      }
    ),
    {
      name: 'goals-store',
    }
  )
);

// Selectors
export const selectSelectedGoal = (state: GoalsStore) => state.selectedGoalId;

export const selectFilters = (state: GoalsStore) => state.filters;

export const selectViewPreferences = (state: GoalsStore) => state.viewPreferences;

export const selectSelectedGoalIds = (state: GoalsStore) => state.selectedGoalIds;

export const selectIsOperating = (state: GoalsStore) =>
  state.isCreatingGoal || state.isUpdatingGoal || state.isDeletingGoal || state.isAddingContribution;
