/**
 * Unified Data Hooks Index
 *
 * PURPOSE: Central export for all TanStack Query data hooks
 * - Single source of truth for ALL server data fetching
 * - Organized by domain for better discoverability
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates and automatic cache invalidation built-in
 *
 * DOMAIN ORGANIZATION:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ CRYPTO        - Wallets, portfolio, transactions, NFTs, DeFi    │
 * │ BANKING       - Accounts, connections, transactions             │
 * │ AUTH          - User profile, session, authentication            │
 * │ BUDGETS       - Budgets, envelopes, forecasting, analytics      │
 * │ ACCOUNTS      - Unified account management                       │
 * │ TRANSACTIONS  - Transaction data, categorization rules           │
 * │ CATEGORIES    - Custom categories, groups, envelope types       │
 * │ SUBSCRIPTIONS - User subscriptions, billing, payments            │
 * │ ASSETS        - Net worth, goals, payment methods               │
 * │ SETTINGS      - User settings and preferences                    │
 * │ ORGANIZATION  - Multi-tenant organization data                   │
 * │ INTEGRATIONS  - Plaid, QuickBooks, external integrations       │
 * │ UTILITIES     - Currency, waitlist, misc utilities              │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * USAGE EXAMPLE:
 * ```tsx
 * import { useCryptoWallets, useCreateCryptoWallet } from '@/lib/queries';
 * import { useCryptoUIStore } from '@/lib/stores/ui-stores';
 *
 * function WalletList() {
 *   // ✅ Server data from TanStack Query
 *   const { data: wallets, isLoading } = useCryptoWallets();
 *
 *   // ✅ UI state from Zustand
 *   const { filters } = useCryptoUIStore();
 *
 *   // ✅ Mutations with automatic cache updates
 *   const { mutate: createWallet } = useCreateCryptoWallet();
 *
 *   // ...
 * }
 * ```
 */

// ============================================================================
// QUERY HELPER UTILITIES
// ============================================================================
export * from './query-helpers';

// ============================================================================
// CRYPTO DOMAIN (wallets, portfolio, transactions, NFTs, DeFi)
// ============================================================================
export * from './use-crypto-data';

// ============================================================================
// BANKING DOMAIN (accounts, connections, transactions)
// ============================================================================
export * from './use-banking-data';

// ============================================================================
// AUTHENTICATION DOMAIN (user profile, session)
// ============================================================================
export * from './use-auth-data';

// ============================================================================
// BUDGET DOMAIN (budgets, envelopes, forecasting, analytics)
// ============================================================================
export * from './budgets';

// ============================================================================
// ACCOUNTS DOMAIN (unified account management)
// ============================================================================
export * from './use-accounts-data';

// ============================================================================
// TRANSACTIONS DOMAIN (transaction data)
// ============================================================================
export * from './use-transactions-data';

// ============================================================================
// CATEGORIES DOMAIN (custom categories, groups, envelope types)
// ============================================================================
export * from './categories';

// ============================================================================
// SUBSCRIPTIONS DOMAIN (user subscriptions, billing)
// ============================================================================
export * from './use-subscription-data';
export * from './use-billing-subscription-data';

// ============================================================================
// ASSETS DOMAIN (net worth, goals, payment methods)
// ============================================================================
export * from './use-networth-data';
export * from './use-goal-data';
export * from './use-payment-method-data';

// ============================================================================
// SETTINGS DOMAIN (user settings & preferences)
// ============================================================================
export * from './use-settings-data';

// ============================================================================
// ORGANIZATION DOMAIN (multi-tenant organization data)
// ============================================================================
export * from './organization';

// ============================================================================
// INTEGRATIONS DOMAIN (Plaid, QuickBooks, etc)
// ============================================================================
export * from './plaid-queries';
export * from './integrations-queries';

// ============================================================================
// UTILITIES DOMAIN (currency, waitlist, misc utilities)
// ============================================================================
export * from './use-currency-data';
export * from './use-waitlist-data';
