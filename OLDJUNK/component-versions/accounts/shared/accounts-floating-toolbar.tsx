'use client';

import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, PowerOff, Power, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountsFloatingToolbarProps {
  selectedCount: number;
  isProcessing: boolean;
  processedCount?: number;
  onDeactivate: () => void;
  onReactivate: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

/**
 * Floating toolbar for bulk account actions
 * Displays selection count and action buttons
 * Fixed to bottom with proper responsive design
 */
function AccountsFloatingToolbarComponent({
  selectedCount,
  isProcessing,
  processedCount = 0,
  onDeactivate,
  onReactivate,
  onDelete,
  onClearSelection,
}: AccountsFloatingToolbarProps) {
  const progressPercent = selectedCount > 0 ? (processedCount / selectedCount) * 100 : 0;

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3">
      <div className="max-w-7xl mx-auto bg-muted border border-border/80 rounded-2xl backdrop-blur-sm supports-[backdrop-filter]:bg-background/95 animate-in slide-in-from-bottom-3 duration-100 shadow-sm">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6 p-4">
          {/* Left Section - Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
              <span className="text-sm font-bold text-primary">{selectedCount}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Selected</p>
                <p className="text-sm font-semibold">{selectedCount} account{selectedCount !== 1 ? 's' : ''}</p>
              </div>
              {isProcessing && (
                <>
                  <div className="h-6 w-px bg-border/30" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onDeactivate}
              disabled={isProcessing}
              title="Deactivate selected accounts"
            >
              <PowerOff className="h-4 w-4 mr-1.5" />
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReactivate}
              disabled={isProcessing}
              title="Reactivate selected accounts"
            >
              <Power className="h-4 w-4 mr-1.5" />
              Reactivate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isProcessing}
              title="Delete selected accounts"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearSelection}
              disabled={isProcessing}
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="md:hidden space-y-3 p-3">
          {/* Info Section */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
                <span className="text-sm font-bold text-primary">{selectedCount}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Selected</p>
                <p className="text-sm font-semibold truncate">{selectedCount} account{selectedCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearSelection}
              disabled={isProcessing}
              className="flex-shrink-0"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress (if processing) */}
          {isProcessing && (
            <div className="flex items-center justify-between text-xs px-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
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
          )}

          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDeactivate}
              disabled={isProcessing}
              className="text-xs"
              title="Deactivate"
            >
              <PowerOff className="h-3.5 w-3.5 mr-1" />
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReactivate}
              disabled={isProcessing}
              className="text-xs"
              title="Reactivate"
            >
              <Power className="h-3.5 w-3.5 mr-1" />
              Reactivate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isProcessing}
              className="col-span-2 text-xs"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const AccountsFloatingToolbar = memo(AccountsFloatingToolbarComponent);
