/**
 * Category Mutations - Stub implementations for category update operations
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return apiClient.get(`/categories`);
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUpdateCategory() {
  return {
    mutate: async (categoryId: string, data: any) => {
      return apiClient.put(`/categories/${categoryId}`, data);
    },
    isLoading: false,
    error: null,
  };
}

export function useDeleteCategory() {
  return {
    mutate: async (categoryId: string) => {
      return apiClient.delete(`/categories/${categoryId}`);
    },
    isLoading: false,
    error: null,
  };
}

export function useUnmapAccountFromCategory() {
  return {
    mutate: async (categoryId: string, accountId: string) => {
      return apiClient.delete(`/categories/${categoryId}/accounts/${accountId}`);
    },
    isLoading: false,
    error: null,
  };
}

export function useMapAccountToCategory() {
  return {
    mutate: async (categoryId: string, accountId: string) => {
      return apiClient.post(`/categories/${categoryId}/accounts`, { accountId });
    },
    isLoading: false,
    error: null,
  };
}

export function useToggleCategoryStatus() {
  return {
    mutate: async (categoryId: string, status: boolean) => {
      return apiClient.put(`/categories/${categoryId}/status`, { active: status });
    },
    isLoading: false,
    error: null,
  };
}

export function useCreateCategory() {
  return {
    mutate: async (data: any) => {
      return apiClient.post(`/categories`, data);
    },
    isLoading: false,
    error: null,
  };
}

export function useCreateCustomCategory() {
  return {
    mutate: async (data: any) => {
      try {
        const response = await fetch(`/api/categories/custom`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create custom category');
        return response.json();
      } catch (error) {
        console.error('Failed to create custom category:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: async () => {
      const response = await fetch(`/api/categories/tree`);
      if (!response.ok) throw new Error('Failed to fetch category tree');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoryTemplates() {
  return useQuery({
    queryKey: ['categories', 'templates'],
    queryFn: async () => {
      const response = await fetch(`/api/categories/templates`);
      if (!response.ok) throw new Error('Failed to fetch category templates');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategorizationRules() {
  return useQuery({
    queryKey: ['categories', 'rules'],
    queryFn: async () => {
      const response = await fetch(`/api/categories/rules`);
      if (!response.ok) throw new Error('Failed to fetch categorization rules');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateCategorizationRule() {
  return {
    mutate: async (data: any) => {
      try {
        const response = await fetch(`/api/categories/rules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create categorization rule');
        return response.json();
      } catch (error) {
        console.error('Failed to create categorization rule:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useDeleteCategorizationRule() {
  return {
    mutate: async (ruleId: string) => {
      try {
        const response = await fetch(`/api/categories/rules/${ruleId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete categorization rule');
        return response.json();
      } catch (error) {
        console.error('Failed to delete categorization rule:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useEnableRule() {
  return {
    mutate: async (ruleId: string) => {
      try {
        const response = await fetch(`/api/categories/rules/${ruleId}/enable`, {
          method: 'PUT',
        });
        if (!response.ok) throw new Error('Failed to enable rule');
        return response.json();
      } catch (error) {
        console.error('Failed to enable rule:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useDisableRule() {
  return {
    mutate: async (ruleId: string) => {
      try {
        const response = await fetch(`/api/categories/rules/${ruleId}/disable`, {
          method: 'PUT',
        });
        if (!response.ok) throw new Error('Failed to disable rule');
        return response.json();
      } catch (error) {
        console.error('Failed to disable rule:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useDuplicateRule() {
  return {
    mutate: async (ruleId: string) => {
      try {
        const response = await fetch(`/api/categories/rules/${ruleId}/duplicate`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to duplicate rule');
        return response.json();
      } catch (error) {
        console.error('Failed to duplicate rule:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useTestAllRules() {
  return {
    mutate: async () => {
      try {
        const response = await fetch(`/api/categories/rules/test-all`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to test rules');
        return response.json();
      } catch (error) {
        console.error('Failed to test rules:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}
