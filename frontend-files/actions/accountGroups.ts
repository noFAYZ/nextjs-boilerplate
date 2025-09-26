'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import type { AccountGroup, FinancialAccount, CryptoWallet } from '@prisma/client';

const prisma = new PrismaClient();

export interface AccountGroupWithDetails extends AccountGroup {
  financialAccounts?: FinancialAccount[];
  cryptoWallets?: CryptoWallet[];
  children?: AccountGroup[];
  _count?: any;
}

interface CreateAccountGroupData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
}

interface UpdateAccountGroupData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
}

// ===============================
// ACCOUNT GROUP MANAGEMENT ACTIONS
// ===============================

export async function getUserAccountGroups(userId: string) {
  try {
    const groups = await prisma.accountGroup.findMany({
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
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return { success: true, data: groups };
  } catch (error) {
    console.error('Error fetching account groups:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account groups'
    };
  }
}

export async function getAccountGroupById(userId: string, groupId: string) {
  try {
    const group = await prisma.accountGroup.findFirst({
      where: {
        id: groupId,
        userId,
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
        parent: true,
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
    });

    if (!group) {
      return {
        success: false,
        error: 'Account group not found'
      };
    }

    return { success: true, data: group };
  } catch (error) {
    console.error('Error fetching account group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account group'
    };
  }
}

export async function createAccountGroup(userId: string, data: CreateAccountGroupData) {
  try {
    // Validate required fields
    if (!data.name?.trim()) {
      return {
        success: false,
        error: 'Group name is required'
      };
    }

    // If parentId is provided, verify it exists and belongs to user
    if (data.parentId) {
      const parentGroup = await prisma.accountGroup.findFirst({
        where: {
          id: data.parentId,
          userId,
        },
      });

      if (!parentGroup) {
        return {
          success: false,
          error: 'Parent group not found'
        };
      }
    }

    // Get next sort order if not provided
    let sortOrder = data.sortOrder;
    if (sortOrder === undefined) {
      const maxOrder = await prisma.accountGroup.aggregate({
        where: {
          userId,
          parentId: data.parentId || null,
        },
        _max: {
          sortOrder: true,
        },
      });
      sortOrder = (maxOrder._max.sortOrder || 0) + 1;
    }

    const group = await prisma.accountGroup.create({
      data: {
        userId,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        color: data.color || null,
        icon: data.icon || null,
        parentId: data.parentId || null,
        sortOrder,
      },
      include: {
        financialAccounts: true,
        cryptoWallets: true,
        children: true,
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
    });

    revalidatePath('/dashboard/accounts');
    return { success: true, data: group };
  } catch (error) {
    console.error('Error creating account group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account group'
    };
  }
}

export async function updateAccountGroup(userId: string, groupId: string, data: UpdateAccountGroupData) {
  try {
    // Verify group exists and belongs to user
    const existingGroup = await prisma.accountGroup.findFirst({
      where: {
        id: groupId,
        userId,
      },
    });

    if (!existingGroup) {
      return {
        success: false,
        error: 'Account group not found'
      };
    }

    // Validate name if provided
    if (data.name !== undefined && !data.name?.trim()) {
      return {
        success: false,
        error: 'Group name cannot be empty'
      };
    }

    // If changing parentId, verify new parent exists and belongs to user
    if (data.parentId !== undefined && data.parentId !== null) {
      const parentGroup = await prisma.accountGroup.findFirst({
        where: {
          id: data.parentId,
          userId,
        },
      });

      if (!parentGroup) {
        return {
          success: false,
          error: 'Parent group not found'
        };
      }

      // Prevent circular references
      if (data.parentId === groupId) {
        return {
          success: false,
          error: 'Cannot set group as its own parent'
        };
      }
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }
    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }
    if (data.color !== undefined) {
      updateData.color = data.color || null;
    }
    if (data.icon !== undefined) {
      updateData.icon = data.icon || null;
    }
    if (data.parentId !== undefined) {
      updateData.parentId = data.parentId || null;
    }
    if (data.sortOrder !== undefined) {
      updateData.sortOrder = data.sortOrder;
    }

    const group = await prisma.accountGroup.update({
      where: { id: groupId },
      data: updateData,
      include: {
        financialAccounts: true,
        cryptoWallets: true,
        children: true,
        parent: true,
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
    });

    revalidatePath('/dashboard/accounts');
    return { success: true, data: group };
  } catch (error) {
    console.error('Error updating account group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update account group'
    };
  }
}

export async function deleteAccountGroup(userId: string, groupId: string) {
  try {
    // Verify group exists and belongs to user
    const group = await prisma.accountGroup.findFirst({
      where: {
        id: groupId,
        userId,
      },
      include: {
        children: true,
        financialAccounts: true,
        cryptoWallets: true,
      },
    });

    if (!group) {
      return {
        success: false,
        error: 'Account group not found'
      };
    }

    // Check if group has children or accounts
    if (group.children.length > 0) {
      return {
        success: false,
        error: 'Cannot delete group with child groups. Please move or delete child groups first.'
      };
    }

    if (group.financialAccounts.length > 0 || group.cryptoWallets.length > 0) {
      return {
        success: false,
        error: 'Cannot delete group with accounts. Please move or delete accounts first.'
      };
    }

    await prisma.accountGroup.delete({
      where: { id: groupId },
    });

    revalidatePath('/dashboard/accounts');
    return { success: true };
  } catch (error) {
    console.error('Error deleting account group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account group'
    };
  }
}

// ===============================
// HIERARCHY MANAGEMENT ACTIONS
// ===============================

export async function getRootAccountGroups(userId: string) {
  try {
    const rootGroups = await prisma.accountGroup.findMany({
      where: {
        userId,
        parentId: null,
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
                children: true,
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

    return { success: true, data: rootGroups };
  } catch (error) {
    console.error('Error fetching root account groups:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch root account groups'
    };
  }
}

export async function getAccountGroupHierarchy(userId: string) {
  try {
    // Get all groups for the user
    const groups = await prisma.accountGroup.findMany({
      where: { userId },
      include: {
        financialAccounts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
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
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    // Build hierarchy tree
    const groupMap = new Map(groups.map(g => [g.id, { ...g, children: [] as any[] }]));
    const rootGroups: any[] = [];

    groups.forEach(group => {
      const groupWithChildren = groupMap.get(group.id)!;

      if (group.parentId) {
        const parent = groupMap.get(group.parentId);
        if (parent) {
          parent.children.push(groupWithChildren);
        }
      } else {
        rootGroups.push(groupWithChildren);
      }
    });

    return { success: true, data: rootGroups };
  } catch (error) {
    console.error('Error building account group hierarchy:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to build account group hierarchy'
    };
  }
}

export async function moveAccountGroup(userId: string, groupId: string, newParentId: string | null) {
  try {
    // Verify group exists and belongs to user
    const group = await prisma.accountGroup.findFirst({
      where: {
        id: groupId,
        userId,
      },
    });

    if (!group) {
      return {
        success: false,
        error: 'Account group not found'
      };
    }

    // If moving to a parent, verify parent exists and belongs to user
    if (newParentId) {
      const parentGroup = await prisma.accountGroup.findFirst({
        where: {
          id: newParentId,
          userId,
        },
      });

      if (!parentGroup) {
        return {
          success: false,
          error: 'Parent group not found'
        };
      }

      // Prevent circular references by checking if newParent is a descendant of group
      const childGroups = await prisma.accountGroup.findMany({
        where: { userId },
      });

      function isDescendant(parentId: string, targetId: string): boolean {
        const children = childGroups.filter(g => g.parentId === parentId);
        for (const child of children) {
          if (child.id === targetId || isDescendant(child.id, targetId)) {
            return true;
          }
        }
        return false;
      }

      if (isDescendant(groupId, newParentId)) {
        return {
          success: false,
          error: 'Cannot move group to its own descendant'
        };
      }
    }

    // Get next sort order in new parent
    const maxOrder = await prisma.accountGroup.aggregate({
      where: {
        userId,
        parentId: newParentId,
      },
      _max: {
        sortOrder: true,
      },
    });

    const newSortOrder = (maxOrder._max.sortOrder || 0) + 1;

    // Update group
    const updatedGroup = await prisma.accountGroup.update({
      where: { id: groupId },
      data: {
        parentId: newParentId,
        sortOrder: newSortOrder,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            financialAccounts: true,
            cryptoWallets: true,
            children: true,
          },
        },
      },
    });

    revalidatePath('/dashboard/accounts');
    return { success: true, data: updatedGroup };
  } catch (error) {
    console.error('Error moving account group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to move account group'
    };
  }
}

// ===============================
// ACCOUNT ASSIGNMENT ACTIONS
// ===============================

export async function assignFinancialAccountToGroup(
  userId: string,
  accountId: string,
  groupId: string
) {
  try {
    // Verify both account and group exist and belong to user
    const [account, group] = await Promise.all([
      prisma.account.findFirst({
        where: {
          id: accountId,
          userId,
        },
      }),
      prisma.accountGroup.findFirst({
        where: {
          id: groupId,
          userId,
        },
      }),
    ]);

    if (!account) {
      return {
        success: false,
        error: 'Financial account not found'
      };
    }

    if (!group) {
      return {
        success: false,
        error: 'Account group not found'
      };
    }

    // Update account's group assignment
    await prisma.account.update({
      where: { id: accountId },
      data: { groupId },
    });

    revalidatePath('/dashboard/accounts');
    return { success: true };
  } catch (error) {
    console.error('Error assigning financial account to group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign account to group'
    };
  }
}

export async function assignCryptoWalletToGroup(
  userId: string,
  walletId: string,
  groupId: string
) {
  try {
    // Verify both wallet and group exist and belong to user
    const [wallet, group] = await Promise.all([
      prisma.cryptoWallet.findFirst({
        where: {
          id: walletId,
          userId,
        },
      }),
      prisma.accountGroup.findFirst({
        where: {
          id: groupId,
          userId,
        },
      }),
    ]);

    if (!wallet) {
      return {
        success: false,
        error: 'Crypto wallet not found'
      };
    }

    if (!group) {
      return {
        success: false,
        error: 'Account group not found'
      };
    }

    // Update wallet's group assignment
    await prisma.cryptoWallet.update({
      where: { id: walletId },
      data: { groupId },
    });

    revalidatePath('/dashboard/accounts');
    return { success: true };
  } catch (error) {
    console.error('Error assigning crypto wallet to group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign wallet to group'
    };
  }
}

export async function removeAccountFromGroup(userId: string, accountId: string, accountType: 'financial' | 'crypto') {
  try {
    if (accountType === 'financial') {
      const account = await prisma.account.findFirst({
        where: {
          id: accountId,
          userId,
        },
      });

      if (!account) {
        return {
          success: false,
          error: 'Financial account not found'
        };
      }

      await prisma.account.update({
        where: { id: accountId },
        data: { groupId: null },
      });
    } else {
      const wallet = await prisma.cryptoWallet.findFirst({
        where: {
          id: accountId,
          userId,
        },
      });

      if (!wallet) {
        return {
          success: false,
          error: 'Crypto wallet not found'
        };
      }

      await prisma.cryptoWallet.update({
        where: { id: accountId },
        data: { groupId: null },
      });
    }

    revalidatePath('/dashboard/accounts');
    return { success: true };
  } catch (error) {
    console.error('Error removing account from group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove account from group'
    };
  }
}