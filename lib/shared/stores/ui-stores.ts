/**
 * UI Stores Index
 *
 * PURPOSE: Central export for all UI-only Zustand stores
 * - Crypto UI Store: Filters, preferences, selections for crypto features
 * - Banking UI Store: Filters, preferences, selections for banking features
 *
 * IMPORTANT:
 * - These stores contain ONLY UI state (no server data)
 * - Server data comes from TanStack Query hooks (lib/queries/use-*-data.ts)
 * - Use these stores for: filters, view modes, modal states, selections
 * - Do NOT use these stores for: wallets, accounts, transactions, etc.
 */

// Feature-based UI stores
export { useCryptoUIStore, cryptoUISelectors } from '@/lib/features/crypto/stores';
export { useBankingUIStore, bankingUISelectors } from '@/lib/features/banking/stores';
export { useAccountsUIStore } from '@/lib/features/accounts/stores';
export { useTransactionsUIStore } from '@/lib/features/transactions/stores';
export { useSubscriptionUIStore, subscriptionUISelectors } from '@/lib/features/subscriptions/stores';
export { useBudgetUIStore } from '@/lib/features/budgets/stores';
export { useOrganizationUIStore, organizationUISelectors } from '@/lib/features/organization/stores';
export { useAuthStore, selectUser, selectSession, selectIsAuthenticated } from '@/lib/features/auth/stores';
export { useAccountGroupsStore } from '@/lib/features/accounts/stores';
export { useGoalsStore } from '@/lib/features/goals/stores';
export { useIntegrationsStore } from '@/lib/features/integrations/stores';

// Shared UI stores (remain in shared)
export { useDashboardLayoutStore, dashboardLayoutSelectors, WIDGET_SIZE_CONFIG, type WidgetSize, type WidgetId } from './dashboard-layout-ui-store';
export { useGlobalUIStore, globalUISelectors } from './global-ui-store';
