/**
 * Dashboard Layout UI Store
 *
 * PURPOSE: Manages dashboard widget layout and visibility
 * - Widget positions, sizes, and order
 * - Widget visibility states
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): widget layout, visibility, positions
 * ❌ Server Data (TanStack Query): wallets, transactions, portfolio
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// STATE TYPES
// ============================================================================

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export type WidgetId =
  | 'net-worth'
  | 'networth-performance'
  | 'monthly-spending'
  | 'spending-categories'
  | 'crypto-allocation'
  | 'network-distribution'
  | 'account-comparison'
  | 'subscriptions'
  | 'calendar-subscriptions'
  | 'upcoming-bills'
  | 'recent-activity'
  | 'goals'
  | 'budgets'
  | 'money-flow';

export interface WidgetLayout {
  id: WidgetId;
  visible: boolean;
  order: number;
  size: WidgetSize; // Predefined sizes: small (1 col), medium (2 cols), large (3 cols), full (4 cols)
}

// Predefined size configurations
export const WIDGET_SIZE_CONFIG: Record<WidgetSize, { cols: number; label: string; description: string }> = {
  small: { cols: 1, label: 'Small', description: '1 column' },
  medium: { cols: 2, label: 'Medium', description: '2 columns' },
  large: { cols: 3, label: 'Large', description: '3 columns' },
  full: { cols: 4, label: 'Full Width', description: 'Full width (4 columns)' },
};

interface DashboardLayoutState {
  // Widget layout preferences (persistent)
  widgets: Record<WidgetId, WidgetLayout>;

  // Edit mode for dashboard
  isEditMode: boolean;
}

interface DashboardLayoutActions {
  // Widget visibility and order
  setWidgetVisible: (id: WidgetId, visible: boolean) => void;
  setWidgetOrder: (widgets: WidgetLayout[]) => void;
  setWidgetSize: (id: WidgetId, size: WidgetSize) => void;

  // Edit mode
  toggleEditMode: () => void;
  setEditMode: (isEditMode: boolean) => void;

  // Reset
  resetLayout: () => void;
}

type DashboardLayoutStore = DashboardLayoutState & DashboardLayoutActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const DEFAULT_WIDGETS: Record<WidgetId, WidgetLayout> = {
  'net-worth': { id: 'net-worth', visible: true, order: 0, size: 'medium' },
  'networth-performance': { id: 'networth-performance', visible: true, order: 1, size: 'large' },
  'monthly-spending': { id: 'monthly-spending', visible: true, order: 2, size: 'large' },
  'spending-categories': { id: 'spending-categories', visible: true, order: 3, size: 'large' },
  'crypto-allocation': { id: 'crypto-allocation', visible: true, order: 4, size: 'medium' },
  'network-distribution': { id: 'network-distribution', visible: true, order: 5, size: 'medium' },
  'account-comparison': { id: 'account-comparison', visible: true, order: 6, size: 'large' },
  'subscriptions': { id: 'subscriptions', visible: true, order: 7, size: 'medium' },
  'calendar-subscriptions': { id: 'calendar-subscriptions', visible: true, order: 8, size: 'large' },
  'upcoming-bills': { id: 'upcoming-bills', visible: false, order: 9, size: 'medium' },
  'recent-activity': { id: 'recent-activity', visible: false, order: 10, size: 'large' },
  'goals': { id: 'goals', visible: false, order: 11, size: 'medium' },
  'budgets': { id: 'budgets', visible: false, order: 12, size: 'medium' },
  'money-flow': { id: 'money-flow', visible: false, order: 13, size: 'full' },
};

const initialState: DashboardLayoutState = {
  widgets: DEFAULT_WIDGETS,
  isEditMode: false,
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useDashboardLayoutStore = create<DashboardLayoutStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // ================================================================
        // WIDGET LAYOUT ACTIONS
        // ================================================================
        setWidgetVisible: (id, visible) =>
          set((state) => {
            if (state.widgets[id]) {
              state.widgets[id].visible = visible;
            }
          }, false, 'dashboard-layout/setWidgetVisible'),

        setWidgetOrder: (widgets) =>
          set((state) => {
            widgets.forEach((widget) => {
              if (state.widgets[widget.id]) {
                state.widgets[widget.id].order = widget.order;
              }
            });
          }, false, 'dashboard-layout/setWidgetOrder'),

        setWidgetSize: (id, size) =>
          set((state) => {
            if (state.widgets[id]) {
              state.widgets[id].size = size;
            }
          }, false, 'dashboard-layout/setWidgetSize'),

        // ================================================================
        // EDIT MODE ACTIONS
        // ================================================================
        toggleEditMode: () =>
          set((state) => {
            state.isEditMode = !state.isEditMode;
          }, false, 'dashboard-layout/toggleEditMode'),

        setEditMode: (isEditMode) =>
          set((state) => {
            state.isEditMode = isEditMode;
          }, false, 'dashboard-layout/setEditMode'),

        // ================================================================
        // RESET
        // ================================================================
        resetLayout: () =>
          set((state) => {
            state.widgets = DEFAULT_WIDGETS;
            state.isEditMode = false;
          }, false, 'dashboard-layout/resetLayout'),
      })),
      {
        name: 'moneymappr-dashboard-layout',
        // Persist all layout preferences
        partialize: (state) => ({
          widgets: state.widgets,
        }),
        // Version for detecting stale cache and rebuilding
        // Incremented to force cache reset and widget state rebuild
        version: 4,
        // Migrate from old format if needed and merge with defaults
        migrate: (persistedState: any, version: number) => {
          // Always merge persisted widgets with defaults to ensure all widgets exist
          const persistedWidgets = persistedState?.widgets || {};
          const mergedWidgets = {
            ...DEFAULT_WIDGETS,
            ...persistedWidgets,
          };

          // If version is old (less than 4), merge with defaults to fix any corruption and add new widgets
          if (version < 4) {
            return {
              ...initialState,
              widgets: mergedWidgets,
            };
          }

          return {
            ...persistedState,
            widgets: mergedWidgets,
          };
        },
      }
    ),
    {
      name: 'DashboardLayoutStore',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const dashboardLayoutSelectors = {
  widgets: (state: DashboardLayoutStore) => state.widgets,
  isEditMode: (state: DashboardLayoutStore) => state.isEditMode,

  // Get visible widgets sorted by order
  visibleWidgets: (state: DashboardLayoutStore) =>
    Object.values(state.widgets)
      .filter(w => w.visible)
      .sort((a, b) => a.order - b.order),

  // Get all widgets sorted by order
  allWidgets: (state: DashboardLayoutStore) =>
    Object.values(state.widgets)
      .sort((a, b) => a.order - b.order),

  // Check if a specific widget is visible
  isWidgetVisible: (state: DashboardLayoutStore, id: WidgetId) =>
    state.widgets[id]?.visible ?? false,
};
