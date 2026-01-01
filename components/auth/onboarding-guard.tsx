'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, selectUser, selectIsAuthenticated, selectAuthLoading } from '@/lib/stores';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const authLoading = useAuthStore(selectAuthLoading);
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Skip check if still loading auth or not authenticated
      if (authLoading || !isAuthenticated) {
        setIsCheckingOnboarding(false);
        return;
      }

      // Skip check if already on onboarding-v2 page
      if (pathname === '/onboarding-v2') {
        setIsCheckingOnboarding(false);
        return;
      }

      // Skip check for auth pages
      if (pathname.startsWith('/auth/')) {
        setIsCheckingOnboarding(false);
        return;
      }

      try {
        // Check if onboarding v2 has been completed or skipped
        const onboardingCompleted = localStorage.getItem('onboarding-v2-completed');
        const onboardingSkipped = localStorage.getItem('onboarding-v2-skipped');

        // You could also check this from your backend API
        // const response = await apiClient.get('/user/onboarding-status');
        // const { completed } = response.data;

        // Allow access if user has completed OR skipped onboarding
        if (!onboardingCompleted && !onboardingSkipped && isAuthenticated) {
          // User hasn't completed or skipped onboarding v2, redirect them
          router.push('/onboarding-v2');
          return;
        }

        // Check if user profile is incomplete (additional check)
        if (user && isAuthenticated) {
          const hasBasicProfile = user.name || user.firstName;

          // Only redirect if they haven't completed AND haven't skipped AND don't have profile
          if (!hasBasicProfile && !onboardingCompleted && !onboardingSkipped) {
            router.push('/onboarding-v2');
            return;
          }
        }

        setIsCheckingOnboarding(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user, isAuthenticated, authLoading, pathname, router]);

  // Show loading spinner while checking auth or onboarding status
  if (authLoading || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook to check if user needs onboarding
export function useOnboardingStatus() {
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setNeedsOnboarding(false);
      return;
    }

    const checkStatus = () => {
      const onboardingCompleted = localStorage.getItem('onboarding-v2-completed');
      const onboardingSkipped = localStorage.getItem('onboarding-v2-skipped');
      const hasBasicProfile = user?.name || user?.firstName;

      // User needs onboarding if they haven't completed it AND haven't skipped AND don't have basic profile
      const needs = !onboardingCompleted && !onboardingSkipped && !hasBasicProfile;
      setNeedsOnboarding(needs);
    };

    checkStatus();
  }, [user, isAuthenticated]);

  return {
    needsOnboarding,
    markOnboardingComplete: () => {
      localStorage.setItem('onboarding-v2-completed', 'true');
      setNeedsOnboarding(false);
    },
    resetOnboarding: () => {
      localStorage.removeItem('onboarding-v2-completed');
      setNeedsOnboarding(true);
    }
  };
}