/**
 * Settings UI Store
 *
 * PURPOSE: UI state for settings page (NOT server data)
 * - Active section/tab
 * - Unsaved changes tracking
 * - Modal states
 * - Form validation states
 *
 * Server data (actual settings) is managed by TanStack Query hooks
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingsSection =
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'security'
  | 'banking'
  | 'crypto'
  | 'portfolio'
  | 'accessibility'
  | 'data'
  | 'advanced';

interface SettingsUIState {
  // Active Section
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;

  // Unsaved Changes
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // Modals
  isConfirmDialogOpen: boolean;
  confirmDialogData: {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null;
  openConfirmDialog: (data: {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  closeConfirmDialog: () => void;

  is2FAModalOpen: boolean;
  open2FAModal: () => void;
  close2FAModal: () => void;

  isExportModalOpen: boolean;
  openExportModal: () => void;
  closeExportModal: () => void;

  isDeleteAccountModalOpen: boolean;
  openDeleteAccountModal: () => void;
  closeDeleteAccountModal: () => void;

  // Search/Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Form States
  validationErrors: Record<string, string>;
  setValidationError: (field: string, error: string) => void;
  clearValidationError: (field: string) => void;
  clearAllValidationErrors: () => void;

  // Reset
  resetUIState: () => void;
}

const initialState = {
  activeSection: 'general' as SettingsSection,
  hasUnsavedChanges: false,
  isConfirmDialogOpen: false,
  confirmDialogData: null,
  is2FAModalOpen: false,
  isExportModalOpen: false,
  isDeleteAccountModalOpen: false,
  searchQuery: '',
  validationErrors: {},
};

export const useSettingsUIStore = create<SettingsUIState>()(
  persist(
    (set) => ({
      ...initialState,

      // Active Section
      setActiveSection: (section) => set({ activeSection: section }),

      // Unsaved Changes
      setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

      // Confirm Dialog
      openConfirmDialog: (data) =>
        set({
          isConfirmDialogOpen: true,
          confirmDialogData: {
            title: data.title,
            description: data.description,
            onConfirm: data.onConfirm,
            onCancel: data.onCancel || (() => {}),
          },
        }),
      closeConfirmDialog: () =>
        set({
          isConfirmDialogOpen: false,
          confirmDialogData: null,
        }),

      // 2FA Modal
      open2FAModal: () => set({ is2FAModalOpen: true }),
      close2FAModal: () => set({ is2FAModalOpen: false }),

      // Export Modal
      openExportModal: () => set({ isExportModalOpen: true }),
      closeExportModal: () => set({ isExportModalOpen: false }),

      // Delete Account Modal
      openDeleteAccountModal: () => set({ isDeleteAccountModalOpen: true }),
      closeDeleteAccountModal: () => set({ isDeleteAccountModalOpen: false }),

      // Search
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Validation
      setValidationError: (field, error) =>
        set((state) => ({
          validationErrors: { ...state.validationErrors, [field]: error },
        })),
      clearValidationError: (field) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [field]: _, ...rest } = state.validationErrors;
          return { validationErrors: rest };
        }),
      clearAllValidationErrors: () => set({ validationErrors: {} }),

      // Reset
      resetUIState: () => set(initialState),
    }),
    {
      name: 'settings-ui-storage',
      partialize: (state) => ({
        activeSection: state.activeSection,
      }),
    }
  )
);
