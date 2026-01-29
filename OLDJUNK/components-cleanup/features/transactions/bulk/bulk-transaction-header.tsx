'use client';

/**
 * Bulk Transaction Header Component
 *
 * Appears when transactions are selected in bulk mode
 * Shows selection count, select all/clear buttons, and edit button
 */

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface BulkTransactionHeaderProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onOpenBulkEdit: () => void;
}

export function BulkTransactionHeader({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onOpenBulkEdit,
}: BulkTransactionHeaderProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-secondary rounded   mb-4 animate-in fade-in duration-100">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={selectedCount === totalCount}
          indeterminate={selectedCount > 0 && selectedCount < totalCount ? 'indeterminate' : undefined}
          onCheckedChange={(checked) => {
            if (checked) {
              onSelectAll();
            } else {
              onClearSelection();
            }
          }}
          aria-label="Select all transactions"
        />
        <p className="text-sm font-medium">
          {selectedCount} of {totalCount} selected
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="xs"
          onClick={onSelectAll}
          className="text-xs"
        >
          Select All
        </Button>

        <Button
          variant="ghost"
          size="xs"
          onClick={onClearSelection}
          className="text-xs"
        >
          Clear
        </Button>

        <Button
          size="xs"
          onClick={onOpenBulkEdit}
          disabled={selectedCount === 0}
          className="text-xs"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit {selectedCount} Txs{selectedCount !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
}
