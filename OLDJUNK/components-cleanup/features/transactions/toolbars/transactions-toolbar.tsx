'use client';

/**
 * Transactions Toolbar
 *
 * Top toolbar with:
 * - Search input
 * - Auto-categorize button
 * - Bulk edit toggle
 * - Filter button
 * - Active filters display
 */

import { memo, useCallback } from 'react';
import {
  Search,
  Zap,
  CheckSquare,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { StreamlineFlexFilter2 } from '@/components/icons/icons';

interface TransactionsToolbarProps {
  // Search & Filters
  searchTerm: string;
  onSearchChange: (value: string) => void;
  uncategorizedCount: number;
  activeFilters: Array<{ key: string; label: string; value: string }>;
  onFilterRemove: (key: string) => void;
  onClearAllFilters: () => void;

  // UI State
  isBulkSelectMode: boolean;
  onToggleBulkSelect: () => void;

  // Actions
  onFilterClick: () => void;
  hasActiveFilters: boolean;
}

function TransactionsToolbarComponent({
  searchTerm,
  onSearchChange,
  uncategorizedCount,
  activeFilters,
  onFilterRemove,
  onClearAllFilters,
  isBulkSelectMode,
  onToggleBulkSelect,
  onFilterClick,
  hasActiveFilters,
}: TransactionsToolbarProps) {
  return (
    <div>
      {/* Search Bar and Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Search by description, or account..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-8 max-w-xs"
            />
          </div>
        </div>

        {/* Action Buttons: Auto Categorize, Edit Multiple, Filter */}
        <div className="flex gap-2">
          {/* Auto Categorize Button */}
          <Button
            variant="brand"
            size="xs"
            title={uncategorizedCount > 0 ? `Auto categorize ${uncategorizedCount} transaction${uncategorizedCount !== 1 ? 's' : ''}` : 'No uncategorized transactions'}
            disabled={uncategorizedCount === 0}
          >
            <Zap className="h-4 w-4" />
            Auto Categorize ({uncategorizedCount})
          </Button>

          {/* Edit Multiple Button */}
          <Button
            variant={isBulkSelectMode ? "secondary" : "outline2"}
            size="xs"
            onClick={onToggleBulkSelect}
            title={isBulkSelectMode ? "Exit bulk selection mode" : "Enter bulk selection mode"}
            className={isBulkSelectMode ? "bg-muted/40" : ""}
          >
            <CheckSquare className="h-4 w-4" />
            {isBulkSelectMode ? "Cancel" : "Edit Multiple"}
          </Button>

          {/* Filter Button - Opens Options Drawer */}
          <Button
            variant="outline2"
            size="xs"
            onClick={onFilterClick}
            title="Open filters and options"
            className={hasActiveFilters ? 'bg-muted/40' : ''}
          >
            <StreamlineFlexFilter2 className="h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-border/30">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/60 hover:bg-muted/80 rounded-full text-xs font-medium transition-colors"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => onFilterRemove(filter.key)}
                className="hover:text-foreground ml-1 transition-colors"
                title="Remove filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAllFilters}
            className="text-xs h-7 ml-2"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

export const TransactionsToolbar = memo(TransactionsToolbarComponent);
