/**
 * Categories Query Factories - Consolidated
 *
 * This file consolidates category-related query keys and factories
 * from individual query files for better organization.
 */

// Re-export main category queries
export * from './category-matching-queries';

// Create consolidated categoriesKeys for main category queries
export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  details: (id: string) => [...categoriesKeys.list(), id] as const,
  tree: () => [...categoriesKeys.all, 'tree'] as const,
  withAccounts: (id: string) => [...categoriesKeys.details(id), 'accounts'] as const,
  byType: (type: string) => [...categoriesKeys.all, 'byType', type] as const,
} as const;

// Placeholder exports for categoriesQueries and categoriesMutations
export const categoriesQueries = {};
export const categoriesMutations = {};
