'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';

interface TableHeaderProps {
  allSelected: boolean;
  partialSelection: boolean;
  onSelectAll: (checked: boolean) => void;
  visibleColumns?: string[];
}

/**
 * Table header with sortable columns
 */
export function TableHeader({
  allSelected,
  partialSelection,
  onSelectAll,
  visibleColumns = ['name', 'type', 'category', 'balance', 'status', 'actions'],
}: TableHeaderProps) {
  const { filters, setSortBy, setSortOrder } = useAccountsUIStore();

  const handleSort = (column: string) => {
    if (filters.sortBy === column) {
      // Toggle sort order
      setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Change sort column and reset to ascending
      setSortBy(column as any);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (filters.sortBy !== column) {
      return <div className="h-4 w-4 text-muted-foreground/30" />;
    }

    return filters.sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary" />
    );
  };

  return (
    <thead>
      <tr className="border-b border-border/50 bg-muted/30 hover:bg-muted/40 transition-colors">
        {/* Checkbox column */}
        <th className="w-12 px-4 py-3 text-left">
          <Checkbox
            checked={allSelected}
            indeterminate={partialSelection}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            className="transition-transform hover:scale-110"
            aria-label="Select all accounts"
          />
        </th>

        {/* Account Name */}
        {visibleColumns.includes('name') && (
          <th
            className={cn(
              'px-4 py-3 text-left text-sm font-semibold',
              'cursor-pointer hover:bg-muted/50 transition-colors',
              'group select-none'
            )}
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center gap-2">
              <span>Account Name</span>
              <SortIcon column="name" />
            </div>
          </th>
        )}

        {/* Account Type */}
        {visibleColumns.includes('type') && (
          <th
            className={cn(
              'px-4 py-3 text-left text-sm font-semibold',
              'cursor-pointer hover:bg-muted/50 transition-colors',
              'hidden sm:table-cell'
            )}
            onClick={() => handleSort('type')}
          >
            <div className="flex items-center gap-2">
              <span>Type</span>
              <SortIcon column="type" />
            </div>
          </th>
        )}

        {/* Category */}
        {visibleColumns.includes('category') && (
          <th className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">
            Category
          </th>
        )}

        {/* Balance */}
        {visibleColumns.includes('balance') && (
          <th
            className={cn(
              'px-4 py-3 text-right text-sm font-semibold',
              'cursor-pointer hover:bg-muted/50 transition-colors',
              'hidden lg:table-cell'
            )}
            onClick={() => handleSort('balance')}
          >
            <div className="flex items-center justify-end gap-2">
              <span>Balance</span>
              <SortIcon column="balance" />
            </div>
          </th>
        )}

        {/* Status */}
        {visibleColumns.includes('status') && (
          <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">
            Status
          </th>
        )}

        {/* Last Synced */}
        {visibleColumns.includes('lastSync') && (
          <th
            className={cn(
              'px-4 py-3 text-left text-sm font-semibold',
              'cursor-pointer hover:bg-muted/50 transition-colors',
              'hidden 2xl:table-cell'
            )}
            onClick={() => handleSort('lastSync')}
          >
            <div className="flex items-center gap-2">
              <span>Last Synced</span>
              <SortIcon column="lastSync" />
            </div>
          </th>
        )}

        {/* Actions */}
        {visibleColumns.includes('actions') && (
          <th className="w-12 px-4 py-3 text-right text-sm font-semibold">
            <span className="sr-only">Actions</span>
          </th>
        )}
      </tr>
    </thead>
  );
}
