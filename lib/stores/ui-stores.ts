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

export { useCryptoUIStore, cryptoUISelectors } from './crypto-ui-store';
export { useBankingUIStore, bankingUISelectors } from './banking-ui-store';
export { useSubscriptionUIStore, subscriptionUISelectors } from './subscription-ui-store';
export { useBudgetUIStore } from './budget-ui-store';
export { useDashboardLayoutStore, dashboardLayoutSelectors, WIDGET_SIZE_CONFIG, type WidgetSize, type WidgetId } from './dashboard-layout-ui-store';
export { useOrganizationUIStore, organizationUISelectors } from './organization-ui-store';

// Re-export auth store (unchanged - it manages session, not UI)
export { useAuthStore, selectUser, selectSession, selectIsAuthenticated } from './auth-store';

// Re-export other utility stores
export { useAccountGroupsStore } from './account-groups-store';
export { useGoalsStore } from './goals-store';
export { useIntegrationsStore } from './integrations-store';
