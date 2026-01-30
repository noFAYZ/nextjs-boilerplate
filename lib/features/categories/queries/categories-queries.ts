/**
 * Categories Queries - Query factory functions
 *
 * Query key factories and option builders for category queries
 */

// Query Keys Factory
export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  list: (params?: any) => [...categoriesKeys.lists(), params] as const,
  detail: (id: string) => [...categoriesKeys.all, 'detail', id] as const,
};
