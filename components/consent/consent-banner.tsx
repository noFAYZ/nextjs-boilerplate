'use client';

import { useEffect, useState } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConsentManager } from '@/lib/hooks/useConsentManager';
import { ConsentPreferenceModal } from './consent-preference-modal';

/**
 * Consent Banner Component
 * Displays GDPR/privacy consent request to users
 * Shows only once until user makes a choice
 */
export function ConsentBanner() {
  const { consent, isLoaded, acceptAll, rejectAll } = useConsentManager();
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);

  // Show banner only if consent hasn't been given
  useEffect(() => {
    if (isLoaded && !consent.consentGiven) {
      setIsOpen(true);
    }
  }, [isLoaded, consent.consentGiven]);

  if (!isLoaded || !isOpen) {
    return null;
  }

  return (
    <>
      {/* Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Message */}
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Privacy & Analytics</h3>
              <p className="text-xs text-slate-400">
                We use analytics and marketing tools to improve your experience. You can accept all, reject all, or customize your preferences.{' '}
                <a
                  href="/privacy"
                  className="underline hover:text-slate-300 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferenceModal(true)}
                className="text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
                className="text-xs"
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="text-xs bg-blue-600 hover:bg-blue-700"
              >
                Accept All
              </Button>
            </div>

            {/* Close Button */}
            <button
              onClick={rejectAll}
              className="absolute top-2 right-2 sm:relative p-1 hover:bg-slate-800 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preference Modal */}
      {showPreferenceModal && (
        <ConsentPreferenceModal
          isOpen={showPreferenceModal}
          onClose={() => setShowPreferenceModal(false)}
        />
      )}

      {/* Backdrop */}
      {showPreferenceModal && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}
    </>
  );
}
