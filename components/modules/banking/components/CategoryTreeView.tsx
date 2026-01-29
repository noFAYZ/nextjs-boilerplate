'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategoryTree, useDeleteCategory } from '@/lib/queries/use-categories-data';
import type { CustomAccountCategory } from '@/lib/types/custom-categories';

interface CategoryTreeViewProps {
  onEdit?: (category: CustomAccountCategory) => void;
  onAddChild?: (parentCategory: CustomAccountCategory) => void;
  onDelete?: (categoryId: string) => void;
}

export function CategoryTreeView({
  onEdit,
  onAddChild,
  onDelete,
}: CategoryTreeViewProps) {
  const { data: categories, isLoading, error } = useCategoryTree();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  if (isLoading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load categories
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No categories found. Create one to get started.
      </div>
    );
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderCategory = (category: CustomAccountCategory, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <div key={category.id}>
        <div
          className="flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-100"
          style={{ marginLeft: `${level * 20}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Category Info */}
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: category.color || '#gray' }}
          />
          <div className="flex-1">
            <div className="font-medium">{category.name}</div>
            <div className="text-xs text-gray-500">
              {category.appliedToTypes.join(', ')}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            {onAddChild && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddChild(category)}
                title="Add child category"
              >
                <Plus size={16} />
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(category)}
              >
                <Edit2 size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(category.id)}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            )}
          </div>
        </div>

        {/* Child Categories */}
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg bg-white">
      {categories.map((category) => renderCategory(category))}
    </div>
  );
}
