'use client';

/**
 * Organization-Aware Data Hooks
 *
 * These hooks automatically inject the selected organization ID from the store
 * into all data queries, ensuring data is scoped to the current organization.
 *
 * Usage:
 * ```ts
 * // Instead of:
 * const { data: wallets } = useCryptoWallets();
 * const { data: accounts } = useBankingAccounts();
 *
 * // Use:
 * const { data: wallets } = useOrganizationCryptoWallets();
 * const { data: accounts } = useOrganizationBankingAccounts();
 * ```
 */

import {
  useCryptoWallets,
  useCryptoWallet,
  useSelectedCryptoWallet,
  useCryptoPortfolio,
  useCryptoTransactions,
  useWalletTransactions,
  useCryptoNFTs,
  useWalletNFTs,
  useCryptoDeFi,
  useWalletDeFi,
  useCreateCryptoWallet,
  useUpdateCryptoWallet,
  useDeleteCryptoWallet,
  useSyncCryptoWallet,
} from './use-crypto-data';
import {
  useBankingAccounts,
  useBankingAccount,
  useSelectedBankAccount,
  useBankingOverview,
  useBankingGroupedAccounts,
  useBankingTransactions,
  useAccountTransactions,
  useTopSpendingCategories,
  useMonthlySpendingTrend,
  useConnectBankAccount,
  useUpdateBankAccount,
  useDisconnectBankAccount,
  useSyncBankAccount,
} from './use-banking-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import type { PortfolioParams, TransactionParams, NFTParams } from '@/lib/types/crypto';

// ============================================================================
// ORGANIZATION ID SELECTOR
// ============================================================================

/**
 * Get the currently selected organization ID
 */
function useSelectedOrganizationId(): string | undefined | null {
  const orgId = useOrganizationUIStore((state) => state.selectedOrganizationId);
  if (orgId) {
    console.log('[useSelectedOrganizationId] Organization ID:', orgId);
  }
  return orgId;
}

// ============================================================================
// CRYPTO QUERIES - ORGANIZATION-AWARE
// ============================================================================

/**
 * Get all crypto wallets for the current organization
 */
export function useOrganizationCryptoWallets() {
  const orgId = useSelectedOrganizationId();
  return useCryptoWallets(orgId);
}

/**
 * Get a single crypto wallet by ID for the current organization
 */
export function useOrganizationCryptoWallet(walletId: string | null, timeRange?: string) {
  const orgId = useSelectedOrganizationId();
  return useCryptoWallet(walletId, timeRange, orgId);
}

/**
 * Get the currently selected wallet for the current organization
 */
export function useOrganizationSelectedCryptoWallet() {
  const orgId = useSelectedOrganizationId();
  return useSelectedCryptoWallet(orgId);
}

/**
 * Get portfolio overview for the current organization
 */
export function useOrganizationCryptoPortfolio(params?: PortfolioParams) {
  const orgId = useSelectedOrganizationId();
  return useCryptoPortfolio(params, orgId);
}

/**
 * Get crypto transactions for the current organization
 */
export function useOrganizationCryptoTransactions(params?: TransactionParams) {
  const orgId = useSelectedOrganizationId();
  return useCryptoTransactions(params, orgId);
}

/**
 * Get transactions for a specific wallet in the current organization
 */
export function useOrganizationWalletTransactions(walletId: string, params?: TransactionParams) {
  const orgId = useSelectedOrganizationId();
  return useWalletTransactions(walletId, params, orgId);
}

/**
 * Get NFTs for the current organization
 */
export function useOrganizationCryptoNFTs(params?: NFTParams) {
  const orgId = useSelectedOrganizationId();
  return useCryptoNFTs(params, orgId);
}

/**
 * Get NFTs for a specific wallet in the current organization
 */
export function useOrganizationWalletNFTs(walletId: string, params?: NFTParams) {
  const orgId = useSelectedOrganizationId();
  return useWalletNFTs(walletId, params, orgId);
}

/**
 * Get DeFi positions for the current organization
 */
export function useOrganizationCryptoDeFi() {
  const orgId = useSelectedOrganizationId();
  return useCryptoDeFi(orgId);
}

/**
 * Get DeFi positions for a specific wallet in the current organization
 */
export function useOrganizationWalletDeFi(walletId: string) {
  const orgId = useSelectedOrganizationId();
  return useWalletDeFi(walletId, orgId);
}

/**
 * Get wallet sync progress for the current organization
 */
export function useOrganizationWalletSyncProgress(walletId: string) {
  const orgId = useSelectedOrganizationId();
  return useWalletSyncProgress(walletId, orgId);
}

// ============================================================================
// CRYPTO MUTATIONS - ORGANIZATION-AWARE
// ============================================================================

/**
 * Create a crypto wallet in the current organization
 */
export function useOrganizationCreateCryptoWallet() {
  const orgId = useSelectedOrganizationId();
  return useCreateCryptoWallet(orgId);
}

/**
 * Update a crypto wallet in the current organization
 */
export function useOrganizationUpdateCryptoWallet(walletId?: string) {
  const orgId = useSelectedOrganizationId();
  return useUpdateCryptoWallet(walletId, orgId);
}

/**
 * Delete a crypto wallet in the current organization
 */
export function useOrganizationDeleteCryptoWallet(walletId?: string) {
  const orgId = useSelectedOrganizationId();
  return useDeleteCryptoWallet(walletId, orgId);
}

/**
 * Sync a crypto wallet in the current organization
 */
export function useOrganizationSyncCryptoWallet(walletId?: string) {
  const orgId = useSelectedOrganizationId();
  return useSyncCryptoWallet(walletId, orgId);
}

// ============================================================================
// BANKING QUERIES - ORGANIZATION-AWARE
// ============================================================================

/**
 * Get all banking accounts for the current organization
 */
export function useOrganizationBankingAccounts() {
  const orgId = useSelectedOrganizationId();
  return useBankingAccounts(orgId);
}

/**
 * Get a single banking account for the current organization
 */
export function useOrganizationBankingAccount(accountId: string | null) {
  const orgId = useSelectedOrganizationId();
  return useBankingAccount(accountId, orgId);
}

/**
 * Get the currently selected banking account for the current organization
 */
export function useOrganizationSelectedBankAccount() {
  const orgId = useSelectedOrganizationId();
  return useSelectedBankAccount(orgId);
}

/**
 * Get banking overview for the current organization
 */
export function useOrganizationBankingOverview() {
  const orgId = useSelectedOrganizationId();
  return useBankingOverview(orgId);
}

/**
 * Get grouped banking accounts for the current organization
 */
export function useOrganizationBankingGroupedAccounts() {
  const orgId = useSelectedOrganizationId();
  return useBankingGroupedAccounts(orgId);
}

/**
 * Get banking transactions for the current organization
 */
export function useOrganizationBankingTransactions(params?: TransactionParams) {
  const orgId = useSelectedOrganizationId();
  return useBankingTransactions(params, orgId);
}

/**
 * Get transactions for a specific account in the current organization
 */
export function useOrganizationAccountTransactions(accountId: string, params?: TransactionParams) {
  const orgId = useSelectedOrganizationId();
  return useAccountTransactions(accountId, params, orgId);
}

/**
 * Get top spending categories for the current organization
 */
export function useOrganizationTopSpendingCategories(params?: Record<string, unknown>) {
  const orgId = useSelectedOrganizationId();
  return useTopSpendingCategories(params, orgId);
}

/**
 * Get monthly spending trend for the current organization
 */
export function useOrganizationMonthlySpendingTrend(params?: Record<string, unknown>) {
  const orgId = useSelectedOrganizationId();
  return useMonthlySpendingTrend(params, orgId);
}

// ============================================================================
// BANKING MUTATIONS - ORGANIZATION-AWARE
// ============================================================================

/**
 * Connect a bank account to the current organization
 */
export function useOrganizationConnectBankAccount() {
  const orgId = useSelectedOrganizationId();
  return useConnectBankAccount(orgId);
}

/**
 * Update a banking account in the current organization
 */
export function useOrganizationUpdateBankAccount(accountId?: string) {
  const orgId = useSelectedOrganizationId();
  return useUpdateBankAccount(accountId, orgId);
}

/**
 * Disconnect a banking account from the current organization
 */
export function useOrganizationDisconnectBankAccount(accountId?: string) {
  const orgId = useSelectedOrganizationId();
  return useDisconnectBankAccount(accountId, orgId);
}

/**
 * Sync a banking account in the current organization
 */
export function useOrganizationSyncBankAccount(accountId?: string) {
  const orgId = useSelectedOrganizationId();
  return useSyncBankAccount(accountId, orgId);
}
