import { PrismaClient } from '@prisma/client';
import type { AccountGroup, FinancialAccount, CryptoWallet } from '@prisma/client';

export interface AccountGroupWithDetails extends AccountGroup {
  financialAccounts?: FinancialAccount[];
  cryptoWallets?: CryptoWallet[];
  children?: AccountGroup[];
  _count?: any;
}

export class FrontendAccountGroupService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get all account groups for a user with hierarchy
   */
  async getUserAccountGroups(userId: string): Promise<AccountGroupWithDetails[]> {
    const groups = await this.prisma.accountGroup.findMany({
      where: { userId },
      include: {
        financialAccounts: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        cryptoWallets: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        children: {
          include: {
            _count: {
              select: {
                financialAccounts: true,
                cryptoWallets: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
      orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });

    return groups;
  }

  /**
   * Get account group by ID with all details
   */
  async getAccountGroupById(id: string, userId: string): Promise<AccountGroupWithDetails | null> {
    const group = await this.prisma.accountGroup.findFirst({
      where: { id, userId },
      include: {
        financialAccounts: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                transactions: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
        cryptoWallets: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                transactions: true,
                nfts: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
        children: {
          include: {
            _count: {
              select: {
                financialAccounts: true,
                cryptoWallets: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        parent: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
    });

    return group;
  }

  /**
   * Get root account groups (groups without parent)
   */
  async getRootAccountGroups(userId: string): Promise<AccountGroupWithDetails[]> {
    const rootGroups = await this.prisma.accountGroup.findMany({
      where: {
        userId,
        parentId: null
      },
      include: {
        financialAccounts: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        cryptoWallets: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        children: {
          include: {
            _count: {
              select: {
                financialAccounts: true,
                cryptoWallets: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return rootGroups;
  }

  /**
   * Get account group hierarchy (nested structure)
   */
  async getAccountGroupHierarchy(userId: string): Promise<AccountGroupWithDetails[]> {
    // First get all groups
    const allGroups = await this.getUserAccountGroups(userId);

    // Build hierarchy by filtering out child groups and nesting them
    const rootGroups = allGroups.filter(group => !group.parentId);
    const childGroups = allGroups.filter(group => group.parentId);

    const buildHierarchy = (parentGroups: AccountGroupWithDetails[]): AccountGroupWithDetails[] => {
      return parentGroups.map(parent => {
        const children = childGroups.filter(child => child.parentId === parent.id);
        return {
          ...parent,
          children: children.length > 0 ? buildHierarchy(children) : []
        };
      });
    };

    return buildHierarchy(rootGroups);
  }

  /**
   * Get account groups with account summaries
   */
  async getAccountGroupsWithSummaries(userId: string) {
    const groups = await this.prisma.accountGroup.findMany({
      where: { userId },
      include: {
        financialAccounts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            accountType: true,
            balance: true,
            currency: true,
          },
        },
        cryptoWallets: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            address: true,
            network: true,
            totalBalanceUsd: true,
            assetCount: true,
          },
        },
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
          },
        },
      },
      orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });

    // Calculate summaries
    return groups.map(group => {
      const financialBalance = group.financialAccounts.reduce((sum, account) => {
        return sum + (account.balance?.toNumber() || 0);
      }, 0);

      const cryptoBalance = group.cryptoWallets.reduce((sum, wallet) => {
        return sum + (wallet.totalBalanceUsd?.toNumber() || 0);
      }, 0);

      return {
        ...group,
        summary: {
          totalFinancialBalance: financialBalance,
          totalCryptoBalance: cryptoBalance,
          totalBalance: financialBalance + cryptoBalance,
          accountCount: group._count.financialAccounts,
          walletCount: group._count.cryptoWallets,
        },
      };
    });
  }

  /**
   * Search account groups by name or description
   */
  async searchAccountGroups(userId: string, query: string) {
    const groups = await this.prisma.accountGroup.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return groups;
  }

  /**
   * Get account groups by parent ID
   */
  async getChildAccountGroups(parentId: string, userId: string) {
    const childGroups = await this.prisma.accountGroup.findMany({
      where: {
        parentId,
        userId
      },
      include: {
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return childGroups;
  }

  /**
   * Get flat list of all account groups with breadcrumb paths
   */
  async getAccountGroupsWithPaths(userId: string) {
    const allGroups = await this.getUserAccountGroups(userId);

    // Create a map for quick lookup
    const groupMap = new Map(allGroups.map(group => [group.id, group]));

    // Build paths for each group
    const buildPath = (group: AccountGroupWithDetails): string => {
      if (!group.parentId) return group.name;
      const parent = groupMap.get(group.parentId);
      return parent ? `${buildPath(parent)} > ${group.name}` : group.name;
    };

    return allGroups.map(group => ({
      ...group,
      path: buildPath(group),
    }));
  }
}