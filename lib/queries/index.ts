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
  useAggregatedCryptoWallet,

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
// PLAID DATA HOOKS
// ============================================================================

export {
  // Plaid Queries
  usePlaidLinkToken,

  // Plaid Mutations
  useAddPlaidAccount,
  useSyncPlaidAccounts,
  useSyncPlaidTransactions,
} from './plaid-queries';

// ============================================================================
// UNIFIED ACCOUNTS DATA HOOKS
// ============================================================================

export {
  // Account Queries
  useAllAccounts,
  useAccountDetails,

  // Category Queries
  useAccountsByCategory,
  useAccountsSummary,

  // Account Mutations
  useCreateManualAccount,
  useUpdateAccount,
  useDeleteAccount as useDeleteUnifiedAccount,
} from './use-accounts-data';

export {
  accountsKeys,
  accountsQueries,
  accountsMutations,
  useUnifiedAccounts,
} from './accounts-queries';

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
  useUploadProfilePicture,
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
  integrationsQueryKeys,
  useAvailableProviders,
  useProvidersHealth,
  useUserIntegrations,
  useIntegrationsSummary,
  useQuickBooksStatus,
  useQuickBooksCompany,
  useQuickBooksAccounts,
  useQuickBooksTransactions,
  useQuickBooksInvoices,
  useQuickBooksSyncStatus,
  useConnectQuickBooks,
  useDisconnectQuickBooks,
  useSyncQuickBooks,
  useConnectProvider,
  useDisconnectProvider,
  useSyncProvider,
  useRefreshAllIntegrations,
} from './integrations-queries';

// ============================================================================
// SETTINGS DATA HOOKS
// ============================================================================

export {
  // Settings Queries
  useUserSettings,
  useTrustedDevices,

  // Settings Mutations
  useUpdateSettings,
  useResetSettings,
  useExportData,
  useDeleteAccount,
  useEnable2FA,
  useVerify2FA,
  useDisable2FA,
  useRemoveTrustedDevice,
  useTestNotification,
  useClearCache,
  useDownloadAllData,
} from './use-settings-data';

export {
  settingsKeys,
  settingsQueries,
  settingsMutations,
  useInvalidateSettingsQueries,
} from './settings-queries';

// ============================================================================
// GOAL DATA HOOKS
// ============================================================================

export {
  // Goal Queries
  useGoals,
  useGoal,
  useGoalAnalytics,
  useActiveGoals,
  useOnTrackGoals,
  useUrgentGoals,

  // Goal Mutations
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useCalculateGoalProgress,
  useAddContribution,

  // Utilities
  useInvalidateGoalCache,
  useGoalSummary,
  goalKeys,
} from './use-goal-data';

// ============================================================================
// SUBSCRIPTION DATA HOOKS
// ============================================================================

export {
  // Subscription Queries
  useSubscriptions,
  useSubscription,
  useSelectedSubscription,
  useSubscriptionAnalytics,

  // Subscription Mutations
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
  useAddCharge,
  useDetectSubscriptions,

  // Utilities
  useInvalidateSubscriptionCache,
  usePrefetchSubscriptionData,
  useSubscriptionSummary,
} from './use-subscription-data';

export {
  subscriptionKeys,
  subscriptionQueries,
  subscriptionMutations,
} from './subscription-queries';

// ============================================================================
// BILLING SUBSCRIPTION DATA HOOKS (Plans, Current Billing, Usage)
// ============================================================================

export {
  // Plan Queries
  useSubscriptionPlans,
  useSubscriptionPlansComparison,

  // Current Subscription Queries
  useCurrentBillingSubscription,

  // History Queries
  useSubscriptionHistory,
  usePaymentHistory,

  // Usage Queries
  useUsageStats,
  useFeatureLimit,

  // Billing Mutations
  useCreateBillingSubscription,
  useUpgradeBillingSubscription,
  useCancelBillingSubscription,
  useRetryPayment,

  // Utilities
  useInvalidateBillingSubscriptionCache,
  usePrefetchBillingSubscriptionData,
  useCanAccessFeature,
  billingSubscriptionKeys,
} from './use-billing-subscription-data';

// ============================================================================
// NET WORTH DATA HOOKS
// ============================================================================

export {
  // Net Worth Queries
  useNetWorth,
  useNetWorthSummary,
  useNetWorthBreakdown,
  useNetWorthPerformance,
  useNetWorthHistory,

  // Asset Account Queries
  useAssetAccounts,
  useAssetAccount,
  useAssetValuations,

  // Asset Category Queries
  useAssetCategories,
  useAssetCategory,

  // Net Worth Goals
  useNetWorthGoals,

  // Asset Account Mutations
  useCreateAssetAccount,
  useUpdateAssetAccount,
  useDeleteAssetAccount,
  useCreateValuation,

  // Asset Category Mutations
  useCreateAssetCategory,
  useUpdateAssetCategory,
  useDeleteAssetCategory,
} from './use-networth-data';

export {
  networthKeys,
  networthQueries,
  networthMutations,
} from './networth-queries';

// ============================================================================
// ENVELOPE DATA HOOKS
// ============================================================================

export {
  // Envelope Queries
  useEnvelopes,
  useEnvelope,
  useEnvelopePeriodAnalytics,
  useEnvelopePeriodHistory,
  useEnvelopeAllocationHistory,
  useEnvelopeSpendingHistory,
  useAllocationRules,
  useEnvelopeRules,
  useAllocationRule,
  useAllEnvelopesWithStats,
  useEnvelopeQuickStats,
  useAvailableToAllocate,
  useDashboardSummary,

  // Envelope Mutations
  useCreateEnvelope,
  useUpdateEnvelope,
  useDeleteEnvelope,
  useAllocateToEnvelope,
  useRecordEnvelopeSpending,
  useCreateAllocationRule,
  useUpdateAllocationRule,
  useDeleteAllocationRule,
  useSplitSpending,
} from './use-envelope-data';

// ============================================================================
// BUDGET DATA HOOKS (Income Allocation, Forecasting, Analytics, etc.)
// ============================================================================

export {
  // Budget Queries
  useBudgets,
  useBudget,
  useBudgetAnalytics,
  useBudgetSummary,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
  useAddBudgetTransaction,
} from './use-budget-data';

export {
  budgetKeys,
  budgetQueries,
  budgetMutations,
} from './budget-queries';

export {
  // Income Allocation Queries & Mutations
  useIncomeAllocationSuggestions,
  useAllocateIncome,
  useIncomeAllocationHistory,
  useIncomeRecommendations,
  useRecordAllocationFeedback,
} from './use-income-allocation-data';

export {
  incomeAllocationKeys,
  incomeAllocationQueries,
  incomeAllocationMutations,
} from './income-allocation-queries';

export {
  // Budget Forecasting Queries & Mutations
  useEnvelopeForecast,
  useBudgetForecast,
  useSpendingInsights,
  useForecastSpending,
} from './use-budget-forecasting-data';

export {
  budgetForecastingKeys,
  budgetForecastingQueries,
  budgetForecastingMutations,
} from './budget-forecasting-queries';

export {
  // Category Matching Queries & Mutations
  useEnvelopeSuggestions,
  useCategorySuggestions,
  useMerchantMatches,
  useGetBulkSuggestions,
  useCreateCategoryMappingRule,
  useApplyMappingRules,
} from './use-category-matching-data';

export {
  categoryMatchingKeys,
  categoryMatchingQueries,
  categoryMatchingMutations,
} from './category-matching-queries';

export {
  // Budget Alerts Queries & Mutations
  usePendingAlerts,
  useAlertHistory,
  useProcessAlerts,
  useDismissAlert,
} from './use-budget-alerts-data';

export {
  budgetAlertsKeys,
  budgetAlertsQueries,
  budgetAlertsMutations,
} from './budget-alerts-queries';

export {
  // Budget Analytics Queries
  useDashboardMetrics,

  usePeriodComparison,
  useEnvelopeRanking,
  useSpendingVelocity,
  useFinancialHealthScore,
} from './use-budget-analytics-data';

export {
  budgetAnalyticsKeys,
  budgetAnalyticsQueries,
} from './budget-analytics-queries';

export {
  // Budget Reports Mutations & Utilities
  useGenerateEnvelopeReportCSV,
  useGenerateTransactionReportCSV,
  useGenerateAnalyticsReportJSON,
  useGenerateBudgetComparisonReport,
  useGenerateMonthlySummaryReport,
} from './use-budget-reports-data';

export {
  budgetReportsKeys,
  budgetReportsMutations,
  downloadBlob,
} from './budget-reports-queries';

export {
  // Budget Templates Queries & Mutations
  useBudgetTemplates,
  useBudgetTemplate,
  useApplyBudgetTemplate,
} from './use-budget-templates-data';

export {
  budgetTemplatesKeys,
  budgetTemplatesQueries,
  budgetTemplatesMutations,
} from './budget-templates-queries';
