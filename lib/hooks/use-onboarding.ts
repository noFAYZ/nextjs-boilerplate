'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingPreferences {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoals: string[];
  investmentTypes: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  monthlyIncome: string;
  profileInfo: {
    firstName: string;
    lastName: string;
    occupation: string;
    bio: string;
  };
  completedAt?: string;
}

export function useOnboarding() {
  const [preferences, setPreferences] = useState<OnboardingPreferences | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = () => {
    setIsLoading(true);
    try {
      const completed = localStorage.getItem('onboarding-completed') === 'true';
      const savedPrefs = localStorage.getItem('onboarding-preferences');
      
      setIsCompleted(completed);
      
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = (newPreferences: OnboardingPreferences) => {
    const prefsWithTimestamp = {
      ...newPreferences,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('onboarding-preferences', JSON.stringify(prefsWithTimestamp));
    localStorage.setItem('onboarding-completed', 'true');
    setPreferences(prefsWithTimestamp);
    setIsCompleted(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('onboarding-preferences');
    localStorage.removeItem('welcome-banner-dismissed');
    setIsCompleted(false);
    setPreferences(null);
  };

  const startOnboarding = () => {
    router.push('/onboarding');
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsCompleted(true);
  };

  return {
    preferences,
    isCompleted,
    isLoading,
    savePreferences,
    resetOnboarding,
    startOnboarding,
    skipOnboarding,
    reload: loadOnboardingData
  };
}

export type { OnboardingPreferences };