'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
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

      // Skip check if already on onboarding page
      if (pathname === '/onboarding') {
        setIsCheckingOnboarding(false);
        return;
      }

      // Skip check for auth pages
      if (pathname.startsWith('/auth/')) {
        setIsCheckingOnboarding(false);
        return;
      }

      try {
        // Check if onboarding has been completed
        const onboardingCompleted = localStorage.getItem('onboarding-completed');
        
        // You could also check this from your backend API
        // const response = await apiClient.get('/user/onboarding-status');
        // const { completed } = response.data;

        if (!onboardingCompleted && isAuthenticated) {
          // User hasn't completed onboarding, redirect them
          router.push('/onboarding');
          return;
        }

        // Check if user profile is incomplete (additional check)
        if (user && isAuthenticated) {
          const hasBasicProfile = user.name || user.firstName;
          
          if (!hasBasicProfile && !onboardingCompleted) {
            router.push('/onboarding');
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
  const { user, isAuthenticated } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setNeedsOnboarding(false);
      return;
    }

    const checkStatus = () => {
      const onboardingCompleted = localStorage.getItem('onboarding-completed');
      const hasBasicProfile = user?.name || user?.firstName;
      
      // User needs onboarding if they haven't completed it AND don't have basic profile
      const needs = !onboardingCompleted && !hasBasicProfile;
      setNeedsOnboarding(needs);
    };

    checkStatus();
  }, [user, isAuthenticated]);

  return {
    needsOnboarding,
    markOnboardingComplete: () => {
      localStorage.setItem('onboarding-completed', 'true');
      setNeedsOnboarding(false);
    },
    resetOnboarding: () => {
      localStorage.removeItem('onboarding-completed');
      setNeedsOnboarding(true);
    }
  };
}