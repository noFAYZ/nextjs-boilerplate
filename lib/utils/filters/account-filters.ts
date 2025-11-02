/**
 * Account Filtering Utilities
 * Centralized filtering logic for crypto wallets and bank accounts
 */

import type { CryptoWallet } from '@/lib/types/crypto';
import type { BankAccount } from '@/lib/types/banking';

export interface CryptoFilters {
  networks?: string[];
  walletTypes?: string[];
  searchQuery?: string;
  minBalance?: number;
}

export interface BankFilters {
  accountTypes?: string[];
  institutions?: string[];
  searchQuery?: string;
  minBalance?: number;
}

/**
 * Filter crypto wallets based on multiple criteria
 */
export function filterCryptoWallets(
  wallets: CryptoWallet[],
  filters: CryptoFilters
): CryptoWallet[] {
  return wallets.filter((wallet) => {
    // Network filter - only apply if networks array has values
    if (filters.networks && filters.networks.length > 0) {
      if (!filters.networks.includes(wallet.network)) {
        return false;
      }
    }

    // Wallet type filter - only apply if walletTypes array has values
    if (filters.walletTypes && filters.walletTypes.length > 0) {
      if (!filters.walletTypes.includes(wallet.type)) {
        return false;
      }
    }

    // Minimum balance filter (dust filter)
    if (filters.minBalance !== undefined && filters.minBalance !== null) {
      const balance = parseFloat(String(wallet.totalBalanceUsd || '0'));
      if (isNaN(balance) || balance < filters.minBalance) {
        return false;
      }
    }

    // Search filter - only apply if searchQuery is not empty
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const nameMatch = wallet.name?.toLowerCase().includes(query) || false;
      const addressMatch = wallet.address?.toLowerCase().includes(query) || false;
      const networkMatch = wallet.network?.toLowerCase().includes(query) || false;

      if (!nameMatch && !addressMatch && !networkMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter bank accounts based on multiple criteria
 */
export function filterBankAccounts(
  accounts: BankAccount[],
  filters: BankFilters
): BankAccount[] {
  return accounts.filter((account) => {
    // Account type filter
    if (filters.accountTypes?.length && !filters.accountTypes.includes(account.type)) {
      return false;
    }

    // Institution filter
    if (filters.institutions?.length && !filters.institutions.includes(account.institutionName)) {
      return false;
    }

    // Minimum balance filter
    if (filters.minBalance !== undefined) {
      const balance = parseFloat(String(account.balance));
      if (balance < filters.minBalance) {
        return false;
      }
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        account.name.toLowerCase().includes(query) ||
        account.institutionName.toLowerCase().includes(query) ||
        account.accountNumber.toLowerCase().includes(query)
      );
    }

    return true;
  });
}

/**
 * Apply dust threshold filter to crypto wallets
 */
export function filterDustAssets(
  wallets: CryptoWallet[],
  threshold: number,
  hideDust: boolean
): CryptoWallet[] {
  if (!hideDust) {
    return wallets;
  }

  return wallets.filter((wallet) => {
    const balance = parseFloat(String(wallet.totalBalanceUsd || '0'));
    return !isNaN(balance) && balance >= threshold;
  });
}
