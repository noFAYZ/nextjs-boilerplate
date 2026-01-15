'use client';

/**
 * Filter Options Drawer
 *
 * Extracted drawer component handling:
 * - Date range filtering
 * - Transaction type, status, and source filters
 * - Export and refresh actions
 */

import { useCallback } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface FilterOptionsDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  // Filters
  typeFilter: string;
  statusFilter: string;
  sourceFilter: string;
  dateRange: { from: Date | null; to: Date | null } | null;
  // Update handlers
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSourceFilterChange: (value: string) => void;
  onDateRangeChange: (from: Date | null, to: Date | null) => void;
  onClearDateRange: () => void;
  onClearAllFilters: () => void;
  // Actions
  onRefresh: () => void;
  isLoading?: boolean;
}

export function FilterOptionsDrawer({
  isOpen,
  onClose,
  typeFilter,
  statusFilter,
  sourceFilter,
  dateRange,
  onTypeFilterChange,
  onStatusFilterChange,
  onSourceFilterChange,
  onDateRangeChange,
  onClearDateRange,
  onClearAllFilters,
  onRefresh,
  isLoading = false,
}: FilterOptionsDrawerProps) {
  const handleCloseAfterClear = useCallback(() => {
    onClearAllFilters();
    onClose(false);
  }, [onClearAllFilters, onClose]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Filters & Options</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Date Range Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Date Range</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">From</label>
                <Input
                  type="date"
                  value={dateRange?.from ? dateRange.from.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    onDateRangeChange(date, dateRange?.to || null);
                  }}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">To</label>
                <Input
                  type="date"
                  value={dateRange?.to ? dateRange.to.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    onDateRangeChange(dateRange?.from || null, date);
                  }}
                  className="h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearDateRange}
                className="w-full"
              >
                Clear Date
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Filters</h3>

            {/* Type Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SEND">Send</SelectItem>
                  <SelectItem value="RECEIVE">Receive</SelectItem>
                  <SelectItem value="SWAP">Swap</SelectItem>
                  <SelectItem value="DEPOSIT">Deposit</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Source</label>
              <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="BANKING">Banking</SelectItem>
                  <SelectItem value="CRYPTO">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseAfterClear}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>

          {/* Data Actions Section */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-sm font-semibold text-foreground">Actions</h3>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              title="Export transactions"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full"
              title={isLoading ? "Refreshing..." : "Refresh transactions"}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
