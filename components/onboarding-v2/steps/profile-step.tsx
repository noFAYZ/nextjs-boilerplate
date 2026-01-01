'use client';

import { useEffect, useState } from 'react';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { useCurrentUser } from '@/lib/queries/use-auth-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input-group';
import { AlertCircle } from 'lucide-react';

interface ProfileStepProps {
  onboardingData: OnboardingV2Data;
  updateOnboardingData: (updates: Partial<OnboardingV2Data>) => void;
}

export function ProfileStep({ onboardingData, updateOnboardingData }: ProfileStepProps) {
  const setStepValid = useOnboardingUIStore((state) => state.setStepValid);
  const { data: user } = useCurrentUser();

  const profile = onboardingData.profile;
  const [formData, setFormData] = useState({
    firstName: profile.firstName || user?.firstName || '',
    lastName: profile.lastName || user?.lastName || '',
    occupation: profile.occupation || '',
    monthlyIncome: profile.monthlyIncome || undefined,
    dateOfBirth: profile.dateOfBirth || '',
  });

  // Validate form
  useEffect(() => {
    const isValid = !!(formData.firstName && formData.lastName);
    setStepValid(isValid);
  }, [formData, setStepValid]);

  // Save to parent
  const handleChange = (
    field: string,
    value: string | number | undefined | Date | null
  ) => {
    let finalValue = value;

    // Convert Date to ISO string
    if (value instanceof Date) {
      finalValue = value.toISOString().split('T')[0];
    }

    setFormData((prev) => ({
      ...prev,
      [field]: finalValue || '',
    }));

    updateOnboardingData({
      profile: {
        ...profile,
        [field]: finalValue || '',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Let&apos;s get to know you</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tell us about yourself so we can personalize your experience</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="John"
              required
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Doe"
              required
              className="text-sm"
            />
          </div>
        </div>

        {/* Occupation */}
        <div className="space-y-1.5">
          <Label htmlFor="occupation" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Occupation</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            placeholder="e.g., Software Engineer, Teacher"
            className="text-sm"
          />
        </div>

        {/* Monthly Income */}
        <div className="space-y-1.5">
          <Label htmlFor="monthlyIncome" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Monthly Income</Label>
          <CurrencyInput
            id="monthlyIncome"
            value={formData.monthlyIncome?.toString() || ''}
            onChange={(value) => handleChange('monthlyIncome', value ? parseFloat(value) : undefined)}
            placeholder="0.00"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">Helps us provide personalized insights</p>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date of Birth</Label>
          <DatePicker
            value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
            onChange={(date) => handleChange('dateOfBirth', date)}
            placeholder="Select your date of birth"
          />
        </div>
      </div>

      {/* Info box - Minimal design */}
      <div className="flex gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40">
        <AlertCircle className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Your personal information is encrypted and secure.
        </p>
      </div>
    </div>
  );
}
