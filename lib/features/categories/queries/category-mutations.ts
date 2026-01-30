/**
 * Category Mutations - Stub implementations for category update operations
 */

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
