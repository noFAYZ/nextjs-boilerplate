'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { CustomAccountCategory } from '@/lib/types/custom-categories';

interface AccountCategoryBadgesProps {
  categories?: Array<{
    id: string;
    name: string;
    priority: number;
  }>;
  showPriority?: boolean;
  maxDisplay?: number;
}

export function AccountCategoryBadges({
  categories,
  showPriority = true,
  maxDisplay = 3,
}: AccountCategoryBadgesProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Sort by priority (1 = primary)
  const sorted = [...categories].sort((a, b) => a.priority - b.priority);
  const displayed = sorted.slice(0, maxDisplay);
  const remaining = sorted.length - displayed.length;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {displayed.map((category) => (
        <Badge
          key={category.id}
          variant={category.priority === 1 ? 'default' : 'secondary'}
          className="text-xs"
        >
          {category.name}
          {showPriority && category.priority === 1 && ' ★'}
        </Badge>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-500">+{remaining} more</span>
      )}
    </div>
  );
}
