/**
 * Waitlist Data Hooks
 *
 * PURPOSE: Production-grade hooks for waitlist management
 * - Email collection for Resend.com audience
 * - TanStack Query for mutations with proper error handling
 * - No direct API calls in components
 *
 * USAGE:
 * ```ts
 * const { mutate: joinWaitlist, isPending } = useJoinWaitlist();
 *
 * joinWaitlist(
 *   { email: 'user@example.com', firstName: 'John', lastName: 'Doe' },
 *   {
 *     onSuccess: () => toast.success('Successfully joined!'),
 *     onError: (error) => toast.error(error.message),
 *   }
 * );
 * ```
 */

import { useMutation } from '@tanstack/react-query';

// ============================================================================
// TYPES
// ============================================================================

export interface WaitlistData {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface WaitlistResponse {
  success: boolean;
  data?: {
    contactId: string;
    message: string;
  };
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function joinWaitlistAPI(data: WaitlistData): Promise<WaitlistResponse> {
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // Extract error message from response
    const errorMessage = result.error?.message || 'Failed to join waitlist';
    throw new Error(errorMessage);
  }

  return result;
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Join the waitlist
 * Adds contact to Resend.com audience with automatic error handling
 */
export function useJoinWaitlist() {
  return useMutation({
    mutationFn: joinWaitlistAPI,
    retry: false, // Don't retry on failure (prevents duplicate submissions)
    onError: (error: Error) => {
      console.error('Failed to join waitlist:', error);
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Check waitlist API health status
 * Useful for debugging configuration issues
 */
export async function checkWaitlistHealth(): Promise<{
  status: 'operational' | 'misconfigured';
  service: string;
  timestamp: string;
}> {
  const response = await fetch('/api/waitlist');
  return response.json();
}
