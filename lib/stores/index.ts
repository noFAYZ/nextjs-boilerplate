// Export all Zustand stores from a central location
export {
  useCryptoStore,
  selectFilteredWallets,
  selectTotalPortfolioValue,
  selectActiveRealtimeSyncCount,
} from './crypto-store';

export {
  useAccountGroupsStore,
  selectFilteredGroups,
  selectGroupById,
  selectGroupsWithCounts,
  selectTotalValue,
  selectIsLoading as selectAccountGroupsLoading,
  selectHasError as selectAccountGroupsError,
} from './account-groups-store';

export {
  useAuthStore,
  selectUser,
  selectSession,
  selectIsAuthenticated,
  selectIsLoading as selectAuthLoading,
  selectHasError as selectAuthError,
  selectAuthError as selectAuthErrorMessage,
  selectPreferences,
  selectIsInitialized,
  selectLastActivity,
  selectUserDisplayName,
  selectUserInitials,
} from './auth-store';

export {
  useIntegrationsStore,
  integrationsSelectors,
} from './integrations-store';

export {
  useBankingStore,
} from './banking-store';

export {
  useGoalsStore,
} from './goals-store';

export {
  useDashboardLayoutStore,
  dashboardLayoutSelectors,
} from './dashboard-layout-ui-store';

export {
  useOrganizationStore,
  organizationSelectors,
} from './organization-store';

export {
  useGlobalUIStore,
  globalUISelectors,
} from './global-ui-store';

export {
  useBudgetsV3UIStore,
  type BudgetsV3Tab,
  type AllocationStep,
  type TemplateType,
  type HybridView,
  type ChartType,
  type TimeRange,
  type ViewPreferences,
  type FilterState,
  type ModalState,
  type IncomeAllocationState,
  type ForecastingState,
  type BudgetsV3UIState,
} from './budgets-v3-ui-store';

// Re-export types for convenience
export type { CryptoWallet, PortfolioData, CryptoTransaction, CryptoNFT, DeFiPosition, SyncJobStatus, NetworkType, WalletType } from '../types/crypto';
export type { AccountGroup, AccountGroupHierarchy, CreateAccountGroupRequest, UpdateAccountGroupRequest, MoveAccountRequest, AccountGroupsQueryOptions, FinancialAccount } from '../types/account-groups';
export type { Integration, IntegrationProvider, ProviderConfig, IntegrationStatus, SyncStatus, SyncFrequency } from '../types/integrations';
export type { Goal, GoalType, GoalCategory, GoalPriority, GoalSourceType, GoalMilestone, GoalSnapshot, GoalAnalytics, CreateGoalRequest, UpdateGoalRequest, AddContributionRequest } from '../types/goals';