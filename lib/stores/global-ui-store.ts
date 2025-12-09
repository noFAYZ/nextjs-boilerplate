/**
 * Global UI Store
 *
 * PURPOSE: Manages global UI state across the app
 * - Add menu dialog, global modals, and shared UI states
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): modal states, global UI toggles
 * ❌ Server Data (TanStack Query): accounts, subscriptions, goals, crypto
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// STATE TYPES
// ============================================================================

interface GlobalUIState {
  // Add Menu Dialog
  isAddMenuOpen: boolean;
}

interface GlobalUIActions {
  // Add Menu Actions
  openAddMenu: () => void;
  closeAddMenu: () => void;
  toggleAddMenu: () => void;
}

type GlobalUIStore = GlobalUIState & GlobalUIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: GlobalUIState = {
  isAddMenuOpen: false,
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useGlobalUIStore = create<GlobalUIStore>()(
  devtools(
    immer((set) => ({
      ...initialState,

      // ================================================================
      // ADD MENU ACTIONS
      // ================================================================
      openAddMenu: () =>
        set((state) => {
          state.isAddMenuOpen = true;
        }, false, 'global-ui/openAddMenu'),

      closeAddMenu: () =>
        set((state) => {
          state.isAddMenuOpen = false;
        }, false, 'global-ui/closeAddMenu'),

      toggleAddMenu: () =>
        set((state) => {
          state.isAddMenuOpen = !state.isAddMenuOpen;
        }, false, 'global-ui/toggleAddMenu'),
    })),
    {
      name: 'GlobalUIStore',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const globalUISelectors = {
  isAddMenuOpen: (state: GlobalUIStore) => state.isAddMenuOpen,
};
