import { useState, useEffect } from 'react';

export type ConsentType = 'analytics' | 'marketing' | 'necessary';

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  consentGiven: boolean;
}

const CONSENT_STORAGE_KEY = 'moneymappr_consent';
const CONSENT_VERSION = '1';

/**
 * Hook to manage user consent for analytics and marketing
 * Stores preferences in localStorage
 */
export function useConsentManager() {
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    consentGiven: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent);
        setConsent(parsed);
      } catch (error) {
        console.error('Failed to parse consent:', error);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save consent to localStorage
  const updateConsent = (newConsent: Partial<ConsentState>) => {
    const updated = { ...consent, ...newConsent, consentGiven: true };
    setConsent(updated);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
  };

  // Accept all
  const acceptAll = () => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  // Reject all (except necessary)
  const rejectAll = () => {
    updateConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  // Reset consent (for preference center)
  const resetConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      consentGiven: false,
    });
  };

  return {
    consent,
    isLoaded,
    updateConsent,
    acceptAll,
    rejectAll,
    resetConsent,
    hasAnalyticsConsent: consent.analytics,
    hasMarketingConsent: consent.marketing,
  };
}
