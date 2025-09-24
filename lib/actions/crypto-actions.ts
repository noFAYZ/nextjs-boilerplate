'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getSession } from '@/lib/auth-client';
import prisma from '@/lib/prisma';
import { FrontendCryptoService } from '@/docs/services/cryptoService';
import type {
  CryptoWalletRequest,
  UpdateWalletRequest,
  CryptoTransactionFilters,
  NFTFilters,
  DeFiPositionFilters,
  PaginationOptions
} from '@/docs/types/crypto';
import { z } from 'zod';

// Initialize the service
const cryptoService = new FrontendCryptoService(prisma);

// Validation schemas
const createWalletSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  network: z.enum(['ETHEREUM', 'POLYGON', 'BSC', 'ARBITRUM', 'OPTIMISM', 'AVALANCHE', 'BASE', 'FANTOM', 'CRONOS', 'GNOSIS', 'AURORA', 'CELO', 'MOONBEAM', 'KAVA']),
  type: z.enum(['HOT_WALLET', 'COLD_WALLET', 'EXCHANGE', 'MULTI_SIG', 'SMART_CONTRACT']).optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

const updateWalletSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  isWatching: z.boolean().optional(),
  sortOrder: z.number().min(0).max(999).optional(),
});

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return session.user.id;
}

// ===============================
// WALLET ACTIONS
// ===============================

/**
 * Get all user wallets
 */
export async function getUserWallets() {
  try {
    const userId = await getAuthenticatedUser();
    const wallets = await cryptoService.getUserWallets(userId);

    return {
      success: true,
      data: wallets,
    };
  } catch (error) {
    console.error('Error fetching wallets:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wallets',
    };
  }
}

/**
 * Get single wallet with portfolio data
 */
export async function getWalletPortfolio(walletId: string) {
  try {
    const userId = await getAuthenticatedUser();
    const portfolio = await cryptoService.getWalletPortfolio(userId, walletId);

    return {
      success: true,
      data: portfolio,
    };
  } catch (error) {
    console.error('Error fetching wallet portfolio:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wallet portfolio',
    };
  }
}

/**
 * Get aggregated portfolio across all user wallets
 */
export async function getAggregatedPortfolio() {
  try {
    const userId = await getAuthenticatedUser();
    const portfolio = await cryptoService.getAggregatedPortfolio(userId);

    return {
      success: true,
      data: portfolio,
    };
  } catch (error) {
    console.error('Error fetching aggregated portfolio:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch portfolio',
    };
  }
}

/**
 * Create a new wallet
 */
export async function createWallet(data: CryptoWalletRequest) {
  try {
    const userId = await getAuthenticatedUser();

    // Validate input
    const validatedData = createWalletSchema.parse(data);

    // Create wallet
    const wallet = await cryptoService.addWallet(userId, validatedData as CryptoWalletRequest);

    // Revalidate related data
    revalidateTag('crypto-wallets');
    revalidateTag('crypto-portfolio');
    revalidatePath('/dashboard/crypto');

    return {
      success: true,
      data: wallet,
    };
  } catch (error) {
    console.error('Error creating wallet:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        details: error.issues,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create wallet',
    };
  }
}

/**
 * Update wallet
 */
export async function updateWallet(walletId: string, data: UpdateWalletRequest) {
  try {
    const userId = await getAuthenticatedUser();

    // Validate input
    const validatedData = updateWalletSchema.parse(data);

    // Update wallet
    const wallet = await cryptoService.updateWallet(userId, walletId, validatedData);

    // Revalidate related data
    revalidateTag('crypto-wallets');
    revalidateTag(`crypto-wallet-${walletId}`);
    revalidatePath('/dashboard/crypto');

    return {
      success: true,
      data: wallet,
    };
  } catch (error) {
    console.error('Error updating wallet:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        details: error.issues,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update wallet',
    };
  }
}

/**
 * Delete wallet
 */
export async function deleteWallet(walletId: string) {
  try {
    const userId = await getAuthenticatedUser();

    // Delete wallet
    await cryptoService.removeWallet(userId, walletId);

    // Revalidate related data
    revalidateTag('crypto-wallets');
    revalidateTag('crypto-portfolio');
    revalidatePath('/dashboard/crypto');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting wallet:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete wallet',
    };
  }
}

// ===============================
// TRANSACTION ACTIONS
// ===============================

/**
 * Get wallet transactions with pagination and filters
 */
export async function getWalletTransactions(
  walletId: string,
  filters: CryptoTransactionFilters = {},
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  try {
    const userId = await getAuthenticatedUser();
    const transactions = await cryptoService.getWalletTransactions(userId, walletId, filters, options);

    return {
      success: true,
      data: transactions,
    };
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
    };
  }
}

// ===============================
// NFT ACTIONS
// ===============================

/**
 * Get wallet NFTs with pagination and filters
 */
export async function getWalletNFTs(
  walletId: string,
  filters: NFTFilters = {},
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  try {
    const userId = await getAuthenticatedUser();
    const nfts = await cryptoService.getWalletNFTs(userId, walletId, filters, options);

    return {
      success: true,
      data: nfts,
    };
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch NFTs',
    };
  }
}

// ===============================
// DEFI ACTIONS
// ===============================

/**
 * Get wallet DeFi positions with pagination and filters
 */
export async function getWalletDeFiPositions(
  walletId: string,
  filters: DeFiPositionFilters = {},
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  try {
    const userId = await getAuthenticatedUser();
    const positions = await cryptoService.getWalletDeFiPositions(userId, walletId, filters, options);

    return {
      success: true,
      data: positions,
    };
  } catch (error) {
    console.error('Error fetching DeFi positions:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch DeFi positions',
    };
  }
}

/**
 * Get DeFi analytics for a wallet
 */
export async function getDeFiAnalytics(walletId: string) {
  try {
    const userId = await getAuthenticatedUser();
    const analytics = await cryptoService.getDeFiAnalytics(userId, walletId);

    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    console.error('Error fetching DeFi analytics:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch DeFi analytics',
    };
  }
}

// ===============================
// UTILITY ACTIONS
// ===============================

/**
 * Get single wallet data
 */
export async function getWallet(walletId: string) {
  try {
    const userId = await getAuthenticatedUser();
    const wallet = await cryptoService.getWallet(walletId, userId);

    return {
      success: true,
      data: wallet,
    };
  } catch (error) {
    console.error('Error fetching wallet:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wallet',
    };
  }
}

/**
 * Get user sync progress
 */
export async function getUserProgress() {
  try {
    const userId = await getAuthenticatedUser();
    const progress = await cryptoService.getUserProgress(userId);

    return {
      success: true,
      data: progress,
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch progress',
    };
  }
}