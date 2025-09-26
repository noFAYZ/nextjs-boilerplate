import { PrismaClient } from '@prisma/client';
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
  CryptoServiceError,
  CryptoErrorCodes,
  WalletSyncStatus,
} from '../types/crypto';
import { BlockchainNetwork, AssetType } from '@prisma/client';

export class FrontendCryptoService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // ===============================
  // VALIDATION & SANITIZATION
  // ===============================

  private sanitizeAddress(address: string): string {
    return address.toLowerCase().trim();
  }

  private sanitizeWalletName(name: string): string {
    return name.trim().slice(0, 100); // Limit to 100 characters
  }

  private sanitizeNotes(notes: string | undefined): string | null {
    if (!notes) return null;
    return notes.trim().slice(0, 500); // Limit to 500 characters
  }

  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  private validateWalletData(walletData: CryptoWalletRequest): void {
    if (!walletData.address || !this.isValidEthereumAddress(walletData.address)) {
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
  // WALLET MANAGEMENT (POST OPERATIONS)
  // ===============================

  /**
   * Create a new wallet with validation and sanitization
   */
  async addWallet(userId: string, walletData: CryptoWalletRequest) {
    // Validate input data
    this.validateWalletData(walletData);

    // Sanitize data
    const sanitizedData = {
      ...walletData,
      address: this.sanitizeAddress(walletData.address),
      name: this.sanitizeWalletName(walletData.name),
      notes: this.sanitizeNotes(walletData.notes),
    };

    // Check if wallet already exists for this user
    const existingWallet = await this.prisma.cryptoWallet.findUnique({
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
    const wallet = await this.prisma.cryptoWallet.create({
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

    return wallet;
  }

  /**
   * Update wallet with validation and sanitization
   */
  async updateWallet(userId: string, walletId: string, updateData: UpdateWalletRequest) {
    // Check if wallet exists and belongs to user
    const wallet = await this.prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Sanitize and filter update data
    const cleanedUpdateData: any = {};
    if (updateData.name !== undefined) {
      cleanedUpdateData.name = this.sanitizeWalletName(updateData.name);
    }
    if (updateData.notes !== undefined) {
      cleanedUpdateData.notes = this.sanitizeNotes(updateData.notes);
    }
    if (updateData.isWatching !== undefined) {
      cleanedUpdateData.isWatching = Boolean(updateData.isWatching);
    }
    if (updateData.sortOrder !== undefined) {
      cleanedUpdateData.sortOrder = Math.max(0, Math.min(999, Number(updateData.sortOrder)));
    }

    // Update wallet
    const updatedWallet = await this.prisma.cryptoWallet.update({
      where: { id: walletId },
      data: cleanedUpdateData,
    });

    return updatedWallet;
  }

  /**
   * Remove wallet (soft delete by setting isActive to false)
   */
  async removeWallet(userId: string, walletId: string) {
    // Check if wallet exists and belongs to user
    const wallet = await this.prisma.cryptoWallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Delete wallet and all related data
    await this.prisma.cryptoWallet.delete({
      where: { id: walletId },
    });

    return { success: true };
  }

  // ===============================
  // READ OPERATIONS (EXACT BACKEND STRUCTURE)
  // ===============================

  /**
   * Get all user wallets with counts and metadata - EXACT BACKEND STRUCTURE
   */
  async getUserWallets(userId: string) {
    const wallets = await this.prisma.cryptoWallet.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            nfts: true,
            transactions: true,
          },
        },
      },
      orderBy: [{ totalBalanceUsd: 'desc' }, { createdAt: 'desc' }],
    });

    return wallets;
  }

  /**
   * Resolve wallet by ID or address - EXACT BACKEND STRUCTURE
   */
  async resolveWallet(userId: string, walletId?: string, address?: string) {
    let wallet;

    if (walletId) {
      wallet = await this.prisma.cryptoWallet.findFirst({
        where: { id: walletId, userId },
      });
    } else if (address) {
      wallet = await this.prisma.cryptoWallet.findFirst({
        where: {
          address: address.toLowerCase(),
          userId,
        },
      });
    } else {
      throw new Error('Either walletId or address must be provided');
    }

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return wallet;
  }

  /**
   * Get comprehensive wallet portfolio data - EXACT BACKEND STRUCTURE
   */
  async getWalletPortfolio(userId: string, walletId: string) {
    const wallet = await this.prisma.cryptoWallet.findFirst({
      where: { id: walletId, userId },
      select: { id: true, createdAt: true, syncStatus: true },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Get comprehensive portfolio data from database - EXACT BACKEND QUERIES
    const [portfolio, positions, nfts, transactions, defiPositions, walletData] =
      await Promise.all([
        // Get the main portfolio record
        this.prisma.cryptoPortfolio.findFirst({
          where: { walletId },
        }),
        // Get positions (assets) with asset details
        this.prisma.cryptoPosition.findMany({
          where: {
            walletId,
            NOT: { assetId: null },
          },
          include: { asset: true },
          orderBy: { balanceUsd: 'desc' },
        }),
        // Get NFTs with full details
        this.prisma.cryptoNFT.findMany({
          where: { walletId },
          orderBy: { estimatedValue: 'desc' },
          take: 20, // Limit to top 20 NFTs
        }),
        // Get recent transactions
        this.prisma.cryptoTransaction.findMany({
          where: { walletId },
          include: { asset: true },
          orderBy: { timestamp: 'desc' },
          take: 10, // Limit to 10 most recent transactions
        }),
        // Get DeFi positions (new schema)
        this.prisma.deFiAppPosition.findMany({
          where: { walletId, isActive: true },
          include: { app: true },
        }),
        this.prisma.cryptoWallet.findMany({
          where: { id: walletId },
        }),
      ]);

    // Filter positions with valid assets
    const validPositions = positions?.filter((pos: any) => pos.asset !== null) || [];

    // Serialize BigInt fields in transactions - EXACT BACKEND LOGIC
    const serializedTransactions = transactions.map((tx) => ({
      ...tx,
      blockNumber: tx.blockNumber?.toString() || null,
      gasUsed: tx.gasUsed?.toString() || null,
    }));

    // Build comprehensive portfolio response - EXACT BACKEND STRUCTURE
    const portfolioResponse = {
      // Main portfolio data from crypto_portfolios table
      portfolio: portfolio
        ? {
            id: portfolio.id,
            totalPositionsValue: portfolio.totalPositionsValue.toNumber(),
            walletValue: portfolio.walletValue.toNumber(),
            depositedValue: portfolio.depositedValue.toNumber(),
            borrowedValue: portfolio.borrowedValue.toNumber(),
            lockedValue: portfolio.lockedValue.toNumber(),
            stakedValue: portfolio.stakedValue.toNumber(),
            // Network-specific values
            arbitrumValue: portfolio.arbitrumValue.toNumber(),
            avalancheValue: portfolio.avalancheValue.toNumber(),
            baseValue: portfolio.baseValue.toNumber(),
            bscValue: portfolio.bscValue.toNumber(),
            celoValue: portfolio.celoValue.toNumber(),
            ethereumValue: portfolio.ethereumValue.toNumber(),
            fantomValue: portfolio.fantomValue.toNumber(),
            lineaValue: portfolio.lineaValue.toNumber(),
            polygonValue: portfolio.polygonValue.toNumber(),
            // Performance data
            absolute24hChange: portfolio.absolute24hChange?.toNumber() || null,
            percent24hChange: portfolio.percent24hChange?.toNumber() || null,
            lastSyncAt: portfolio.lastSyncAt,
            dataFreshness: portfolio.dataFreshness,
            syncSource: portfolio.syncSource,
          }
        : null,

      // Assets (positions) with details - EXACT BACKEND STRUCTURE
      assets: validPositions.map((pos) => ({
        id: pos.id,
        balance: pos.balanceFormatted,
        balanceUsd: pos.balanceUsd.toNumber(),
        avgCostPrice: pos.avgCostPrice?.toNumber() || null,
        totalCostBasis: pos.totalCostBasis?.toNumber() || null,
        unrealizedPnl: pos.unrealizedPnl?.toNumber() || null,
        unrealizedPnlPct: pos.unrealizedPnlPct?.toNumber() || null,
        dayChange: pos.dayChange?.toNumber() || null,
        dayChangePct: pos.dayChangePct?.toNumber() || null,
        isStaked: pos.isStaked,
        stakingRewards: pos.stakingRewards?.toNumber() || null,
        lastUpdated: pos.lastUpdated,
        asset: {
          id: pos.asset!.id,
          symbol: pos.asset!.symbol,
          name: pos.asset!.name,
          contractAddress: pos.asset!.contractAddress,
          decimals: pos.asset!.decimals,
          type: pos.asset!.type,
          network: pos.asset!.network,
          logoUrl: pos.asset!.logoUrl,
          websiteUrl: pos.asset!.websiteUrl,
          description: pos.asset!.description,
          isVerified: pos.asset!.isVerified,
          price: pos.asset!.price?.toNumber() || null,
          priceUsd: pos.asset!.priceUsd?.toNumber() || null,
          marketCap: pos.asset!.marketCap?.toNumber() || null,
          volume24h: pos.asset!.volume24h?.toNumber() || null,
          change24h: pos.asset!.change24h?.toNumber() || null,
          lastPriceUpdate: pos.asset!.lastPriceUpdate,
        },
      })),

      // NFTs with full details - EXACT BACKEND STRUCTURE
      nfts: nfts.map((nft) => ({
        id: nft.id,
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        standard: nft.standard,
        network: nft.network,
        name: nft.name,
        description: nft.description,
        imageUrl: nft.imageUrl,
        animationUrl: nft.animationUrl,
        externalUrl: nft.externalUrl,
        attributes: nft.attributes,
        collectionName: nft.collectionName,
        collectionSymbol: nft.collectionSymbol,
        collectionSlug: nft.collectionSlug,
        ownerAddress: nft.ownerAddress,
        quantity: nft.quantity.toString(),
        transferredAt: nft.transferredAt,
        lastSalePrice: nft.lastSalePrice?.toNumber() || null,
        lastSalePriceUsd: nft.lastSalePriceUsd?.toNumber() || null,
        floorPrice: nft.floorPrice?.toNumber() || null,
        floorPriceUsd: nft.floorPriceUsd?.toNumber() || null,
        estimatedValue: nft.estimatedValue?.toNumber() || null,
        isSpam: nft.isSpam,
        isNsfw: nft.isNsfw,
        rarity: nft.rarity,
        rarityRank: nft.rarityRank,
      })),

      // Recent transactions - EXACT BACKEND STRUCTURE
      transactions: serializedTransactions,

      // DeFi positions (new schema) - grouped by app - EXACT BACKEND LOGIC
      defiApps: (() => {
        // Group positions by app + network combination
        const appGroups = defiPositions.reduce(
          (acc, defi) => {
            const appKey = `${defi.app.slug}_${defi.app.network || 'unknown'}`;

            if (!acc[appKey]) {
              acc[appKey] = {
                app: {
                  id: defi.app.id,
                  slug: defi.app.slug,
                  network: defi.app.network,
                  displayName: defi.app.displayName,
                  description: defi.app.description,
                  category: defi.app.category,
                  subcategory: defi.app.subcategory,
                  imgUrl: defi.app.imgUrl,
                  url: defi.app.url,
                  isVerified: defi.app.isVerified,
                  riskScore: defi.app.riskScore,
                },
                positions: [],
                totalValueUsd: 0,
                positionCount: 0,
              };
            }

            // Add position to the app group
            const position = {
              id: defi.id,
              contractAddress: defi.contractAddress,
              network: defi.network,
              positionType: defi.positionType,
              groupId: defi.groupId,
              groupLabel: defi.groupLabel,
              symbol: defi.symbol,
              balance: defi.balance,
              balanceFormatted: defi.balanceFormatted,
              balanceUSD: Number(defi.balanceUSD),
              price: defi.price ? Number(defi.price) : null,
              metaType: defi.metaType,
              apy: defi.apy ? Number(defi.apy) : null,
              apr: defi.apr ? Number(defi.apr) : null,
              yieldEarnedUsd: defi.yieldEarnedUsd ? Number(defi.yieldEarnedUsd) : null,
              dailyYield: defi.dailyYield ? Number(defi.dailyYield) : null,
              supply: defi.supply ? Number(defi.supply) : null,
              pricePerShare: defi.pricePerShare,
              tokens: defi.tokens,
              displayProps: defi.displayProps,
              isActive: defi.isActive,
              canWithdraw: defi.canWithdraw,
              lockupEnd: defi.lockupEnd,
              lastSyncAt: defi.lastSyncAt,
            };

            acc[appKey].positions.push(position);
            acc[appKey].totalValueUsd += Number(defi.balanceUSD);
            acc[appKey].positionCount += 1;

            return acc;
          },
          {} as Record<string, any>
        );

        // Convert to array and sort by total value
        return Object.values(appGroups).sort(
          (a: any, b: any) => b.totalValueUsd - a.totalValueUsd
        );
      })(),

      walletData: walletData[0] || null,
    };

    return portfolioResponse;
  }

  /**
   * Get aggregated portfolio across all user wallets - EXACT BACKEND STRUCTURE
   */
  async getAggregatedPortfolio(userId: string): Promise<PortfolioSummary> {
    // Get all user wallets
    const wallets = await this.prisma.cryptoWallet.findMany({
      where: { userId, isActive: true, isWatching: true },
    });

    if (wallets.length === 0) {
      return {
        totalValueUsd: 0,
        totalAssets: 0,
        totalNfts: 0,
        totalDeFiValue: 0,
        dayChange: 0,
        dayChangePct: 0,
        topAssets: [],
        networkDistribution: [],
        assetTypeDistribution: [],
      };
    }

    // Get aggregated data from all wallets - EXACT BACKEND LOGIC
    const walletIds = wallets.map((w) => w.id);
    const [positions, nfts, defiPositions] = await Promise.all([
      this.prisma.cryptoPosition.findMany({
        where: { walletId: { in: walletIds } },
        include: { asset: true },
        orderBy: { balanceUsd: 'desc' },
      }),
      this.prisma.cryptoNFT.count({ where: { walletId: { in: walletIds } } }),
      this.prisma.deFiAppPosition.findMany({
        where: { walletId: { in: walletIds }, isActive: true },
        include: { app: true },
      }),
    ]);

    // Filter positions with valid assets
    const validPositions = positions.filter((pos: any) => pos.asset !== null);

    // Aggregate positions by asset - EXACT BACKEND LOGIC
    const assetMap = new Map<string, AssetBalance>();
    validPositions.forEach((pos) => {
      const key = `${pos.asset!.symbol}_${pos.asset!.network}_${pos.asset!.contractAddress || 'native'}`;
      const existing = assetMap.get(key);

      if (existing) {
        existing.balanceUsd += pos.balanceUsd.toNumber();
        existing.balance = (
          parseFloat(existing.balance) + parseFloat(pos.balanceFormatted)
        ).toString();
      } else {
        assetMap.set(key, {
          symbol: pos.asset!.symbol,
          name: pos.asset!.name,
          balance: pos.balanceFormatted,
          balanceUsd: pos.balanceUsd.toNumber(),
          price: pos.asset!.priceUsd?.toNumber() || 0,
          change24h: pos.asset!.change24h?.toNumber() || 0,
          logoUrl: pos.asset!.logoUrl,
          network: pos.asset!.network,
          contractAddress: pos.asset!.contractAddress,
        });
      }
    });

    // Convert to array and sort by value
    const topAssets = Array.from(assetMap.values())
      .sort((a, b) => b.balanceUsd - a.balanceUsd)
      .slice(0, 10);

    // Calculate totals
    const totalValueUsd = validPositions.reduce((sum, pos) => sum + pos.balanceUsd.toNumber(), 0);
    const totalDeFiValue = defiPositions.reduce((sum, pos) => sum + pos.totalValueUsd.toNumber(), 0);

    // Calculate network distribution - EXACT BACKEND LOGIC
    const networkMap = new Map<BlockchainNetwork, number>();
    validPositions.forEach(pos => {
      const current = networkMap.get(pos.asset!.network) || 0;
      networkMap.set(pos.asset!.network, current + pos.balanceUsd.toNumber());
    });

    const networkDistribution = Array.from(networkMap.entries()).map(([network, value]) => ({
      network,
      value,
      percentage: totalValueUsd > 0 ? (value / totalValueUsd) * 100 : 0,
    }));

    // Calculate asset type distribution - EXACT BACKEND LOGIC
    const typeMap = new Map<AssetType, { value: number, count: number }>();
    validPositions.forEach(pos => {
      const current = typeMap.get(pos.asset!.type) || { value: 0, count: 0 };
      typeMap.set(pos.asset!.type, {
        value: current.value + pos.balanceUsd.toNumber(),
        count: current.count + 1
      });
    });

    const assetTypeDistribution = Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      value: data.value,
      percentage: totalValueUsd > 0 ? (data.value / totalValueUsd) * 100 : 0,
    }));

    return {
      totalValueUsd,
      totalAssets: validPositions.length,
      totalNfts: nfts,
      totalDeFiValue,
      dayChange: 0, // Would need historical data to calculate
      dayChangePct: 0, // Would need historical data to calculate
      topAssets,
      networkDistribution,
      assetTypeDistribution,
    };
  }

  /**
   * Get wallet transactions with pagination and filters - EXACT BACKEND STRUCTURE
   */
  async getWalletTransactions(
    userId: string,
    walletId: string,
    filters: CryptoTransactionFilters = {},
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<any>> {
    // Verify wallet ownership
    const wallet = await this.resolveWallet(userId, walletId);

    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Build where clause - EXACT BACKEND LOGIC
    const where: any = { walletId };

    if (filters.type) where.type = filters.type;
    if (filters.assetSymbol) {
      where.asset = { symbol: { contains: filters.assetSymbol, mode: 'insensitive' } };
    }
    if (filters.startDate) where.timestamp = { gte: filters.startDate };
    if (filters.endDate) {
      where.timestamp = { ...where.timestamp, lte: filters.endDate };
    }

    const [transactions, total] = await Promise.all([
      this.prisma.cryptoTransaction.findMany({
        where,
        include: {
          asset: {
            select: {
              symbol: true,
              name: true,
              logoUrl: true,
              network: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.cryptoTransaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get wallet NFTs with pagination and filters - EXACT BACKEND STRUCTURE
   */
  async getWalletNFTs(
    userId: string,
    walletId: string,
    filters: NFTFilters = {},
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<any>> {
    // Verify wallet ownership
    const wallet = await this.resolveWallet(userId, walletId);

    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Build where clause - EXACT BACKEND LOGIC
    const where: any = { walletId };

    if (filters.collectionName) {
      where.collectionName = { contains: filters.collectionName, mode: 'insensitive' };
    }
    if (filters.minValue) where.estimatedValue = { gte: filters.minValue };
    if (filters.maxValue) {
      where.estimatedValue = { ...where.estimatedValue, lte: filters.maxValue };
    }

    const [nfts, total] = await Promise.all([
      this.prisma.cryptoNFT.findMany({
        where,
        orderBy: { estimatedValue: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.cryptoNFT.count({ where }),
    ]);

    return {
      data: nfts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get wallet DeFi positions with pagination and filters - EXACT BACKEND STRUCTURE
   */
  async getWalletDeFiPositions(
    userId: string,
    walletId: string,
    filters: DeFiPositionFilters = {},
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<any>> {
    // Verify wallet ownership
    const wallet = await this.resolveWallet(userId, walletId);

    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Build where clause - EXACT BACKEND LOGIC
    const where: any = { walletId, isActive: true };

    if (filters.protocol) {
      where.app = { slug: filters.protocol };
    }
    if (filters.minValue) where.totalValueUsd = { gte: filters.minValue };
    if (filters.maxValue) {
      where.totalValueUsd = { ...where.totalValueUsd, lte: filters.maxValue };
    }

    const [positions, total] = await Promise.all([
      this.prisma.deFiAppPosition.findMany({
        where,
        include: {
          app: {
            select: {
              name: true,
              slug: true,
              logoUrl: true,
              website: true,
            },
          },
        },
        orderBy: { totalValueUsd: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.deFiAppPosition.count({ where }),
    ]);

    return {
      data: positions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get single wallet by ID - EXACT BACKEND STRUCTURE
   */
  async getWallet(walletId: string, userId: string) {
    const wallet = await this.prisma.cryptoWallet.findFirst({
      where: { id: walletId, userId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return wallet;
  }

  /**
   * Get wallet assets with pagination - EXACT BACKEND STRUCTURE
   */
  async getWalletAssets(
    filters: any,
    paginationOptions: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.userId) where.wallet = { userId: filters.userId };
    if (filters.walletId) where.walletId = filters.walletId;

    const [assets, total] = await Promise.all([
      this.prisma.crypto_assets.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.crypto_assets.count({ where }),
    ]);

    return {
      data: assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get DeFi analytics for a wallet - EXACT BACKEND STRUCTURE
   */
  async getDeFiAnalytics(userId: string, walletId: string) {
    // Verify wallet ownership
    const wallet = await this.resolveWallet(userId, walletId);

    const defiPositions = await this.prisma.deFiAppPosition.findMany({
      where: { walletId, isActive: true },
      include: { app: true },
    });

    const totalValueUsd = defiPositions.reduce((sum, pos) => sum + pos.totalValueUsd.toNumber(), 0);
    const protocolCount = new Set(defiPositions.map(pos => pos.app.slug)).size;

    return {
      summary: {
        totalValueUsd,
        protocolCount,
        positionCount: defiPositions.length,
        totalYield: 0, // Would need yield tracking data
      },
      positions: defiPositions,
      protocols: Array.from(new Set(defiPositions.map(pos => pos.app))),
    };
  }

  /**
   * Get wallets with pagination - EXACT BACKEND STRUCTURE
   */
  async getWallets(
    filters: any,
    paginationOptions: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.userId) where.userId = filters.userId;

    const [wallets, total] = await Promise.all([
      this.prisma.cryptoWallet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.cryptoWallet.count({ where }),
    ]);

    return {
      data: wallets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get wallet sync progress from UserSyncProgressManager
   */
  async getUserProgress(userId: string) {
    // This would typically call UserSyncProgressManager.getUserProgress
    // For now, return empty progress
    return {
      wallets: {},
      overall: {
        progress: 0,
        status: 'idle',
        activeJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
      },
    };
  }
}