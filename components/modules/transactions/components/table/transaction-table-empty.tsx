'use client';

/**
 * Transaction Table Empty States
 *
 * Displays appropriate empty state messages when no transactions are available
 */

import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw } from 'lucide-react';

interface TransactionTableEmptyProps {
  variant?: 'no-data' | 'no-results';
  onRefresh?: () => void;
}

export function TransactionTableEmpty({
  variant = 'no-data',
  onRefresh,
}: TransactionTableEmptyProps) {
  const isNoData = variant === 'no-data';

  return (
    <div className="text-center py-16 border border-border/50 rounded-xl bg-muted/20">
      <Wallet className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />

      <h3 className="text-lg font-semibold mb-2">
        {isNoData ? 'No transactions found' : 'No matching transactions'}
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        {isNoData
          ? 'Connect your banking and crypto accounts to start tracking transactions'
          : 'Try adjusting your search or filters'}
      </p>

      {isNoData && onRefresh && (
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Refreshing
        </Button>
      )}
    </div>
  );
}
