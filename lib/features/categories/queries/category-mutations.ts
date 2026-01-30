/**
 * Category Mutations - Stub implementations for category update operations
 */

import { useQuery } from '@tanstack/react-query';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        return { success: false, data: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUpdateCategory() {
  return {
    mutate: async (categoryId: string, data: any) => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update category');
        return response.json();
      } catch (error) {
        console.error('Failed to update category:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useDeleteCategory() {
  return {
    mutate: async (categoryId: string) => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
        return response.json();
      } catch (error) {
        console.error('Failed to delete category:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useUnmapAccountFromCategory() {
  return {
    mutate: async (categoryId: string, accountId: string) => {
      try {
        const response = await fetch(
          `/api/categories/${categoryId}/accounts/${accountId}`,
          { method: 'DELETE' }
        );
        if (!response.ok) throw new Error('Failed to unmap account');
        return response.json();
      } catch (error) {
        console.error('Failed to unmap account:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useMapAccountToCategory() {
  return {
    mutate: async (categoryId: string, accountId: string) => {
      try {
        const response = await fetch(
          `/api/categories/${categoryId}/accounts`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId }),
          }
        );
        if (!response.ok) throw new Error('Failed to map account');
        return response.json();
      } catch (error) {
        console.error('Failed to map account:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useToggleCategoryStatus() {
  return {
    mutate: async (categoryId: string, status: boolean) => {
      try {
        const response = await fetch(
          `/api/categories/${categoryId}/status`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: status }),
          }
        );
        if (!response.ok) throw new Error('Failed to toggle status');
        return response.json();
      } catch (error) {
        console.error('Failed to toggle status:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}
