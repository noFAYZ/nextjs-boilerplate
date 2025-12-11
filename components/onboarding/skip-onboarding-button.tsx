'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SkipForward } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SkipOnboardingButtonProps {
  className?: string;
}

export function SkipOnboardingButton({ className }: SkipOnboardingButtonProps) {
  const router = useRouter();
  const [isSkipping, setIsSkipping] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSkip = async () => {
    setIsSkipping(true);

    try {
      localStorage.setItem('onboarding-completed', 'true');
      localStorage.setItem('onboarding-skipped', 'true');

      const defaultPreferences = {
        experienceLevel: 'intermediate',
        primaryGoals: [],
        investmentTypes: [],
        riskTolerance: 'moderate',
        monthlyIncome: '',
        profileInfo: {
          firstName: '',
          lastName: '',
          occupation: '',
          bio: ''
        },
        skipped: true,
        completedAt: new Date().toISOString()
      };

      localStorage.setItem('onboarding-preferences', JSON.stringify(defaultPreferences));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      setIsSkipping(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDialog(true)}
        className={className}
        disabled={isSkipping}
      >
        {isSkipping ? 'Skipping...' : 'Skip'}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip onboarding?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>You&apos;ll miss personalized recommendations and customizations.</p>
              <p className="text-xs">You can complete this later from settings.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Setup</AlertDialogCancel>
            <AlertDialogAction onClick={handleSkip}>
              Skip Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
