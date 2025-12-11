'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, List, Grid } from 'lucide-react';

interface EnvelopeSortingProps {
  sortBy?: 'name' | 'allocatedAmount' | 'spentAmount' | 'createdAt';
  onSortByChange: (sort: 'name' | 'allocatedAmount' | 'spentAmount' | 'createdAt') => void;
  sortOrder?: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const SORT_OPTIONS = [
  { value: 'name', label: 'Name', icon: '📝' },
  { value: 'allocatedAmount', label: 'Allocated Amount', icon: '💰' },
  { value: 'spentAmount', label: 'Spent Amount', icon: '📊' },
  { value: 'createdAt', label: 'Recently Created', icon: '⏰' },
];

export function EnvelopeSorting({
  sortBy = 'createdAt',
  onSortByChange,
  sortOrder = 'desc',
  onSortOrderChange,
  viewMode = 'grid',
  onViewModeChange,
}: EnvelopeSortingProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="flex gap-3 flex-1">
        {/* Sort By */}
        <Select value={sortBy} onValueChange={(val: string) => onSortByChange(val)}>
          <SelectTrigger variant='outline2' size='xs'>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Button
          variant='outline2' size='xs'
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 px-3"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="text-xs font-semibold">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        </Button>
      </div>

      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex gap-1 border rounded-lg p-0.5 bg-card shadow">
          <Button
            variant={viewMode === 'grid' ? 'steel' : 'ghost'}
            size="xs"
            onClick={() => onViewModeChange('grid')}
    
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'steel' : 'ghost'}
            size="xs"
            onClick={() => onViewModeChange('list')}
         
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
