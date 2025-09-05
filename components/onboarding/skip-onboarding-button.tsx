'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SkipOnboardingButtonProps {
  className?: string;
}

export function SkipOnboardingButton({ className }: SkipOnboardingButtonProps) {
  const router = useRouter();
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSkip = async () => {
    // Simple confirmation
    const confirmed = window.confirm(
      "Skip onboarding? You can always complete it later from your settings.\n\nSkipping means you'll miss personalized recommendations and interface customization."
    );
    
    if (!confirmed) return;
    
    setIsSkipping(true);
    
    try {
      // Mark onboarding as completed but skipped
      localStorage.setItem('onboarding-completed', 'true');
      localStorage.setItem('onboarding-skipped', 'true');
      
      // Set default preferences for skipped users
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
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      setIsSkipping(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSkip}
      className={className}
      disabled={isSkipping}
    >
      <X className="h-4 w-4 mr-2" />
      {isSkipping ? 'Skipping...' : 'Skip for now'}
    </Button>
  );
}