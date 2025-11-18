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

export type WidgetId =
  | 'net-worth'
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
  | 'money-flow';

export interface WidgetLayout {
  id: WidgetId;
  visible: boolean;
  order: number;
  width?: number; // custom width in pixels (optional)
}

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
  setWidgetSize: (id: WidgetId, width?: number) => void;

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
  'net-worth': { id: 'net-worth', visible: true, order: 0 },
  'monthly-spending': { id: 'monthly-spending', visible: true, order: 1 },
  'spending-categories': { id: 'spending-categories', visible: true, order: 2 },
  'crypto-allocation': { id: 'crypto-allocation', visible: true, order: 3 },
  'network-distribution': { id: 'network-distribution', visible: true, order: 4 },
  'account-comparison': { id: 'account-comparison', visible: true, order: 5 },
  'subscriptions': { id: 'subscriptions', visible: true, order: 6 },
  'calendar-subscriptions': { id: 'calendar-subscriptions', visible: true, order: 7 },
  'upcoming-bills': { id: 'upcoming-bills', visible: false, order: 8 },
  'recent-activity': { id: 'recent-activity', visible: false, order: 9 },
  'goals': { id: 'goals', visible: false, order: 10 },
  'money-flow': { id: 'money-flow', visible: false, order: 11 },
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

        setWidgetSize: (id, width) =>
          set((state) => {
            if (state.widgets[id]) {
              state.widgets[id].width = width;
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
