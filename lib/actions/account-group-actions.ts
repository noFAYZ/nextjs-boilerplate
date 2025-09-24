'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getSession } from '@/lib/auth-client';
import prisma from '@/lib/prisma';
import { FrontendAccountGroupService } from '@/docs/services/accountGroupService';
import type { AccountGroupWithDetails } from '@/docs/services/accountGroupService';
import { z } from 'zod';

// Initialize the service
const accountGroupService = new FrontendAccountGroupService(prisma);

// Validation schemas
const createAccountGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format').optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().min(0).max(999).optional(),
});

const updateAccountGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format').optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().min(0).max(999).optional(),
});

const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
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
// ACCOUNT GROUP ACTIONS
// ===============================

/**
 * Get all user account groups
 */
export async function getUserAccountGroups(): Promise<{
  success: boolean;
  data?: AccountGroupWithDetails[];
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();
    const groups = await accountGroupService.getUserAccountGroups(userId);

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error('Error fetching account groups:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account groups',
    };
  }
}

/**
 * Get account group by ID with all details
 */
export async function getAccountGroupById(groupId: string): Promise<{
  success: boolean;
  data?: AccountGroupWithDetails | null;
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();
    const group = await accountGroupService.getAccountGroupById(groupId, userId);

    return {
      success: true,
      data: group,
    };
  } catch (error) {
    console.error('Error fetching account group:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account group',
    };
  }
}

/**
 * Get root account groups (groups without parent)
 */
export async function getRootAccountGroups(): Promise<{
  success: boolean;
  data?: AccountGroupWithDetails[];
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();
    const groups = await accountGroupService.getRootAccountGroups(userId);

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error('Error fetching root account groups:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch root account groups',
    };
  }
}

/**
 * Get account group hierarchy (nested structure)
 */
export async function getAccountGroupHierarchy(): Promise<{
  success: boolean;
  data?: AccountGroupWithDetails[];
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();
    const hierarchy = await accountGroupService.getAccountGroupHierarchy(userId);

    return {
      success: true,
      data: hierarchy,
    };
  } catch (error) {
    console.error('Error fetching account group hierarchy:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account group hierarchy',
    };
  }
}

/**
 * Get account groups with account summaries
 */
export async function getAccountGroupsWithSummaries(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();
    const groups = await accountGroupService.getAccountGroupsWithSummaries(userId);

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error('Error fetching account groups with summaries:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account groups with summaries',
    };
  }
}

/**
 * Search account groups by name or description
 */
export async function searchAccountGroups(searchQuery: string): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
  details?: z.ZodError['errors'];
}> {
  try {
    const userId = await getAuthenticatedUser();

    // Validate search query
    const validatedData = searchSchema.parse({ query: searchQuery });

    const groups = await accountGroupService.searchAccountGroups(userId, validatedData.query);

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error('Error searching account groups:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        details: error.issues,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search account groups',
    };
  }
}

/**
 * Get account groups by parent ID
 */
export async function getChildAccountGroups(parentId: string): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();
    const groups = await accountGroupService.getChildAccountGroups(parentId, userId);

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error('Error fetching child account groups:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch child account groups',
    };
  }
}

/**
 * Get flat list of all account groups with breadcrumb paths
 */
export async function getAccountGroupsWithPaths(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();
    const groups = await accountGroupService.getAccountGroupsWithPaths(userId);

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error('Error fetching account groups with paths:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account groups with paths',
    };
  }
}

/**
 * Create a new account group
 */
export async function createAccountGroup(data: {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  sortOrder?: number;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  details?: z.ZodError['errors'];
}> {
  try {
    const userId = await getAuthenticatedUser();

    // Validate input
    const validatedData = createAccountGroupSchema.parse(data);

    // Create account group using Prisma directly since the service only has read operations
    const group = await prisma.account_groups.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        name: validatedData.name,
        description: validatedData.description,
        icon: validatedData.icon,
        color: validatedData.color,
        parentId: validatedData.parentId,
        sortOrder: validatedData.sortOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            financial_accounts: true,
            crypto_wallets: true,
            other_account_groups: true,
          },
        },
      },
    });

    // Revalidate related data
    revalidateTag('account-groups');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/accounts');

    return {
      success: true,
      data: group,
    };
  } catch (error) {
    console.error('Error creating account group:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        details: error.issues,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account group',
    };
  }
}

/**
 * Update account group
 */
export async function updateAccountGroup(
  groupId: string,
  data: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: string;
    sortOrder?: number;
  }
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  details?: z.ZodError['errors'];
}> {
  try {
    const userId = await getAuthenticatedUser();

    // Validate input
    const validatedData = updateAccountGroupSchema.parse(data);

    // Check if group exists and belongs to user
    const existingGroup = await prisma.account_groups.findFirst({
      where: { id: groupId, userId },
    });

    if (!existingGroup) {
      return {
        success: false,
        error: 'Account group not found',
      };
    }

    // Update account group
    const group = await prisma.account_groups.update({
      where: { id: groupId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            financial_accounts: true,
            crypto_wallets: true,
            other_account_groups: true,
          },
        },
      },
    });

    // Revalidate related data
    revalidateTag('account-groups');
    revalidateTag(`account-group-${groupId}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/accounts');

    return {
      success: true,
      data: group,
    };
  } catch (error) {
    console.error('Error updating account group:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        details: error.issues,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update account group',
    };
  }
}

/**
 * Delete account group
 */
export async function deleteAccountGroup(groupId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUser();

    // Check if group exists and belongs to user
    const existingGroup = await prisma.account_groups.findFirst({
      where: { id: groupId, userId },
      include: {
        _count: {
          select: {
            financial_accounts: true,
            crypto_wallets: true,
            other_account_groups: true,
          },
        },
      },
    });

    if (!existingGroup) {
      return {
        success: false,
        error: 'Account group not found',
      };
    }

    // Check if group has children or accounts
    const hasContent =
      (existingGroup._count.financial_accounts || 0) > 0 ||
      (existingGroup._count.crypto_wallets || 0) > 0 ||
      (existingGroup._count.other_account_groups || 0) > 0;

    if (hasContent) {
      return {
        success: false,
        error: 'Cannot delete account group that contains accounts, wallets, or child groups',
      };
    }

    // Delete account group
    await prisma.account_groups.delete({
      where: { id: groupId },
    });

    // Revalidate related data
    revalidateTag('account-groups');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/accounts');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting account group:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account group',
    };
  }
}