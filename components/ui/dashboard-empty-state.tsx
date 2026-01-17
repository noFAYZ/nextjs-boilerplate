'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';

interface DashboardEmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
  icon?: React.ReactNode;
}

interface DashboardEmptyStateProps {
  /** Title of the empty state */
  title: string;

  /** Description/subtitle of the empty state */
  description: string;

  /** Icon to display - must be a React component from widget header */
  icon: React.ReactNode;

  /** Primary action button */
  primaryAction?: DashboardEmptyStateAction;

  /** Secondary action button */
  secondaryAction?: DashboardEmptyStateAction;

  /** Whether to show as a card (for widgets) */
  showCard?: boolean;

  /** Custom className for the container */
  className?: string;
}

/**
 * DashboardEmptyState Component
 *
 * Unified, accessible empty state for all dashboard widgets.
 * Provides consistent styling, spacing, and interaction patterns.
 * Uses actual widget icons from component headers for visual consistency.
 *
 * Best Practices:
 * - Semantic HTML with proper accessibility
 * - React.memo for performance (pure component)
 * - Type-safe props with TypeScript
 * - Flexible composition with actions
 * - Uniform heights across all contexts
 * - Real widget icons for consistency
 *
 * @example
 * // Widget empty state with header icon
 * <DashboardEmptyState
 *   title="No Accounts"
 *   description="Connect your bank accounts to get started"
 *   icon={<HeroiconsWallet16Solid className="h-6 w-6" />}
 *   height="h-[280px]"
 *   primaryAction={{
 *     label: "Connect Account",
 *     onClick: handleConnect
 *   }}
 * />
 */
export const DashboardEmptyState = React.memo(function DashboardEmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  showCard = true,
  className,
}: DashboardEmptyStateProps) {
  // Content structure
  const content = (
    <div
      className={cn(
        'flex items-center justify-center h-full px-4',
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="text-center space-y-3">
        {/* Icon Container */}
        <div
          className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="text-muted-foreground">
            {icon}
          </div>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground">
          {description}
        </p>

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                variant={primaryAction.variant || 'default'}
                size="xs"
                className="text-[11px]"
              >
                {primaryAction.icon && (
                  <span className="flex items-center justify-center h-4 w-4 mr-1">
                    {primaryAction.icon}
                  </span>
                )}
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || 'outline'}
                size="xs"
                className="text-[11px]"
              >
                {secondaryAction.icon && (
                  <span className="flex items-center justify-center h-4 w-4 mr-1">
                    {secondaryAction.icon}
                  </span>
                )}
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Wrap in Card if requested (for widgets)
  if (showCard) {
    return (
      <Card
        className={cn(
          'flex flex-col items-center justify-center',
          'bg-muted/20 border-border/60'
        )}
      >
        {content}
      </Card>
    );
  }

  // Return plain content (for inline use)
  return content;
});

DashboardEmptyState.displayName = 'DashboardEmptyState';

/**
 * Convenience components for common empty state scenarios
 * Pass your widget header icon to maintain visual consistency
 */

export const AccountsEmptyState = React.memo(function AccountsEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Accounts"
      description="Connect your bank accounts to see your financial overview"
      {...props}
    />
  );
});

AccountsEmptyState.displayName = 'AccountsEmptyState';

export const TransactionsEmptyState = React.memo(function TransactionsEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Transactions"
      description="Your transaction history will appear here once you connect accounts"
      {...props}
    />
  );
});

TransactionsEmptyState.displayName = 'TransactionsEmptyState';

export const CryptoEmptyState = React.memo(function CryptoEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Crypto Assets"
      description="Add cryptocurrency wallets to track your crypto portfolio"
      {...props}
    />
  );
});

CryptoEmptyState.displayName = 'CryptoEmptyState';

export const GoalsEmptyState = React.memo(function GoalsEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Goals"
      description="Create your first financial goal to start tracking progress"
      {...props}
    />
  );
});

GoalsEmptyState.displayName = 'GoalsEmptyState';

export const SubscriptionsEmptyState = React.memo(function SubscriptionsEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Subscriptions"
      description="Add subscription services to track recurring payments"
      {...props}
    />
  );
});

SubscriptionsEmptyState.displayName = 'SubscriptionsEmptyState';

export const BillsEmptyState = React.memo(function BillsEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Upcoming Bills"
      description="Bills will appear here once you set them up"
      {...props}
    />
  );
});

BillsEmptyState.displayName = 'BillsEmptyState';

export const ActivitiesEmptyState = React.memo(function ActivitiesEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Recent Activity"
      description="Recent account activity will appear here"
      {...props}
    />
  );
});

ActivitiesEmptyState.displayName = 'ActivitiesEmptyState';

export const TokensEmptyState = React.memo(function TokensEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Tokens Yet"
      description="Add crypto wallets to track your token allocation"
      {...props}
    />
  );
});

TokensEmptyState.displayName = 'TokensEmptyState';

export const BudgetsEmptyState = React.memo(function BudgetsEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Budgets Yet"
      description="Create a budget to start tracking your spending"
      {...props}
    />
  );
});

BudgetsEmptyState.displayName = 'BudgetsEmptyState';

export const NetworkDistributionEmptyState = React.memo(function NetworkDistributionEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Network Data"
      description="Add crypto wallets to see network distribution"
      {...props}
    />
  );
});

NetworkDistributionEmptyState.displayName = 'NetworkDistributionEmptyState';

export const MoneyFlowEmptyState = React.memo(function MoneyFlowEmptyState(
  props: Omit<DashboardEmptyStateProps, 'icon' | 'title' | 'description'> & {
    icon: React.ReactNode;
  }
) {
  return (
    <DashboardEmptyState
      title="No Money Flow"
      description="Connect accounts to visualize your money flow"
      {...props}
    />
  );
});

MoneyFlowEmptyState.displayName = 'MoneyFlowEmptyState';

/**
 * Type exports for convenience
 */
export type { DashboardEmptyStateProps, DashboardEmptyStateAction };
