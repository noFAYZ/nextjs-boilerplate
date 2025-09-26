'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import type {
  CryptoWalletRequest,
  UpdateWalletRequest,
  PortfolioSummary,
  AssetBalance,
  CryptoTransactionFilters,
  PaginationOptions,
  PaginatedResponse,
  NFTFilters,
  DeFiPositionFilters,
  WalletSyncStatus,
} from '../types/crypto';
import { BlockchainNetwork, AssetType } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// VALIDATION & SANITIZATION HELPERS
// ===============================

function sanitizeAddress(address: string): string {
  return address.toLowerCase().trim();
}

function sanitizeWalletName(name: string): string {
  return name.trim().slice(0, 100); // Limit to 100 characters
}

function sanitizeNotes(notes: string | undefined): string | null {
  if (!notes) return null;
  return notes.trim().slice(0, 500); // Limit to 500 characters
}

function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function validateWalletData(walletData: CryptoWalletRequest): void {
  if (!walletData.address || !isValidEthereumAddress(walletData.address)) {
    throw new Error('Invalid wallet address format');
  }
  if (!walletData.name || walletData.name.trim().length === 0) {
    throw new Error('Wallet name is required');
  }
  if (!walletData.network) {
    throw new Error('Network is required');
  }
}

// ===============================
// WALLET MANAGEMENT ACTIONS
// ===============================

export async function createWallet(userId: string, walletData: CryptoWalletRequest) {
  try {
    validateWalletData(walletData);

    const sanitizedData = {
      ...walletData,
      address: sanitizeAddress(walletData.address),
      name: sanitizeWalletName(walletData.name),
      notes: sanitizeNotes(walletData.notes),
    };

    // Check if wallet already exists for this user
    const existingWallet = await prisma.cryptoWallet.findUnique({
      where: {
        userId_address_network: {
          userId,
          address: sanitizedData.address,
          network: sanitizedData.network,
        },
      },
    });

    if (existingWallet) {
      throw new Error('Wallet already exists for this user');
    }

    // Create wallet in database
    const wallet = await prisma.cryptoWallet.create({
      data: {
        userId,
        name: sanitizedData.name,
        address: sanitizedData.address,
        type: sanitizedData.type || 'EXTERNAL',
        network: sanitizedData.network,
        notes: sanitizedData.notes,
        totalBalanceUsd: 0,
        assetCount: 0,
        nftCount: 0,
        syncStatus: 'IDLE' as WalletSyncStatus,
      },
      include: {
        user: true,
      },
    });

    revalidatePath('/dashboard/wallets');
    return { success: true, data: wallet };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create wallet'
    };
  }
}

export async function updateWallet(userId: string, walletId: string, updateData: UpdateWalletRequest) {
  try {
    // Check if wallet exists and belongs to user
    const wallet = await prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found or does not belong to user');
    }

    // Validate and sanitize update data
    const sanitizedUpdateData: any = {};

    if (updateData.name !== undefined) {
      if (typeof updateData.name !== 'string' || updateData.name.trim().length === 0) {
        throw new Error('Wallet name cannot be empty');
      }
      sanitizedUpdateData.name = sanitizeWalletName(updateData.name);
    }

    if (updateData.notes !== undefined) {
      sanitizedUpdateData.notes = sanitizeNotes(updateData.notes);
    }

    if (updateData.type !== undefined) {
      sanitizedUpdateData.type = updateData.type;
    }

    // Update wallet
    const updatedWallet = await prisma.cryptoWallet.update({
      where: { id: walletId },
      data: sanitizedUpdateData,
      include: {
        user: true,
      },
    });

    revalidatePath('/dashboard/wallets');
    return { success: true, data: updatedWallet };
  } catch (error) {
    console.error('Error updating wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update wallet'
    };
  }
}

export async function deleteWallet(userId: string, walletId: string) {
  try {
    // Check if wallet exists and belongs to user
    const wallet = await prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found or does not belong to user');
    }

    // Delete wallet (cascade delete will handle related records)
    await prisma.cryptoWallet.delete({
      where: { id: walletId },
    });

    revalidatePath('/dashboard/wallets');
    return { success: true };
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete wallet'
    };
  }
}

export async function getUserWallets(userId: string) {
  try {
    const wallets = await prisma.cryptoWallet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    });

    return { success: true, data: wallets };
  } catch (error) {
    console.error('Error fetching user wallets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wallets'
    };
  }
}

export async function getWalletByIdOrAddress(
  userId: string,
  identifier: string,
  network?: BlockchainNetwork
) {
  try {
    let wallet;

    // Try to find by ID first
    if (identifier.length === 24) { // MongoDB ObjectId length
      wallet = await prisma.cryptoWallet.findFirst({
        where: {
          id: identifier,
          userId,
        },
      });
    }

    // If not found by ID, try by address
    if (!wallet) {
      wallet = await prisma.cryptoWallet.findFirst({
        where: {
          address: sanitizeAddress(identifier),
          userId,
          ...(network && { network }),
        },
      });
    }

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return { success: true, data: wallet };
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wallet'
    };
  }
}

// ===============================
// PORTFOLIO DATA ACTIONS
// ===============================

export async function getWalletPortfolio(userId: string, walletId: string) {
  try {
    // Verify wallet belongs to user
    const wallet = await prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const [portfolio, positions, nfts, transactions, defiPositions, relatedWallets] = await Promise.all([
      prisma.cryptoPortfolio.findFirst({
        where: { walletId },
      }),
      prisma.cryptoPosition.findMany({
        where: { walletId },
        orderBy: { balanceUsd: 'desc' },
      }),
      prisma.cryptoNFT.findMany({
        where: { walletId },
      }),
      prisma.cryptoTransaction.findMany({
        where: { walletId },
        orderBy: { timestamp: 'desc' },
        take: 50,
      }),
      prisma.deFiAppPosition.findMany({
        where: { walletId },
      }),
      prisma.cryptoWallet.findMany({
        where: { userId },
      }),
    ]);

    const portfolioSummary: PortfolioSummary = {
      totalBalanceUsd: portfolio?.totalBalanceUsd || 0,
      totalChangeUsd: portfolio?.totalChangeUsd || 0,
      totalChangePercentage: portfolio?.totalChangePercentage || 0,
      assetCount: positions.length,
      nftCount: nfts.length,
      transactionCount: transactions.length,
      defiPositionCount: defiPositions.length,
      lastUpdated: portfolio?.updatedAt || new Date(),
      walletCount: relatedWallets.length,
      positions: positions.map(pos => ({
        symbol: pos.symbol,
        name: pos.name || pos.symbol,
        balance: parseFloat(pos.balance || '0'),
        balanceUsd: parseFloat(pos.balanceUsd || '0'),
        changeUsd: parseFloat(pos.changeUsd || '0'),
        changePercentage: parseFloat(pos.changePercentage || '0'),
        price: parseFloat(pos.price || '0'),
        logoUrl: pos.logoUrl,
        assetType: pos.assetType as AssetType,
      })),
    };

    return { success: true, data: portfolioSummary };
  } catch (error) {
    console.error('Error fetching wallet portfolio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch portfolio'
    };
  }
}

export async function getAggregatedPortfolio(userId: string) {
  try {
    const wallets = await prisma.cryptoWallet.findMany({
      where: { userId },
      include: {
        cryptoPortfolio: true,
      },
    });

    if (wallets.length === 0) {
      return {
        success: true,
        data: {
          totalBalanceUsd: 0,
          totalChangeUsd: 0,
          totalChangePercentage: 0,
          assetCount: 0,
          nftCount: 0,
          defiPositionCount: 0,
          walletCount: 0,
          positions: [],
        }
      };
    }

    const walletIds = wallets.map(w => w.id);

    const [positions, nftCount, defiPositions] = await Promise.all([
      prisma.cryptoPosition.findMany({
        where: { walletId: { in: walletIds } },
      }),
      prisma.cryptoNFT.count({ where: { walletId: { in: walletIds } } }),
      prisma.deFiAppPosition.findMany({
        where: { walletId: { in: walletIds } },
      }),
    ]);

    // Aggregate positions by symbol
    const aggregatedPositions = new Map<string, AssetBalance>();

    positions.forEach(position => {
      const key = `${position.symbol}_${position.assetType}`;
      const existing = aggregatedPositions.get(key);

      if (existing) {
        existing.balance += parseFloat(position.balance || '0');
        existing.balanceUsd += parseFloat(position.balanceUsd || '0');
        existing.changeUsd += parseFloat(position.changeUsd || '0');
      } else {
        aggregatedPositions.set(key, {
          symbol: position.symbol,
          name: position.name || position.symbol,
          balance: parseFloat(position.balance || '0'),
          balanceUsd: parseFloat(position.balanceUsd || '0'),
          changeUsd: parseFloat(position.changeUsd || '0'),
          changePercentage: parseFloat(position.changePercentage || '0'),
          price: parseFloat(position.price || '0'),
          logoUrl: position.logoUrl,
          assetType: position.assetType as AssetType,
        });
      }
    });

    const positionsArray = Array.from(aggregatedPositions.values())
      .sort((a, b) => b.balanceUsd - a.balanceUsd);

    const totalBalanceUsd = positionsArray.reduce((sum, pos) => sum + pos.balanceUsd, 0);
    const totalChangeUsd = positionsArray.reduce((sum, pos) => sum + pos.changeUsd, 0);
    const totalChangePercentage = totalBalanceUsd > 0
      ? (totalChangeUsd / (totalBalanceUsd - totalChangeUsd)) * 100
      : 0;

    const portfolioSummary: PortfolioSummary = {
      totalBalanceUsd,
      totalChangeUsd,
      totalChangePercentage,
      assetCount: positionsArray.length,
      nftCount,
      defiPositionCount: defiPositions.length,
      walletCount: wallets.length,
      positions: positionsArray,
      lastUpdated: new Date(),
    };

    return { success: true, data: portfolioSummary };
  } catch (error) {
    console.error('Error fetching aggregated portfolio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch portfolio'
    };
  }
}

// ===============================
// TRANSACTION ACTIONS
// ===============================

export async function getWalletTransactions(
  userId: string,
  walletId: string,
  filters: CryptoTransactionFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
) {
  try {
    // Verify wallet belongs to user
    const wallet = await prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Build where clause
    const where: any = { walletId };

    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.fromDate) where.timestamp = { ...where.timestamp, gte: new Date(filters.fromDate) };
    if (filters.toDate) where.timestamp = { ...where.timestamp, lte: new Date(filters.toDate) };

    const skip = (pagination.page - 1) * pagination.limit;

    const [transactions, total] = await Promise.all([
      prisma.cryptoTransaction.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.cryptoTransaction.count({ where }),
    ]);

    const response: PaginatedResponse<typeof transactions[0]> = {
      data: transactions,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions'
    };
  }
}

// ===============================
// NFT ACTIONS
// ===============================

export async function getWalletNFTs(
  userId: string,
  walletId: string,
  filters: NFTFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
) {
  try {
    // Verify wallet belongs to user
    const wallet = await prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Build where clause
    const where: any = { walletId };

    if (filters.collection) where.collectionName = { contains: filters.collection, mode: 'insensitive' };
    if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' };

    const skip = (pagination.page - 1) * pagination.limit;

    const [nfts, total] = await Promise.all([
      prisma.cryptoNFT.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cryptoNFT.count({ where }),
    ]);

    const response: PaginatedResponse<typeof nfts[0]> = {
      data: nfts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch NFTs'
    };
  }
}

// ===============================
// DEFI ACTIONS
// ===============================

export async function getWalletDeFiPositions(
  userId: string,
  walletId: string,
  filters: DeFiPositionFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
) {
  try {
    // Verify wallet belongs to user
    const wallet = await prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Build where clause
    const where: any = { walletId };

    if (filters.appId) where.appId = filters.appId;
    if (filters.type) where.type = filters.type;

    const skip = (pagination.page - 1) * pagination.limit;

    const [positions, total] = await Promise.all([
      prisma.deFiAppPosition.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { balanceUsd: 'desc' },
        include: {
          app: true,
          tokens: true,
        },
      }),
      prisma.deFiAppPosition.count({ where }),
    ]);

    const response: PaginatedResponse<typeof positions[0]> = {
      data: positions,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching DeFi positions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch DeFi positions'
    };
  }
}

// ===============================
// WALLET SEARCH ACTIONS
// ===============================

export async function searchWallets(
  userId: string,
  query: string,
  pagination: PaginationOptions = { page: 1, limit: 20 }
) {
  try {
    const where = {
      userId,
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { address: { contains: query, mode: 'insensitive' as const } },
        { notes: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const skip = (pagination.page - 1) * pagination.limit;

    const [wallets, total] = await Promise.all([
      prisma.cryptoWallet.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cryptoWallet.count({ where }),
    ]);

    const response: PaginatedResponse<typeof wallets[0]> = {
      data: wallets,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error searching wallets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search wallets'
    };
  }
}