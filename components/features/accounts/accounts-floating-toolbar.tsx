'use client';

import { Button } from '@/components/ui/button';
import { X, PowerOff, Power, Trash2 } from 'lucide-react';

interface AccountsFloatingToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function AccountsFloatingToolbar({
  selectedCount,
  onClearSelection,
  onDeactivate,
  onReactivate,
  onDelete,
  isLoading = false,
}: AccountsFloatingToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3 z-50">
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
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDeactivate}
              disabled={isLoading}
              icon={<PowerOff className="h-4.5 w-4.5" />}
            >
              Deactivate
            </Button>
            <Button
              variant="successbrand"
              size="sm"
              onClick={onReactivate}
              disabled={isLoading}
              icon={<Power className="h-4.5 w-4.5" />}
            >
              Reactivate
            </Button>
            <Button
              variant="delete"
              size="sm"
              onClick={onDelete}
              disabled={isLoading}
              icon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearSelection}
              disabled={isLoading}
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
              disabled={isLoading}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDeactivate}
              disabled={isLoading}
              icon={<PowerOff className="h-4 w-4" />}
              className="text-xs"
            >
              Deactivate
            </Button>
            <Button
              variant="successbrand"
              size="sm"
              onClick={onReactivate}
              disabled={isLoading}
              icon={<Power className="h-4 w-4" />}
              className="text-xs"
            >
              Reactivate
            </Button>
            <Button
              variant="delete"
              size="sm"
              onClick={onDelete}
              disabled={isLoading}
              icon={<Trash2 className="h-4 w-4" />}
              className="col-span-2 text-xs"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
