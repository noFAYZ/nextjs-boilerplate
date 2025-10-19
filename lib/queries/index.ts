/**
 * Unified Data Hooks Index
 *
 * PURPOSE: Central export for all TanStack Query data hooks
 * - Single source of truth for ALL server data fetching
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates and automatic cache invalidation built-in
 *
 * ARCHITECTURE:
 * ┌──────────────────────────────────────────────────────────┐
 * │                    COMPONENTS                             │
 * │  (use hooks from this file for ALL server data)          │
 * └─────────────────────┬────────────────────────────────────┘
 *                       │
 *                       ▼
 * ┌──────────────────────────────────────────────────────────┐
 * │              TANSTACK QUERY HOOKS                         │
 * │  • use-crypto-data.ts   (crypto wallets, portfolio)      │
 * │  • use-banking-data.ts  (bank accounts, transactions)    │
 * │  • use-auth-data.ts     (user profile, session)          │
 * └─────────────────────┬────────────────────────────────────┘
 *                       │
 *                       ▼
 * ┌──────────────────────────────────────────────────────────┐
 * │                  API SERVICES                             │
 * │  • crypto-api.ts    (HTTP requests to backend)           │
 * │  • banking-api.ts   (HTTP requests to backend)           │
 * │  • api-client.ts    (centralized fetch with auth)        │
 * └──────────────────────────────────────────────────────────┘
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
// CRYPTO DATA HOOKS
// ============================================================================

export {
  // Wallet Queries
  useCryptoWallets,
  useCryptoWallet,
  useSelectedCryptoWallet,

  // Portfolio Queries
  useCryptoPortfolio,

  // Transaction Queries
  useCryptoTransactions,
  useWalletTransactions,
  useSelectedWalletTransactions,

  // NFT Queries
  useCryptoNFTs,
  useWalletNFTs,

  // DeFi Queries
  useCryptoDeFi,
  useWalletDeFi,

  // Sync Queries
  useWalletSyncStatus,

  // Analytics Queries
  useCryptoAnalytics,

  // Wallet Mutations
  useCreateCryptoWallet,
  useUpdateCryptoWallet,
  useDeleteCryptoWallet,

  // Sync Mutations
  useSyncCryptoWallet,
  useSyncAllCryptoWallets,

  // Utilities
  useInvalidateCryptoCache,
  usePrefetchCryptoData,
} from './use-crypto-data';

// ============================================================================
// BANKING DATA HOOKS
// ============================================================================

export {
  // Account Queries
  useBankingAccounts,
  useBankingGroupedAccounts,
  useBankingAccount,
  useSelectedBankAccount,
  useBankAccountSummary,

  // Dashboard Queries
  useBankingOverview,
  useBankingDashboard,

  // Transaction Queries
  useBankingTransactions,
  useAccountTransactions,
  useSelectedAccountTransactions,

  // Enrollment Queries
  useBankingEnrollments,
  useBankingEnrollment,

  // Sync Queries
  useAccountSyncStatus,

  // Analytics Queries
  useTopSpendingCategories,
  useMonthlySpendingTrend,
  useAccountSpendingComparison,
  useSpendingByCategory,

  // Account Mutations
  useConnectBankAccount,
  useUpdateBankAccount,
  useDisconnectBankAccount,

  // Sync Mutations
  useSyncBankAccount,
  useSyncAllBankAccounts,
  useSyncAccountTransactions,

  // Enrollment Mutations
  useDeleteBankEnrollment,

  // Utilities
  useInvalidateBankingCache,
  usePrefetchBankingData,
} from './use-banking-data';

// ============================================================================
// AUTH DATA HOOKS
// ============================================================================

export {
  // User Queries
  useCurrentUser,
  useCurrentSession,
  useUserProfile,
  useUserStats,

  // Auth Mutations
  useUpdateUserProfile,
  useDeleteUserAccount,

  // Session Utilities
  useSessionStatus,
  useRefreshSession,

  // Utilities
  useInvalidateAuthCache,
  useAuthStatus,
} from './use-auth-data';

// ============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// ============================================================================

// These re-export the base query factories for advanced use cases
// Most components should use the hooks above instead

export {
  cryptoKeys,
  cryptoQueries,
  cryptoMutations,
  useInvalidateCryptoQueries,
} from './crypto-queries';

export {
  bankingKeys,
  bankingQueries,
  bankingMutations,
  useInvalidateBankingQueries,
} from './banking-queries';

export {
  integrationsKeys,
  integrationsQueries,
  integrationsMutations,
} from './integrations-queries';
