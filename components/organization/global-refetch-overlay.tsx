'use client';

import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { LogoLoader } from '../icons';

/**
 * Global Organization Refetch Overlay
 *
 * Shows a full-screen overlay when switching organizations and refetching data.
 * Matches MoneyMappr's design language with smooth animations and gradient effects.
 */
export function GlobalRefetchOverlay() {
  const { isRefetching } = useOrganizationRefetchState();

  if (!isRefetching) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)',
        backdropFilter: 'blur(10px)',
      }}
      role="status"
      aria-live="polite"
      aria-label="Switching workspace"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orb 1 */}
        <div
          className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full opacity-10 animate-pulse"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          }}
        />
        {/* Gradient orb 2 */}
        <div
          className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full opacity-10 animate-pulse animation-delay-700"
          style={{
            background: 'radial-gradient(circle, hsl(var(--chart-accent)) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-6 text-center">
      
        <LogoLoader className='w-20 h-20' />

        {/* Text Content */}
        <div className="space-y-3">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Switching Workspace
          </h2>
          <p
            className="text-sm font-medium"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            Loading your organization data
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pt-2">
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                animationDelay: '0ms',
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                animationDelay: '150ms',
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                animationDelay: '300ms',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
