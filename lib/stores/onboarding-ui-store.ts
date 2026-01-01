'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface OnboardingUIState {
  currentStep: number;
  isStepValid: boolean;
  isLoading: boolean;
}

interface OnboardingUIActions {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setStepValid: (valid: boolean) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const TOTAL_STEPS = 7; // 0 (welcome) to 6 (accounts)

export const useOnboardingUIStore = create<OnboardingUIState & OnboardingUIActions>()(
  devtools(
    immer((set) => ({
      // State
      currentStep: 0,
      isStepValid: false,
      isLoading: false,

      // Actions
      nextStep: () =>
        set((state) => {
          if (state.currentStep < TOTAL_STEPS - 1) {
            state.currentStep += 1;
            state.isStepValid = false;
          }
        }),

      prevStep: () =>
        set((state) => {
          if (state.currentStep > 0) {
            state.currentStep -= 1;
          }
        }),

      goToStep: (step) =>
        set((state) => {
          if (step >= 0 && step < TOTAL_STEPS) {
            state.currentStep = step;
          }
        }),

      setStepValid: (valid) =>
        set((state) => {
          state.isStepValid = valid;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      reset: () =>
        set({
          currentStep: 0,
          isStepValid: false,
          isLoading: false,
        }),
    })),
    { name: 'onboarding-ui-store' }
  )
);
