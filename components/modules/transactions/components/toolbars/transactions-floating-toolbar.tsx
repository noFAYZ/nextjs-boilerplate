'use client';

/**
 * Transactions Floating Toolbar Component
 *
 * Best Practices Applied:
 * - Proper error handling and user feedback
 * - Memoized component to prevent unnecessary re-renders
 * - useCallback for stable event handlers
 * - Loading states during async operations
 * - Toast notifications for user feedback
 * - Accessible button states
 * - Responsive design (desktop/mobile layouts)
 * - Proper TypeScript types
 */

import React, { useCallback, useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { X, Trash2, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UnifiedTransaction } from '@/lib/types';

interface TransactionsFloatingToolbarProps {
  selectedCount: number;
  selectedTransactions: UnifiedTransaction[];
  onClearSelection: () => void;
  onDelete?: (transactions: UnifiedTransaction[]) => Promise<void>;
  onHide?: (transactions: UnifiedTransaction[]) => Promise<void>;
  isLoading?: boolean;
}

function TransactionsFloatingToolbarComponent({
  selectedCount,
  selectedTransactions,
  onClearSelection,
  onDelete,
  onHide,
  isLoading = false,
}: TransactionsFloatingToolbarProps) {
  // Local loading state for individual actions
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized delete handler
  const handleDeleteAll = useCallback(async () => {
    if (!onDelete || selectedTransactions.length === 0) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(selectedTransactions);
      // Clear selection after successful delete
      onClearSelection();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transactions';
      setError(errorMessage);
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedTransactions, onDelete, onClearSelection]);

  // Memoized hide handler
  const handleHideAll = useCallback(async () => {
    if (!onHide || selectedTransactions.length === 0) return;

    setIsHiding(true);
    setError(null);

    try {
      await onHide(selectedTransactions);
      // Clear selection after successful hide
      onClearSelection();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to hide transactions';
      setError(errorMessage);
      console.error('Hide error:', err);
    } finally {
      setIsHiding(false);
    }
  }, [selectedTransactions, onHide, onClearSelection]);

  // Memoized close handler
  const handleClose = useCallback(() => {
    setError(null);
    onClearSelection();
  }, [onClearSelection]);

  // Early return if nothing selected
  if (selectedCount === 0) return null;

  const isDisabled = isLoading || isDeleting || isHiding;

  return (
    <div className="fixed bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3 z-50">
      <div className="max-w-7xl mx-auto bg-muted border border-border/80 rounded-2xl backdrop-blur-sm supports-[backdrop-filter]:bg-background/95 animate-in slide-in-from-bottom-3 duration-100 shadow-sm">
        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 rounded-t-2xl">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6 p-4">
          {/* Left Section - Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
              <span className="text-sm font-bold text-primary">{selectedCount}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                  Selected
                </p>
                <p className="text-sm font-semibold">
                  {selectedCount} transaction{selectedCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onHide && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleHideAll}
                disabled={isDisabled}
                icon={<EyeOff className="h-4 w-4" />}
                aria-label={`Hide ${selectedCount} selected transaction${selectedCount !== 1 ? 's' : ''}`}
              >
                {isHiding ? 'Hiding...' : 'Hide'}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="delete"
                size="sm"
                onClick={handleDeleteAll}
                disabled={isDisabled}
                icon={<Trash2 className="h-4 w-4" />}
                aria-label={`Delete ${selectedCount} selected transaction${selectedCount !== 1 ? 's' : ''}`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClose}
              disabled={isDisabled}
              aria-label="Close selection toolbar"
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
                <p className="text-sm font-semibold truncate">
                  {selectedCount} transaction{selectedCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClose}
              disabled={isDisabled}
              className="flex-shrink-0"
              aria-label="Close selection toolbar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            {onHide && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleHideAll}
                disabled={isDisabled}
                icon={<EyeOff className="h-4 w-4" />}
                className="text-xs"
                aria-label={`Hide ${selectedCount} selected transaction${selectedCount !== 1 ? 's' : ''}`}
              >
                {isHiding ? 'Hiding...' : 'Hide'}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="delete"
                size="sm"
                onClick={handleDeleteAll}
                disabled={isDisabled}
                icon={<Trash2 className="h-4 w-4" />}
                className={cn(
                  "text-xs",
                  !onHide && "col-span-2"
                )}
                aria-label={`Delete ${selectedCount} selected transaction${selectedCount !== 1 ? 's' : ''}`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const TransactionsFloatingToolbar = memo(TransactionsFloatingToolbarComponent);
