'use client';

import { useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';
import { AccountCard } from './account-card';
import { useBreakpointValue } from '@/lib/hooks/use-breakpoint-value';
import type { UnifiedAccount } from '@/lib/types';

interface AccountsCardGridProps {
  accounts: UnifiedAccount[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (account: UnifiedAccount) => void;
  onDeactivate: (account: UnifiedAccount) => void;
  onReactivate: (account: UnifiedAccount) => void;
  onView?: (id: string) => void;
  balanceVisible: boolean;
  deletingAccountIds?: string[];
  isLoading?: boolean;
}

/**
 * Virtualized responsive card grid with efficient rendering
 * Responsive columns: 1 (mobile), 2 (tablet), 3 (desktop), 4 (wide)
 */
export function AccountsCardGrid({
  accounts,
  selectedIds,
  onToggleSelect,
  onDelete,
  onDeactivate,
  onReactivate,
  onView,
  balanceVisible,
  deletingAccountIds = [],
  isLoading = false,
}: AccountsCardGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Responsive column count based on breakpoint
  const columnCount = useBreakpointValue({
    base: 1,    // Mobile
    sm: 1,      // Small mobile
    md: 2,      // Tablet
    lg: 3,      // Desktop
    xl: 4,      // Wide desktop
    '2xl': 4,   // Ultra wide
  });

  // Calculate row count
  const rowCount = useMemo(
    () => Math.ceil(accounts.length / (columnCount || 1)),
    [accounts.length, columnCount]
  );

  // Card height: 280px (approximate with padding)
  const cardHeight = 280;
  const gap = 16; // 4 (gap-4) = 1rem = 16px
  const estimateSize = cardHeight + gap;

  // Initialize virtualizer for rows
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5, // Render 5 extra rows for smooth scrolling
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Check if all visible accounts are selected
  const allSelected = useMemo(() => {
    if (accounts.length === 0) return false;
    return accounts.every((acc) => selectedIds.includes(acc.id));
  }, [accounts, selectedIds]);

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      accounts.forEach((account) => {
        const isCurrentlySelected = selectedIds.includes(account.id);
        if (checked && !isCurrentlySelected) {
          onToggleSelect(account.id);
        } else if (!checked && isCurrentlySelected) {
          onToggleSelect(account.id);
        }
      });
    },
    [accounts, selectedIds, onToggleSelect]
  );

  // Handle individual card selection
  const handleCardSelect = useCallback(
    (id: string, selected: boolean) => {
      onToggleSelect(id);
    },
    [onToggleSelect]
  );

  if (accounts.length === 0) {
    return null;
  }

  if (!columnCount) {
    // Breakpoint value not ready yet
    return null;
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        'relative border border-border/50 rounded-xl overflow-auto',
        'bg-card shadow-sm'
      )}
      style={{
        height: 'calc(100vh - 300px)',
      }}
    >
      {/* Virtualized grid */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const rowStartIndex = rowIndex * columnCount;
          const rowAccounts = accounts.slice(
            rowStartIndex,
            rowStartIndex + columnCount
          );

          if (rowAccounts.length === 0) return null;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {/* Grid row */}
              <div
                className="grid gap-4 px-4 py-4"
                style={{
                  gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                }}
              >
                {rowAccounts.map((account) => {
                  const isDeletingAccount = deletingAccountIds.includes(account.id);

                  return (
                    <AccountCard
                      key={account.id}
                      account={account}
                      isSelected={selectedIds.includes(account.id)}
                      onSelect={handleCardSelect}
                      onDelete={onDelete}
                      onDeactivate={onDeactivate}
                      onReactivate={onReactivate}
                      onView={onView}
                      balanceVisible={balanceVisible}
                      isDeletingAccount={isDeletingAccount}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-2 border-primary border-r-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading accounts...</p>
          </div>
        </div>
      )}
    </div>
  );
}
