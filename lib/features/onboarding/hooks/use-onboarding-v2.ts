import { useEffect, useState } from 'react';

export interface OnboardingV2Data {
  currentStep: number;
  completedSteps: number[];

  profile: {
    firstName: string;
    lastName: string;
    occupation?: string;
    monthlyIncome?: number;
    dateOfBirth?: string;
  };

  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  primaryGoals: string[];
  budgetTemplate?: 'zero-based' | 'envelope' | '50-30-20' | 'custom';
  categoryTemplateId?: string;

  lastUpdated: string;
}

const STORAGE_KEY = 'onboarding-v2-data';
const COMPLETED_KEY = 'onboarding-v2-completed';
const SKIPPED_KEY = 'onboarding-v2-skipped';

export function useOnboardingV2Storage() {
  const [isLoading, setIsLoading] = useState(true);

  // Get data from localStorage
  const getData = (): OnboardingV2Data | null => {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  // Save data to localStorage
  const saveData = (data: Partial<OnboardingV2Data>) => {
    if (typeof window === 'undefined') return;

    const existing = getData() || getDefaultData();
    const updated = {
      ...existing,
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Mark onboarding as completed
  const markCompleted = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COMPLETED_KEY, 'true');
    localStorage.setItem('onboarding-just-completed', 'true');
  };

  // Mark onboarding as skipped
  const markSkipped = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SKIPPED_KEY, 'true');
  };

  // Check if onboarding is completed
  const isCompleted = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(COMPLETED_KEY) === 'true';
  };

  // Check if onboarding is skipped
  const isSkipped = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SKIPPED_KEY) === 'true';
  };

  // Clear all onboarding data
  const clearAll = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COMPLETED_KEY);
    localStorage.removeItem(SKIPPED_KEY);
  };

  // Initialize on mount (check for SSR safety)
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    getData,
    saveData,
    markCompleted,
    markSkipped,
    isCompleted,
    isSkipped,
    clearAll,
  };
}

// Default data structure
export function getDefaultData(): OnboardingV2Data {
  return {
    currentStep: 0,
    completedSteps: [],
    profile: {
      firstName: '',
      lastName: '',
    },
    primaryGoals: [],
    lastUpdated: new Date().toISOString(),
  };
}
