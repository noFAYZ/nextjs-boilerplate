/**
 * Query Dependencies Mapping
 *
 * Central registry of which queries to invalidate when mutations occur.
 * This prevents hardcoded string keys scattered across the codebase.
 *
 * Structure:
 * - Key: mutation type identifier (module:action)
 * - Value: query keys to invalidate + refetch strategy
 */

import { transactionKeys } from './queries/transactions-queries';
import { categorizationRulesKeys } from './queries/use-categorization-rules-data';
import { categoriesKeys } from './queries/categories-queries';
import { bankingKeys } from './queries/banking-queries';
import { budgetKeys } from './queries/budget-queries';

type RefetchType = 'background' | 'active';

interface InvalidationConfig {
  /** Query keys to invalidate */
  keys: (readonly unknown[])[];
  /** Whether to refetch in background or only active queries */
  refetchType?: RefetchType;
  /** Predicate to selectively invalidate queries */
  predicate?: (key: unknown[]) => boolean;
}

export const QUERY_DEPENDENCIES: Record<string, InvalidationConfig> = {
  // ============================================================================
  // CATEGORIZATION RULES - When rules change, they affect matching logic
  // ============================================================================

  'rules:update': {
    keys: [categorizationRulesKeys.list()],
    refetchType: 'background',
  },

  'rules:create': {
    keys: [categorizationRulesKeys.list()],
    refetchType: 'background',
  },

  'rules:delete': {
    keys: [categorizationRulesKeys.list()],
    refetchType: 'background',
  },

  'rules:enable': {
    keys: [categorizationRulesKeys.list()],
    refetchType: 'background',
  },

  'rules:disable': {
    keys: [categorizationRulesKeys.list()],
    refetchType: 'background',
  },

  'rules:setPriority': {
    keys: [categorizationRulesKeys.list()],
    refetchType: 'background',
  },

  // ============================================================================
  // CATEGORIES - When categories change
  // ============================================================================

  'categories:create': {
    keys: [
      categoriesKeys.list(),
      categoriesKeys.tree(),
    ],
    refetchType: 'background',
  },

  'categories:update': {
    keys: [
      categoriesKeys.list(),
      categoriesKeys.tree(),
    ],
    refetchType: 'background',
  },

  'categories:delete': {
    keys: [
      categoriesKeys.list(),
      categoriesKeys.tree(),
    ],
    refetchType: 'background',
  },

  'categories:mapAccount': {
    keys: [
      categoriesKeys.withAccounts?.(undefined) || categoriesKeys.list?.() || [],
      bankingKeys.accounts?.() || [],
    ] as (readonly unknown[])[],
    refetchType: 'background',
  },

  'categories:unmapAccount': {
    keys: [
      categoriesKeys.withAccounts?.(undefined) || categoriesKeys.list?.() || [],
      bankingKeys.accounts?.() || [],
    ] as (readonly unknown[])[],
    refetchType: 'background',
  },

  // ============================================================================
  // TRANSACTIONS - When transactions change
  // ============================================================================

  'transactions:update': {
    keys: [transactionKeys.list()],
    refetchType: 'background',
  },

  'transactions:delete': {
    keys: [transactionKeys.list()],
    refetchType: 'background',
  },

  'transactions:categorize': {
    keys: [
      transactionKeys.list(),
      transactionKeys.stats(),
    ],
    refetchType: 'background',
  },

  // ============================================================================
  // BANKING - When accounts change
  // ============================================================================

  'banking:connectAccount': {
    keys: [bankingKeys.accounts()],
    refetchType: 'background',
  },

  'banking:disconnectAccount': {
    keys: [bankingKeys.accounts()],
    refetchType: 'background',
  },

  'banking:updateAccount': {
    keys: [bankingKeys.accounts()],
    refetchType: 'background',
  },

  // ============================================================================
  // BUDGETS - When budgets change, also update analytics and summary
  // ============================================================================

  'budgets:create': {
    keys: [
      budgetKeys.lists(),
      budgetKeys.analytics(),
      budgetKeys.summary(),
    ],
    refetchType: 'background',
  },

  'budgets:update': {
    keys: [
      budgetKeys.lists(),
      budgetKeys.analytics(),
      budgetKeys.summary(),
    ],
    refetchType: 'background',
  },

  'budgets:delete': {
    keys: [
      budgetKeys.lists(),
      budgetKeys.analytics(),
      budgetKeys.summary(),
    ],
    refetchType: 'background',
  },

  'budgets:archive': {
    keys: [budgetKeys.lists()],
    refetchType: 'background',
  },

  'budgets:unarchive': {
    keys: [budgetKeys.lists()],
    refetchType: 'background',
  },

  'budgets:pause': {
    keys: [budgetKeys.lists()],
    refetchType: 'background',
  },

  'budgets:resume': {
    keys: [budgetKeys.lists()],
    refetchType: 'background',
  },

  'budgets:refresh': {
    keys: [
      budgetKeys.lists(),
      budgetKeys.analytics(),
      budgetKeys.summary(),
    ],
    refetchType: 'background',
  },

  'budgets:addTransaction': {
    keys: [
      budgetKeys.lists(),
      budgetKeys.analytics(),
      budgetKeys.summary(),
    ],
    refetchType: 'background',
  },

  // ============================================================================
  // CRYPTO - Wallets and portfolio
  // ============================================================================

  'crypto:createWallet': {
    keys: [
      ['crypto', 'wallets'] as const,
      ['crypto', 'portfolio'] as const,
      ['crypto', 'analytics'] as const,
    ] as (readonly unknown[])[],
    refetchType: 'background',
  },

  'crypto:updateWallet': {
    keys: [
      ['crypto', 'wallets'] as const,
      ['crypto', 'portfolio'] as const,
      ['crypto', 'analytics'] as const,
    ] as (readonly unknown[])[],
    refetchType: 'background',
  },

  'crypto:deleteWallet': {
    keys: [
      ['crypto', 'wallets'] as const,
      ['crypto', 'portfolio'] as const,
      ['crypto', 'analytics'] as const,
    ] as (readonly unknown[])[],
    refetchType: 'background',
  },

  'crypto:syncWallet': {
    keys: [
      ['crypto', 'wallets'] as const,
      ['crypto', 'portfolio'] as const,
      ['crypto', 'transactions'] as const,
    ] as (readonly unknown[])[],
    refetchType: 'background',
  },

  'crypto:syncAllWallets': {
    keys: [
      ['crypto', 'wallets'] as const,
      ['crypto', 'portfolio'] as const,
      ['crypto', 'analytics'] as const,
    ] as (readonly unknown[])[],
    refetchType: 'background',
  },
} as const;

/** Get invalidation config for a mutation type */
export function getDependencyConfig(
  mutationType: string
): InvalidationConfig | undefined {
  return QUERY_DEPENDENCIES[mutationType];
}

/** Check if a dependency mapping exists for a mutation type */
export function hasDependency(mutationType: string): boolean {
  return mutationType in QUERY_DEPENDENCIES;
}
