'use client';

import { useEffect, useState } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConsentManager } from '@/lib/hooks/useConsentManager';
import { ConsentPreferenceModal } from './consent-preference-modal';

/**
 * Consent Popup Component
 * Displays GDPR/privacy consent request in bottom right corner
 * Shows only once until user makes a choice
 */
export function ConsentBanner() {
  const { consent, isLoaded, acceptAll, rejectAll } = useConsentManager();
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);

  // Show popup only if consent hasn't been given
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
      {/* Consent Popup - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                Privacy & Analytics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                We use analytics to improve your experience
              </p>
            </div>
            <button
              onClick={() => {
                rejectAll();
                setIsOpen(false);
              }}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We use Google Analytics, GTM, and PostHog to understand how you use our app.{' '}
              <a
                href="/privacy"
                className="font-medium underline hover:opacity-75 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreferenceModal(true)}
              className="flex-1 text-xs h-8"
            >
              <Settings className="w-3 h-3 mr-1" />
              Customize
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                rejectAll();
                setIsOpen(false);
              }}
              className="flex-1 text-xs h-8"
            >
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => {
                acceptAll();
                setIsOpen(false);
              }}
              className="flex-1 text-xs h-8"
            >
              Accept
            </Button>
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
