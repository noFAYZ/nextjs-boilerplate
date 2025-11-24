'use client';

import { useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useConsentManager, type ConsentState } from '@/lib/hooks/useConsentManager';
import { useState } from 'react';

interface ConsentPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Preference Modal Component
 * Allows users to granularly control consent preferences
 */
export function ConsentPreferenceModal({ isOpen, onClose }: ConsentPreferenceModalProps) {
  const { consent, updateConsent, acceptAll, rejectAll } = useConsentManager();
  const [preferences, setPreferences] = useState<ConsentState>(consent);

  useEffect(() => {
    setPreferences(consent);
  }, [consent]);

  const handleToggle = (type: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSave = () => {
    updateConsent(preferences);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <CardHeader className="relative">
          <CardTitle>Consent Preferences</CardTitle>
          <CardDescription>
            Manage your privacy and analytics preferences
          </CardDescription>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Necessary Cookies */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold cursor-default">
                  Necessary Cookies
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Essential for site functionality, security, and authentication. Always enabled.
                </p>
              </div>
              <div className="ml-4 mt-1">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5 rounded"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Analytics */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  Analytics
                  <Info className="w-4 h-4 text-slate-400" />
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Helps us understand how you use our app (Google Analytics 4, PostHog)
                </p>
              </div>
              <div className="ml-4 mt-1">
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={() => handleToggle('analytics')}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Marketing */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  Marketing
                  <Info className="w-4 h-4 text-slate-400" />
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Allows us to track conversions and optimize marketing campaigns
                </p>
              </div>
              <div className="ml-4 mt-1">
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={() => handleToggle('marketing')}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Privacy Policy Link */}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For more details, see our{' '}
            <a href="/privacy" className="underline hover:text-slate-700 dark:hover:text-slate-300">
              Privacy Policy
            </a>
          </p>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={rejectAll}
              className="flex-1"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              onClick={acceptAll}
              className="flex-1"
            >
              Accept All
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
