// Export all Zustand stores from a central location
export { 
  useCryptoStore,
  selectFilteredWallets,
  selectTotalPortfolioValue,
  selectActiveSyncCount,
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

// Re-export types for convenience
export type { CryptoWallet, PortfolioData, CryptoTransaction, CryptoNFT, DeFiPosition, SyncJobStatus, NetworkType, WalletType } from '../types/crypto';
export type { AccountGroup, AccountGroupHierarchy, CreateAccountGroupRequest, UpdateAccountGroupRequest, MoveAccountRequest, AccountGroupsQueryOptions, FinancialAccount } from '../types/account-groups';