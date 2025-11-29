'use client';

import { useEffect, useState, useRef } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { usePlaidLinkToken, useAddPlaidAccount } from '@/lib/queries/plaid-queries';
import type { BankAccount } from '@/lib/types/banking';

export interface UsePlaidIntegrationProps {
  onSuccess?: (accounts: BankAccount[]) => void;
  onError?: (error: any) => void;
  onExit?: () => void;
  onPlaidOpen?: () => void;
  onPlaidClose?: (result: { success: boolean; accounts?: BankAccount[]; error?: any }) => void;
}

export interface PlaidIntegrationState {
  linkToken: string | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  open: () => void;
}

/**
 * Hook to handle Plaid Link integration
 * Manages link token fetching and account connection flow
 * Handles z-index issues with modals by increasing dialog z-index
 */
export function usePlaidIntegration({
  onSuccess,
  onError,
  onExit,
  onPlaidOpen,
  onPlaidClose,
}: UsePlaidIntegrationProps): PlaidIntegrationState {
  const [isOpen, setIsOpen] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const dialogRef = useRef<{ element: Element; original: string } | null>(null);
  const backdropRef = useRef<{ element: Element; original: string } | null>(null);
  const { data: linkToken, isLoading: isLoadingToken, error: tokenError } = usePlaidLinkToken();
  const { mutate: addPlaidAccount, isPending: isAddingAccount } = useAddPlaidAccount();

  // Plaid Link hook
  const { open, ready, error: plaidError } = usePlaidLink({
    token: linkToken || '',
    onSuccess: (publicToken) => {
      // Exchange public token for access token
      addPlaidAccount(publicToken, {
        onSuccess: (response) => {
          if (response.success) {
            setIsOpen(false);
            // Notify parent to reopen dialog with success
            onPlaidClose?.({
              success: true,
              accounts: response.data.accounts,
            });
            onSuccess?.(response.data.accounts);
          }
        },
        onError: (error) => {
          console.error('Plaid account addition error:', error);
          // Notify parent to reopen dialog with error
          onPlaidClose?.({
            success: false,
            error,
          });
          onError?.(error);
        },
      });
    },
    onExit: (error) => {
      // Clean up injected styles
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }

      setIsOpen(false);
      onExit?.();

      if (error) {
        console.error('Plaid Link error:', error);
        // Notify parent to reopen dialog with error
        onPlaidClose?.({
          success: false,
          error,
        });
        onError?.(error);
      }
    },
  });

  // Open Plaid Link when state changes
  useEffect(() => {
    if (isOpen && ready && linkToken) {
      // Notify parent to close dialog before opening Plaid
      onPlaidOpen?.();

      open();
      setIsOpen(false);
    }
  }, [isOpen, ready, linkToken, open, onPlaidOpen]);

  const handleOpen = () => {
    if (!linkToken) {
      onError?.({
        code: 'LINK_TOKEN_ERROR',
        error: 'Failed to get link token. Please try again.',
      });
      return;
    }

    setIsOpen(true);
  };

  const error = tokenError
    ? 'Failed to initialize Plaid. Please try again.'
    : plaidError?.error_message || null;

  const loading = isLoadingToken || isAddingAccount || !ready;

  return {
    linkToken: linkToken || null,
    loading,
    error,
    isReady: ready && !!linkToken && !loading,
    open: handleOpen,
  };
}
