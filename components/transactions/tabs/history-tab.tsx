'use client';

import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RotateCcw } from 'lucide-react';
import type { UnifiedTransaction } from '@/lib/types';

interface HistoryTabProps {
  transaction: UnifiedTransaction;
}

interface EditLogEntry {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

export function HistoryTab({ transaction }: HistoryTabProps) {
  const [editLog] = useState<EditLogEntry[]>([]);
  // TODO: Populate editLog when tracking field changes

  // Mock category history - would come from API
  const categoryHistory = [
    {
      id: '1',
      previousCategory: 'Groceries',
      newCategory: 'Food & Dining',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      changedBy: 'You',
      method: 'Manual categorization',
    },
    {
      id: '2',
      previousCategory: 'Uncategorized',
      newCategory: 'Groceries',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      changedBy: 'Auto-rule',
      method: 'Rule: Whole Foods → Groceries',
    },
  ];

  // Mock status history - would come from API
  const statusHistory = [
    {
      id: '1',
      fromStatus: 'PENDING',
      toStatus: 'COMPLETED',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      fromStatus: 'PROCESSING',
      toStatus: 'PENDING',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const handleRevertCategory = (historyId: string) => {
    // TODO: Implement revert mutation
    console.log('Revert category:', historyId);
  };

  return (
    <div className="space-y-4">
      {/* Category History */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Category History</p>
        <div className="space-y-2">
          {categoryHistory.length > 0 ? (
            categoryHistory.map((entry) => (
              <div
                key={entry.id}
                className="border border-border/50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {entry.previousCategory} → <span className="text-primary">{entry.newCategory}</span>
                    </p>
                    <p className="text-xs text-foreground/60 mt-1">
                      {entry.method} by {entry.changedBy}
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRevertCategory(entry.id)}
                  className="w-full h-8 text-xs font-medium gap-1.5"
                >
                  <RotateCcw className="h-3 w-3" />
                  Revert to {entry.previousCategory}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-xs text-foreground/60">No category history</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Status History */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Status History</p>
        <div className="space-y-2">
          {statusHistory.length > 0 ? (
            statusHistory.map((entry) => (
              <div
                key={entry.id}
                className="border border-border/50 rounded-lg p-3"
              >
                <p className="text-sm font-medium">
                  {entry.fromStatus} → <span className="text-primary">{entry.toStatus}</span>
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-foreground/60">No status history</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Edit Log - Client-side changes during this session */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Recent Changes (This Session)</p>
        <div className="space-y-2">
          {editLog.length > 0 ? (
            editLog.map((edit, idx) => (
              <div
                key={idx}
                className="border border-border/50 rounded-lg p-3"
              >
                <p className="text-sm font-medium capitalize">{edit.field}</p>
                <p className="text-xs text-foreground/60 mt-1">
                  {edit.oldValue || '(empty)'} → {edit.newValue || '(empty)'}
                </p>
                <p className="text-xs text-foreground/50 mt-0.5">
                  {format(new Date(edit.timestamp), 'HH:mm:ss')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-foreground/60">No unsaved changes in this session</p>
          )}
        </div>
      </div>
    </div>
  );
}
