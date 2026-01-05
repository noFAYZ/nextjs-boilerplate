'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BulkSelectHeaderProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  className?: string;
}

/**
 * Header that appears when accounts are selected
 * Shows selection count and quick select/clear actions
 */
export function BulkSelectHeader({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  className,
}: BulkSelectHeaderProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const partialSelection = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3',
        'bg-primary/5 border-b border-primary/10',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      {/* Left section: Checkbox and count */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          indeterminate={partialSelection}
          onCheckedChange={(checked) => {
            if (checked || partialSelection) {
              onSelectAll();
            } else {
              onClearSelection();
            }
          }}
          className="transition-transform hover:scale-110"
        />

        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            {selectedCount} of {totalCount} selected
          </p>

          <div className="flex items-center gap-2">
            {!allSelected && (
              <Button
                variant="link"
                size="xs"
                onClick={onSelectAll}
                className="h-auto p-0 text-xs text-primary hover:text-primary/80"
              >
                Select all {totalCount}
              </Button>
            )}

            {selectedCount > 0 && (
              <>
                {!allSelected && <span className="text-xs text-muted-foreground">•</span>}
                <Button
                  variant="link"
                  size="xs"
                  onClick={onClearSelection}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Status indicator */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            'gap-1.5 pl-2.5',
            'bg-primary/5 border-primary/20',
            'animate-pulse'
          )}
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs font-medium">Selection mode</span>
        </Badge>
      </div>
    </div>
  );
}

/**
 * Floating toolbar for bulk actions
 * Shows progress during batch operations
 */
interface FloatingToolbarProps {
  selectedCount: number;
  isProcessing: boolean;
  processedCount?: number;
  onDelete: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  isProcessing,
  processedCount = 0,
  onDelete,
  onDeactivate,
  onReactivate,
}: FloatingToolbarProps) {
  const progressPercent = selectedCount > 0 ? (processedCount / selectedCount) * 100 : 0;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-40',
        'px-4 py-3 rounded-lg bg-popover border border-border/50',
        'shadow-lg backdrop-blur-sm',
        'flex items-center gap-3',
        'animate-in fade-in slide-in-from-bottom-4 duration-300'
      )}
    >
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onDeactivate}
          disabled={isProcessing}
          className="gap-2"
        >
          <span className="h-4 w-4">🔴</span>
          Deactivate
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onReactivate}
          disabled={isProcessing}
          className="gap-2"
        >
          <span className="h-4 w-4">🟢</span>
          Reactivate
        </Button>

        <div className="w-px h-6 bg-border" />

        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          disabled={isProcessing}
          className="gap-2"
        >
          <span className="h-4 w-4">🗑️</span>
          Delete
        </Button>
      </div>

      {/* Progress indicator */}
      {isProcessing && (
        <>
          <div className="w-px h-6 bg-border" />

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>
                {processedCount} of {selectedCount}
              </span>
            </div>

            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
