import { useMemo } from 'react';
import type { Category } from '@/components/transactions/card-view/types';

export function useCategoriesMap(categoriesResponse: any): Map<string, Category> {
  return useMemo(() => {
    if (!categoriesResponse?.groups) return new Map();

    const map = new Map<string, Category>();
    categoriesResponse.groups.forEach((group: any) => {
      if (group.categories?.length) {
        group.categories.forEach((category: any) => {
          map.set(category.id, {
            id: category.id,
            displayName: category.displayName,
            emoji: category.emoji,
            groupName: group.groupName,
          });
        });
      }
    });
    return map;
  }, [categoriesResponse]);
}
