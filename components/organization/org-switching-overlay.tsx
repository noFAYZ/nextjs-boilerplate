'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedLogoLoader } from '../ui/animated-logo-loader';
import type { Organization } from '@/lib/types/organization';

interface OrgSwitchingOverlayProps {
  isOpen: boolean;
  organization: Organization | null;
  isError?: boolean;
  errorMessage?: string;
  onDismiss?: () => void;
}

/**
 * OrgSwitchingOverlay Component
 *
 * Displays a modal overlay with animated logo loader during organization switching.
 * Features smooth CSS animations, error states, and accessibility support.
 *
 * Uses AnimatedLogoLoader for consistent, performant loading feedback.
 */
export function OrgSwitchingOverlay({
  isOpen,
  organization,
  isError = false,
  errorMessage,
  onDismiss,
}: OrgSwitchingOverlayProps) {
  if (!isOpen || !organization) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-60 flex items-center justify-center',
        'bg-black/40 backdrop-blur-sm',
        'animate-in fade-in-0 duration-200',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      role="presentation"
    >
      <div
        className={cn(
          'bg-background rounded-lg shadow-lg p-7 flex flex-col items-center gap-5',
          'max-w-md w-full mx-4',
          'animate-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out'
        )}
      >
        {/* Organization Avatar - Staggered Animation */}
        <div
          className={cn(
            'h-12 w-12 rounded-lg flex items-center justify-center font-semibold text-lg',
            'animate-in fade-in-0 slide-in-from-bottom-2 duration-300'
          )}
          style={{ animationDelay: '0ms' }}
        >
          <div
            className={cn(
              'h-full w-full rounded-full flex items-center text-lg justify-center',
              isError
                ? 'bg-destructive/10 text-destructive'
                : 'bg-secondary text-primary'
            )}
          >
            {organization.icon ?? organization.name[0]?.toUpperCase()}
          </div>
        </div>

        {/* Status Content - Staggered Animation */}
        {isError ? (
          <div
            className="text-center space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: '100ms' }}
          >
            <h3 className="font-semibold text-foreground text-sm">
              Failed to Switch
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {errorMessage || 'An error occurred while switching organizations. Please try again.'}
            </p>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-md',
                  'bg-primary/10 hover:bg-primary/20 text-primary',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                )}
              >
                Dismiss
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className="text-center space-y-1 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: '100ms' }}
            >
              <h3 className="font-semibold text-foreground text-sm">
                Switching to {organization.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Loading your data and preferences...
              </p>
            </div>

            {/* Animated Logo Loader - Staggered Animation */}
            <div
              className="animate-in fade-in-0 zoom-in-95 duration-300"
              style={{ animationDelay: '200ms' }}
            >
              <AnimatedLogoLoader
                size="md"
                className="mt-2"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
